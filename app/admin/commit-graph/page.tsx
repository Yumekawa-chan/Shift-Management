'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const rawData = [
  { name: '山田 太郎', shots: 150 },
  { name: '佐藤 花子', shots: 400 },
  { name: '鈴木 一郎', shots: 180 },
  { name: '田中 次郎', shots: 100 },
  { name: '村上 三郎', shots: 130 },
];

const calculateContribution = (shots: number) => {
  const impactBonus = Math.log(shots + 1) * 20;
  const growthBonus = Math.sqrt(shots) * 10;
  const conditionEffect = Math.abs(Math.cos(shots) * 30);
  const exponentialGrowth = Math.exp(shots / 500) * 5;

  return shots + impactBonus + growthBonus + conditionEffect + exponentialGrowth;
};

const data = rawData.map(member => ({
  name: member.name,
  contribution: calculateContribution(member.shots),
}));

const CommitGraphSection: React.FC = () => {
  return (
    <div className="w-full mx-auto p-6 bg-white rounded shadow">
      <p className="text-2xl font-semibold mb-4 text-center">メンバーごとの貢献度</p>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" label={{position: "insideBottomRight", offset: 0 }} />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Bar dataKey="contribution" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CommitGraph: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
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
