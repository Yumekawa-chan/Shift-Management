'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MdEdit, MdDelete } from 'react-icons/md';
import { firestore } from '@/src/lib/firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  getDoc,
} from 'firebase/firestore';
import useAdminAuth from '@/src/hooks/useAdminAuth';
import SpinnerIcon from '@/components/SpinnerIcon';

interface Member {
  id: string;
  uid: string;
  lastName: string;
  firstName: string;
  grade: string;
}

const ManageMemberSection: React.FC = () => {
  const { loading, adminUid } = useAdminAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [teamName, setTeamName] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [editedMember, setEditedMember] = useState<Member | null>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  const fetchMembers = useCallback(async () => {
    if (!adminUid) return;

    setDataLoading(true);
    try {
      const adminDocSnap = await getDoc(doc(firestore, 'users', adminUid));
      if (adminDocSnap.exists()) {
        const adminData = adminDocSnap.data();
        setTeamName(adminData.lastName || '');
      } else {
        console.error('管理者のデータが見つかりませんでした。');
      }

      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('leader', '==', adminUid));
      const querySnapshot = await getDocs(q);

      const membersData = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        uid: docSnap.id,
        lastName: docSnap.data().lastName || '',
        firstName: docSnap.data().firstName || '',
        grade: docSnap.data().grade || '',
      }));

      setMembers(membersData);
    } catch (error) {
      console.error('メンバーの取得中にエラーが発生しました：', error);
    } finally {
      setDataLoading(false);
    }
  }, [adminUid]);

  useEffect(() => {
    if (!loading) fetchMembers();
  }, [loading, fetchMembers]);

  const handleDelete = async (uid: string) => {
    if (!confirm('本当にこのメンバーを削除しますか？')) return;
    try {
      await updateDoc(doc(firestore, 'users', uid), { leader: null });
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.uid !== uid)
      );
    } catch (error) {
      console.error('メンバーの更新中にエラーが発生しました：', error);
      alert('メンバーの削除に失敗しました。');
    }
  };

  const handleEdit = (member: Member) => {
    setCurrentMember(member);
    setEditedMember({ ...member });
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!editedMember) return;
    try {
      await updateDoc(doc(firestore, 'users', editedMember.uid), {
        lastName: editedMember.lastName,
        firstName: editedMember.firstName,
        grade: editedMember.grade,
      });
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.uid === editedMember.uid ? editedMember : member
        )
      );
      handleCloseModal();
    } catch (error) {
      console.error('メンバー情報の更新に失敗しました：', error);
      alert('メンバー情報の更新に失敗しました。');
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setCurrentMember(null);
    setEditedMember(null);
  };

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
          <span className="mr-5">{teamName}班</span>メンバー管理
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">名前</th>
                <th className="py-2 px-4 border-b">学年</th>
                <th className="py-2 px-4 border-b">操作</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((member) => (
                  <tr key={member.uid} className="text-center">
                    <td className="py-2 px-4 border-b">
                      {member.lastName} {member.firstName}
                    </td>
                    <td className="py-2 px-4 border-b">{member.grade}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="text-sky-500 hover:text-sky-600"
                          aria-label="編集"
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(member.uid)}
                          className="text-rose-500 hover:text-rose-600"
                          aria-label="削除"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-500">
                    メンバーが見つかりませんでした。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && editedMember && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div className="bg-white rounded-lg shadow-lg max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">メンバー編集</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700">苗字</label>
                <input
                  type="text"
                  value={editedMember.lastName}
                  onChange={(e) =>
                    setEditedMember((prev) => ({
                      ...prev!,
                      lastName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">名前</label>
                <input
                  type="text"
                  value={editedMember.firstName}
                  onChange={(e) =>
                    setEditedMember((prev) => ({
                      ...prev!,
                      firstName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">学年</label>
                <select
                  value={editedMember.grade}
                  onChange={(e) =>
                    setEditedMember((prev) => ({
                      ...prev!,
                      grade: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">選択してください</option>
                  <option value="B3">B3</option>
                  <option value="B4">B4</option>
                  <option value="M1">M1</option>
                  <option value="M2">M2</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ManageMember: React.FC = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow flex flex-col items-center p-4 mt-[8rem]">
      <ManageMemberSection />
    </main>
    <Footer />
  </div>
);

export default ManageMember;
