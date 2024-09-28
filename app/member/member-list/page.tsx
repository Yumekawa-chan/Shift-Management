"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

interface Member {
  id: number;
  name: string;
  grade: string;
  studentId: string;
}

const MemberListSection: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: "山田 太郎",
      grade: "M1",
      studentId: "S2023001",
    },
    {
      id: 2,
      name: "佐藤 花子",
      grade: "B4",
      studentId: "S2023002",
    },
    {
      id: 3,
      name: "鈴木 一郎",
      grade: "B3",
      studentId: "S2023003",
    },
  ]);

  const teamName = "シーン"

  return (
    <div className="w-full mx-auto p-6 bg-white rounded shadow">
      <p className="text-2xl font-semibold mb-8 text-center"><span className = "mr-5">{teamName}班</span>メンバーリスト</p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">名前</th>
              <th className="py-2 px-4 border-b">学年</th>
              <th className="py-2 px-4 border-b">学籍番号</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="text-center">
                <td className="py-2 px-4 border-b">{member.name}</td>
                <td className="py-2 px-4 border-b">{member.grade}</td>
                <td className="py-2 px-4 border-b">{member.studentId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MemberList: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header showExtras userName="テストユーザー"/>
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <MemberListSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MemberList;
