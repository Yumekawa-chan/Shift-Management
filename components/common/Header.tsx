'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MdMenu } from 'react-icons/md';
import SideNav from '@/components/common/SideNav';
import MenuItem from '@/components/common/MenuItem';
import useBodyScrollLock from '@/src/hooks/useBodyScrollLock';
import { auth, firestore } from '@/src/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface UserData {
  lastName: string;
  firstName: string;
  role: string;
}

const Header: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const router = useRouter();

  useBodyScrollLock(isMenuOpen || isSideNavOpen);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const closeSideNav = useCallback(() => {
    setIsSideNavOpen(false);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
        closeSideNav();
      }
    },
    [closeMenu, closeSideNav]
  );

  useEffect(() => {
    if (isMenuOpen || isSideNavOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, isMenuOpen, isSideNavOpen]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserData;
            setUserName(`${userData.lastName} ${userData.firstName}`);
            setUserRole(userData.role);
          } else {
            setUserName('');
            setUserRole('');
          }
        } catch (error) {
          console.error('ユーザーデータの取得に失敗しました:', error);
          setUserName('');
          setUserRole('');
        }
      } else {
        setCurrentUser(null);
        setUserName('');
        setUserRole('');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <>
      <header className="py-4 w-full fixed top-0 left-0 z-20 bg-gradient-to-r from-pink-300 via-violet-300 to-blue-200 border-pink-400 shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          <div className="flex items-center">
            {currentUser && userRole && (
              <>
                <button
                  className={`focus:outline-none text-purple-500 md:hidden transform transition-transform duration-300 ${
                    isMenuOpen ? 'rotate-90' : ''
                  }`}
                  aria-label={
                    isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'
                  }
                  onClick={toggleMenu}
                >
                  <MdMenu className="w-6 h-6" />
                </button>

                <button
                  className={`hidden md:block focus:outline-none text-purple-500 transform transition-transform duration-300 ${
                    isSideNavOpen ? 'rotate-90' : ''
                  }`}
                  aria-label="サイドナビゲーションを開く"
                  onClick={toggleSideNav}
                >
                  <MdMenu className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <p className="text-2xl font-bold text-purple-500">
            Yumekawa Management 🌈 🦄
          </p>

          <div className="flex items-center">
            {currentUser && userName && (
              <span className="text-lg font-medium text-purple-500 hidden md:block">
                {userName}
              </span>
            )}
          </div>
        </div>

        {currentUser && userRole && isMenuOpen && (
          <nav className="md:hidden bg-white shadow rounded-b-lg transition-all duration-300 ease-in-out">
            <ul className="flex flex-col p-4 space-y-2">
              {userRole === 'admin' ? (
                <>
                  <MenuItem
                    href="/admin"
                    itemName="撮影報告一覧"
                    onClick={closeMenu}
                  />
                  <MenuItem
                    href="/admin/commit-graph"
                    itemName="貢献グラフ"
                    onClick={closeMenu}
                  />
                  <MenuItem
                    href="/admin/manage-member"
                    itemName="メンバー管理"
                    onClick={closeMenu}
                  />
                  <MenuItem
                    href="/"
                    itemName="ログアウト"
                    onClick={handleLogout}
                  />
                </>
              ) : userRole === 'member' ? (
                <>
                  <MenuItem
                    href="/member"
                    itemName="撮影報告"
                    onClick={closeMenu}
                  />
                  <MenuItem
                    href="/member/past-report"
                    itemName="撮影報告履歴"
                    onClick={closeMenu}
                  />
                  <MenuItem
                    href="/member/member-list"
                    itemName="メンバー"
                    onClick={closeMenu}
                  />
                  <MenuItem
                    href="/"
                    itemName="ログアウト"
                    onClick={handleLogout}
                  />
                </>
              ) : null}
            </ul>
          </nav>
        )}
      </header>

      {currentUser && userRole && (
        <SideNav
          isOpen={isSideNavOpen}
          onClose={closeSideNav}
          userRole={userRole}
          handleLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Header;
