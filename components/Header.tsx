// TODO: リファクタリング

"use client";

import React, { useState, useEffect } from "react";
import { MdMenu } from "react-icons/md";
import SideNav from "./SideNav";
import Link from "next/link";

interface HeaderProps {
  showExtras: boolean;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ showExtras, userName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen || isSideNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMenuOpen, isSideNavOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const closeSideNav = () => {
    setIsSideNavOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-gray-100 py-4 w-full fixed top-0 left-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          <div className="flex items-center">
            {showExtras && (
              <>
                <button
                  className={`focus:outline-none text-gray-700 md:hidden transform transition-transform duration-300 ${
                    isMenuOpen ? "rotate-90" : ""
                  }`}
                  aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
                  onClick={toggleMenu}
                >
                  <MdMenu className="w-6 h-6" />
                </button>

                <button
                  className={`hidden md:block focus:outline-none text-gray-700 transform transition-transform duration-300 ${
                    isSideNavOpen ? "rotate-90" : ""
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
            {showExtras && userName && (
              <span className="text-lg font-medium text-gray-700 hidden md:block">
                {userName}
              </span>
            )}
          </div>
        </div>

        {showExtras && isMenuOpen && (
          <nav className="md:hidden bg-white shadow-lg rounded-b-lg transition-all duration-300 ease-in-out">
            <ul className="flex flex-col p-4 space-y-2">
              <li>
                <Link
                  href="/member"
                  className="text-gray-700 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  onClick={closeMenu}
                >
                  撮影報告
                </Link>
              </li>
              <li>
                <Link
                  href="/member/past-report"
                  className="text-gray-700 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  onClick={closeMenu}
                >
                  撮影報告履歴
                </Link>
              </li>
              <li>
                <Link
                  href="/member/member-list"
                  className="text-gray-700 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  onClick={closeMenu}
                >
                  メンバー
                </Link>
              </li>
              <li>
                <Link
                  href="/logout"
                  className="text-gray-700 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  onClick={closeMenu}
                >
                  ログアウト
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>

      {showExtras && (
        <SideNav isOpen={isSideNavOpen} onClose={closeSideNav} />
      )}
    </>
  );
};

export default Header;
