'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import useMemberAuth from '@/src/hooks/useMemberAuth';
import SpinnerIcon from '@/components/SpinnerIcon';
import { auth, firestore } from '@/src/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ReportDetailItem from '@/components/common/ReportDetailItem';

interface Report {
  id: string;
  startTime: string;
  endTime: string;
  location: string;
  shots: number;
  notes: string;
  comments?: string;
}

const PastReportSection: React.FC = () => {
  const { leader } = useMemberAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const reportsPerPage = 3;

  const fetchReports = async () => {
    setReportsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        return;
      }

      const reportsRef = collection(firestore, 'reports');
      const q = query(reportsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const reportsData: Report[] = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          startTime: data.startTime.toDate().toLocaleString(),
          endTime: data.endTime.toDate().toLocaleString(),
          location: data.location,
          shots: data.shots,
          notes: data.notes,
          comments: data.comments || '',
        };
      });

      setReports(reportsData);
    } catch (error: unknown) {
      console.error('報告データの取得に失敗しました：', error);
      alert('報告データの取得に失敗しました。再度お試しください。');
    }
    setReportsLoading(false);
  };

  const totalPages = Math.ceil(reports.length / reportsPerPage);
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (leader !== undefined) {
      fetchReports();
    }
  }, [leader]);

  return (
    <div className="w-full max-w-2xl">
      <div className="w-full mx-auto p-6 bg-white rounded shadow">
        <p className="text-2xl font-semibold mb-8 text-center">
          過去の撮影報告
        </p>
        {reportsLoading ? (
          <div className="flex items-center justify-center">
            <SpinnerIcon />
          </div>
        ) : reports.length === 0 ? (
          <p className="text-center text-gray-500">
            提出された報告はありません。
          </p>
        ) : (
          <>
            {currentReports.map((report) => (
              <div key={report.id} className="mb-4 border-b pb-4">
                <ReportDetailItem
                  label="開始時間"
                  value={report.startTime}
                />
                <ReportDetailItem label="終了時間" value={report.endTime} />
                <ReportDetailItem label="撮影場所" value={report.location} />
                <ReportDetailItem label="撮影枚数" value={report.shots} />
                <ReportDetailItem label="備考" value={report.notes} />
                {report.comments && (
                  <ReportDetailItem
                    label="管理者コメント"
                    value={report.comments}
                  />
                )}
              </div>
            ))}

            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 rounded ${
                      currentPage === number
                        ? 'bg-purple-500 text-white'
                        : 'bg-purple-300 text-white'
                    }`}
                  >
                    {number}
                  </button>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const MemberPastReportPage: React.FC = () => {
  const { loading } = useMemberAuth();

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
      <main className="flex-grow flex flex-col items-center p-4 pt-[8rem] pb-[3rem]">
        <PastReportSection />
      </main>
      <Footer />
    </div>
  );
};

export default MemberPastReportPage;
