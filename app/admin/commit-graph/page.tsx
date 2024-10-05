'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { firestore } from '@/src/lib/firebase';
import {
  collection, query, where, getDocs,
} from 'firebase/firestore';
import useAdminAuth from '@/src/hooks/useAdminAuth';
import SpinnerIcon from '@/components/SpinnerIcon';

interface ChartData {
  name: string;
  contribution: number;
}

const calculateContribution = (shots: number): number => {
  const impactBonus = Math.log(shots + 1) * 20;
  const growthBonus = Math.sqrt(shots) * 10;
  const conditionEffect = Math.abs(Math.cos(shots) * 30);
  const exponentialGrowth = Math.exp(shots / 500) * 5;

  return shots + impactBonus + growthBonus + conditionEffect + exponentialGrowth;
};

const CommitGraph: React.FC = () => {
  const { loading, adminUid } = useAdminAuth();
  const [data, setData] = useState<ChartData[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) return;
    if (!adminUid) return;

    const fetchData = async () => {
      setDataLoading(true);

      try {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('leader', '==', adminUid));
        const querySnapshot = await getDocs(q);

        const members = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            uid: docSnap.id,
            lastName: data.lastName || '',
            firstName: data.firstName || '',
            shots: 0, 
          };
        });

        const memberDataPromises = members.map(async (member) => {
          const reportsRef = collection(firestore, 'users', member.uid, 'reports');
          const reportsSnapshot = await getDocs(reportsRef);

          let totalShots = 0;
          reportsSnapshot.forEach((reportDoc) => {
            const reportData = reportDoc.data();
            totalShots += reportData.shots || 0;
          });

          return {
            name: `${member.lastName} ${member.firstName}`,
            shots: totalShots,
          };
        });

        const memberData = await Promise.all(memberDataPromises);

        const chartData: ChartData[] = memberData.map((member) => ({
          name: member.name,
          contribution: calculateContribution(member.shots),
        }));

        setData(chartData);
      } catch (error) {
        console.error('データの取得中にエラーが発生しました：', error);
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
      <p className="text-2xl font-semibold mb-4 text-center">メンバーごとの貢献度</p>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" label={{ position: 'insideBottomRight', offset: 0 }} />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Bar dataKey="contribution" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CommitGraph;
