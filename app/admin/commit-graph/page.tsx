'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CommitGraphSection: React.FC = () => {
  return (
    <div className="w-full mx-auto p-6 bg-white rounded shadow">
        <p className='text-xl'>hogehoge</p>
    </div>
  );
};

const CommitGraph: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header showExtras userName="管理者ユーザー" />
      <main className="flex-grow flex flex-col items-center p-4 mt-[8rem]">
        <div className="w-full max-w-4xl">
          <CommitGraphSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommitGraph;
