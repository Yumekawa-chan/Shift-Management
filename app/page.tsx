"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaTimes, FaUser, FaUserPlus } from 'react-icons/fa';

const AdminLoginForm = () => (
  <div className="flex flex-col gap-4">
    <h2 className="text-xl font-semibold mb-4 flex items-center">
      <FaUser className="mr-2" /> 管理者ログイン
    </h2>
    <label className="flex flex-col">
      メールアドレス
      <input type="email" className="border rounded px-3 py-2 w-full mt-1" placeholder="example@example.com" />
    </label>
    <label className="flex flex-col">
      パスワード
      <input type="password" className="border rounded px-3 py-2 w-full mt-1" placeholder="••••••••" />
    </label>
    <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors duration-300 mt-4 flex items-center justify-center">
      ログイン
    </button>
  </div>
);

const MemberLoginForm = () => (
  <div className="flex flex-col gap-4">
    <h2 className="text-xl font-semibold mb-4 flex items-center">
      <FaUser className="mr-2" /> メンバーログイン
    </h2>
    <label className="flex flex-col">
      メールアドレス
      <input type="email" className="border rounded px-3 py-2 w-full mt-1" placeholder="example@example.com" />
    </label>
    <label className="flex flex-col">
      パスワード
      <input type="password" className="border rounded px-3 py-2 w-full mt-1" placeholder="••••••••" />
    </label>
    <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors duration-300 mt-4 flex items-center justify-center">
      ログイン
    </button>
  </div>
);

const MemberRegistrationForm = () => (
  <div className="flex flex-col gap-4">
    <h2 className="text-xl font-semibold mb-4 flex items-center">
      <FaUserPlus className="mr-2" /> メンバー登録
    </h2>
    <label className="flex flex-col">
      姓
      <input type="text" className="border rounded px-3 py-2 w-full mt-1" placeholder="山田" />
    </label>
    <label className="flex flex-col">
      名
      <input type="text" className="border rounded px-3 py-2 w-full mt-1" placeholder="太郎" />
    </label>
    <label className="flex flex-col">
      学年
      <select className="border rounded px-3 py-2 w-full mt-1">
        <option value="B3">B3</option>
        <option value="B4">B4</option>
        <option value="M1">M1</option>
        <option value="M2">M2</option>
      </select>
    </label>
    <label className="flex flex-col">
      メールアドレス
      <input type="email" className="border rounded px-3 py-2 w-full mt-1" placeholder="example@example.com" />
    </label>
    <label className="flex flex-col">
      パスワード
      <input type="password" className="border rounded px-3 py-2 w-full mt-1" placeholder="8文字以上" />
    </label>
    <label className="flex flex-col">
      パスワード（確認）
      <input type="password" className="border rounded px-3 py-2 w-full mt-1" placeholder="もう一度入力" />
    </label>
    <label className="flex flex-col">
      リーダー選択
      <select className="border rounded px-3 py-2 w-full mt-1">
        <option value="tanaka">田中</option>
        <option value="suzuki">鈴木</option>
        <option value="sato">佐藤</option>
      </select>
    </label>
    <button className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700 transition-colors duration-300 mt-4 flex items-center justify-center">
      登録する
    </button>
  </div>
);

const HomeMain = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (content: JSX.Element) => {
    setModalContent(content);
    setModalIsOpen(true);
    setTimeout(() => setModalVisible(true), 10);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => {
      setModalIsOpen(false);
      setModalContent(null);
    }, 300);
  };

  return (
    <main className="flex flex-col items-center justify-center flex-grow">
      <p className="text-2xl font-semibold mb-6">ログイン</p>
      <div className="flex flex-col items-center gap-4">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 flex items-center"
          onClick={() => openModal(<AdminLoginForm />)}
        >
          <FaUser className="mr-2" />
          管理者としてログイン
        </button>
        <button
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 flex items-center"
          onClick={() => openModal(<MemberLoginForm />)}
        >
          <FaUser className="mr-2" />
          メンバーとしてログイン
        </button>
        <button
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 flex items-center"
          onClick={() => openModal(<MemberRegistrationForm />)}
        >
          <FaUserPlus className="mr-2" />
          メンバー登録
        </button>
      </div>

      {modalIsOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
            modalVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className={`bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative transform transition-transform duration-300 ${
              modalVisible ? 'scale-100' : 'scale-90'
            }`}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <FaTimes size={24} />
            </button>
            {modalContent}
          </div>
        </div>
      )}
    </main>
  );
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header showExtras={false} />
      <HomeMain />
      <Footer />
    </div>
  );
}
