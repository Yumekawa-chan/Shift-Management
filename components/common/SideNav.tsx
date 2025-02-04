'use client';

import React, { useEffect } from 'react';
import { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { IoMdClose } from 'react-icons/io';
import MenuItem from '@/components/common/MenuItem';

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
  handleLogout: () => void;
}

const SideNav: React.FC<SideNavProps> = ({
  isOpen,
  onClose,
  userRole,
  handleLogout,
}) => {
  const handleOverlayClick = () => {
    onClose();
  };

  const handleKeyDown = React.useCallback(
    (event: ReactKeyboardEvent | KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={handleOverlayClick}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex items-center justify-between p-4 border-b border-purple-200">
          <p className="text-2xl font-bold text-purple-500">Menu</p>
          <button
            className="focus:outline-none text-purple-500"
            aria-label="メニューを閉じる"
            onClick={onClose}
          >
            <IoMdClose className="w-6 h-6 hover:text-purple-400" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="flex flex-col space-y-4">
            {userRole === 'admin' ? (
              <>
                <MenuItem
                  href="/admin"
                  itemName="撮影報告一覧"
                  onClick={onClose}
                />
                <MenuItem
                  href="/admin/commit-graph"
                  itemName="貢献グラフ"
                  onClick={onClose}
                />
                <MenuItem
                  href="/admin/manage-member"
                  itemName="メンバー管理"
                  onClick={onClose}
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
                  onClick={onClose}
                />
                <MenuItem
                  href="/member/past-report"
                  itemName="撮影報告履歴"
                  onClick={onClose}
                />
                <MenuItem
                  href="/member/member-list"
                  itemName="メンバー"
                  onClick={onClose}
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
      </aside>
    </>
  );
};

export default SideNav;
