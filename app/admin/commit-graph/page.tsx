'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { firestore } from '@/src/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import useAdminAuth from '@/src/hooks/useAdminAuth';
import SpinnerIcon from '@/components/SpinnerIcon';

interface ChartData {
  name: string;
  contribution: number;
}

const calculateContribution = (shots: number): number => {
  return shots; // 現時点での計算ロジック
};

const CommitGraphSection: React.FC<{ data: ChartData[] }> = ({ data }) => {
  return (
    <div className="w-full mx-auto p-6 bg-white rounded shadow">
      <p className="text-2xl font-semibold mb-4 text-center">
        メンバーごとの貢献度
      </p>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              label={{
                value: '貢献度',
                position: 'insideBottomRight',
                offset: 0,
              }}
            />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Bar dataKey="contribution" fill="#ff8eff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CommitGraph: React.FC = () => {
  const { loading, adminUid } = useAdminAuth();
  const [data, setData] = useState<ChartData[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchData = useCallback(async () => {
    if (!adminUid) return;

    setDataLoading(true);
    setError('');

    try {
      const usersRef = collection(firestore, 'users');
      const membersQuery = query(usersRef, where('leader', '==', adminUid));
      const membersSnapshot = await getDocs(membersQuery);

      if (membersSnapshot.empty) {
        console.log('管理者に属するメンバーが見つかりませんでした。');
        setData([]);
        return;
      }

      const members = membersSnapshot.docs.map((docSnap) => ({
        uid: docSnap.id,
        lastName: docSnap.data().lastName || '',
        firstName: docSnap.data().firstName || '',
      }));

      const chartDataResults = await Promise.all(
        members.map(async (member) => {
          const reportsRef = collection(firestore, 'reports');
          const reportsQuery = query(
            reportsRef,
            where('userId', '==', member.uid)
          );
          const reportsSnapshot = await getDocs(reportsQuery);

          const totalShots = reportsSnapshot.docs.reduce((sum, reportDoc) => {
            return sum + (reportDoc.data().shots || 0);
          }, 0);

          return {
            name: `${member.lastName} ${member.firstName}`,
            contribution: calculateContribution(totalShots),
          };
        })
      );

      setData(chartDataResults);
    } catch (error: unknown) {
      console.error('データの取得中にエラーが発生しました：', error);
      if (error instanceof Error) {
        setError(`データの取得に失敗しました：${error.message}`);
      } else {
        setError('データの取得に失敗しました：不明なエラー');
      }
    } finally {
      setDataLoading(false);
    }
  }, [adminUid]);

  useEffect(() => {
    if (!loading) fetchData();
  }, [loading, fetchData]);

  if (loading || dataLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinnerIcon />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-rose-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center p-4 mt-[8rem]">
        <div className="w-full max-w-4xl">
          <CommitGraphSection data={data} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommitGraph;
