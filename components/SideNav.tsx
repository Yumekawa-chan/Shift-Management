// TODO: リファクタリング

"use client";

import React from "react";
import { IoMdClose } from "react-icons/io";
import Link from "next/link";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <p className="text-2xl font-bold">メニュー</p>
          <button
            className="focus:outline-none text-gray-700"
            aria-label="メニューを閉じる"
            onClick={onClose}
          >
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link
                href="/member"
                className="text-gray-700 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                onClick={onClose}
              >
                撮影報告
              </Link>
            </li>
            <li>
              <Link
                href="/member/past-report"
                className="text-gray-700 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                onClick={onClose}
              >
                撮影報告履歴
              </Link>
            </li>
            <li>
              <Link
                href="/member/member-list"
                className="text-gray-700 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                onClick={onClose}
              >
                メンバー
              </Link>
            </li>
            <li>
              <Link
                href="/logout"
                className="text-gray-700 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                onClick={onClose}
              >
                ログアウト
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default SideNav;
