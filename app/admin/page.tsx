'use client';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import useAdminAuth from '@/src/hooks/useAdminAuth';
import ReportList from '@/components/admin/ReportList';
import SpinnerIcon from '@/components/common/SpinnerIcon';

const AdminPage: React.FC = () => {
  const { loading, adminUid } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinnerIcon />
      </div>
    );
  }

  console.log('adminUid:', adminUid);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center p-4 pt-[7rem] pb-[3rem]">
        <div className="w-full max-w-3xl">
          {adminUid && <ReportList adminUid={adminUid} />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
