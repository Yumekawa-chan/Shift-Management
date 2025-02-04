'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { firestore } from '@/src/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import useMemberAuth from '@/src/hooks/useMemberAuth';
import SpinnerIcon from '@/components/common/SpinnerIcon';
import MemberRow from '@/components/common/MemberRow';

interface Member {
  id: string;
  lastName: string;
  firstName: string;
  grade: string;
}

const MemberListSection: React.FC = () => {
  const { loading, leader } = useMemberAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [teamName, setTeamName] = useState<string>('');
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) return;

    if (!leader) {
      console.error('リーダー情報が取得できませんでした。');
      setDataLoading(false);
      return;
    }

    const fetchMembers = async () => {
      setDataLoading(true);
      try {
        const leaderDocRef = doc(firestore, 'users', leader);
        const leaderDocSnap = await getDoc(leaderDocRef);

        let leaderLastName = '';
        if (leaderDocSnap.exists()) {
          const leaderData = leaderDocSnap.data();
          leaderLastName = leaderData.lastName || '';
          setTeamName(leaderLastName);
        } else {
          console.error('リーダーのデータが見つかりませんでした。');
        }

        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('leader', '==', leader));
        const querySnapshot = await getDocs(q);

        const membersData: Member[] = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            lastName: data.lastName || '',
            firstName: data.firstName || '',
            grade: data.grade || '',
          };
        });

        setMembers(membersData);
      } catch (error) {
        console.error('メンバーの取得中にエラーが発生しました：', error);
      }
      setDataLoading(false);
    };

    fetchMembers();
  }, [loading, leader]);

  if (loading || dataLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinnerIcon />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="w-full mx-auto p-6 bg-white rounded shadow">
        <p className="text-2xl font-semibold mb-8 text-center">
          <span className="mr-5">{teamName}班</span>メンバーリスト
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">名前</th>
                <th className="py-2 px-4 border-b">学年</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((member) => (
                  <MemberRow key={member.id} member={member} />
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-500">
                    メンバーが見つかりませんでした。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MemberList: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <MemberListSection />
      </main>
      <Footer />
    </div>
  );
};

export default MemberList;
