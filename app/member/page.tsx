'use client';

import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import useMemberAuth from '@/src/hooks/useMemberAuth';
import FormSection from '@/components/member/FormSection';
import SpinnerIcon from '@/components/common/SpinnerIcon';

const MemberPage: React.FC = () => {
  const { loading, leader } = useMemberAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinnerIcon />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center p-4 pt-[7rem] pb-[3rem]">
        <div className="w-full max-w-2xl">
          <FormSection leader={leader} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MemberPage;
