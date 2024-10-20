// src/components/admin/CommitGraph.tsx

'use client';

import React, { useEffect, useState } from 'react';
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
  // 貢献度を計算する．式は後々のアップデートで
  return shots;
};

const CommitGraph: React.FC = () => {
  const { loading, adminUid } = useAdminAuth();
  const [data, setData] = useState<ChartData[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (loading) return;
    if (!adminUid) return;

    const fetchData = async () => {
      setDataLoading(true);
      setError('');

      try {
        const usersRef = collection(firestore, 'users');
        const membersQuery = query(usersRef, where('leader', '==', adminUid));
        const membersSnapshot = await getDocs(membersQuery);

        if (membersSnapshot.empty) {
          console.log('管理者に属するメンバーが見つかりませんでした。');
          setData([]);
          setDataLoading(false);
          return;
        }

        const members = membersSnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            uid: docSnap.id,
            lastName: data.lastName || '',
            firstName: data.firstName || '',
          };
        });

        const chartDataPromises = members.map(async (member) => {
          const reportsRef = collection(firestore, 'reports');
          const reportsQuery = query(
            reportsRef,
            where('userId', '==', member.uid)
          );
          const reportsSnapshot = await getDocs(reportsQuery);

          let totalShots = 0;
          reportsSnapshot.forEach((reportDoc) => {
            const reportData = reportDoc.data();
            totalShots += reportData.shots || 0;
          });

          return {
            name: `${member.lastName} ${member.firstName}`,
            contribution: calculateContribution(totalShots),
          };
        });

        const chartDataResults = await Promise.all(chartDataPromises);

        setData(chartDataResults);
      } catch (error: unknown) {
        console.error('データの取得中にエラーが発生しました：', error);
        if (error instanceof Error) {
          setError(`データの取得に失敗しました：${error.message}`);
        } else {
          setError('データの取得に失敗しました：不明なエラー');
        }
      }

      setDataLoading(false);
    };

    fetchData();
  }, [loading, adminUid]);

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
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
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

export default CommitGraph;
