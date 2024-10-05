'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MdMenu } from 'react-icons/md';
import SideNav from '@/components/SideNav';
import MenuItem from '@/components/common/MenuItem';
import useBodyScrollLock from '@/src/hooks/useBodyScrollLock';
import { auth, firestore } from '@/src/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>('');
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
            const userData = userDoc.data();
            setUserName(`${userData.lastName} ${userData.firstName}`);
          } else {
            setUserName('');
          }
        } catch (error) {
          console.error('ユーザーデータの取得に失敗しました:', error);
          setUserName('');
        }
      } else {
        setCurrentUser(null);
        setUserName('');
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
      <header className="bg-gray-100 py-4 w-full fixed top-0 left-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          <div className="flex items-center">
            {currentUser && (
              <>
                <button
                  className={`focus:outline-none text-gray-700 md:hidden transform transition-transform duration-300 ${
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
                  className={`hidden md:block focus:outline-none text-gray-700 transform transition-transform duration-300 ${
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

          <p className="text-2xl font-bold">Hyperionix</p>

          <div className="flex items-center">
            {currentUser && (
              <>
                <span className="text-lg font-medium text-gray-700 hidden md:block">
                  {userName}
                </span>
              </>
            )}
          </div>
        </div>

        {currentUser && isMenuOpen && (
          <nav className="md:hidden bg-white shadow-lg rounded-b-lg transition-all duration-300 ease-in-out">
            <ul className="flex flex-col p-4 space-y-2">
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
              <li>
                <button
                  onClick={() => {
                    closeMenu();
                    handleLogout();
                  }}
                  className="w-full text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  ログアウト
                </button>
              </li>
            </ul>
          </nav>
        )}
      </header>

      {currentUser && (
        <SideNav isOpen={isSideNavOpen} onClose={closeSideNav} />
      )}
    </>
  );
};

export default Header;
