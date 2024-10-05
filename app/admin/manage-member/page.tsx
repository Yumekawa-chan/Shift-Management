'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MdEdit, MdDelete } from 'react-icons/md';

interface Member {
  id: number;
  name: string;
  grade: string;
  studentId: string;
}

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded"
        required={required}
      />
    </div>
  );
};

const ManageMemberSection: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: '山田 太郎',
      grade: 'M1',
      studentId: 'S2023001',
    },
    {
      id: 2,
      name: '佐藤 花子',
      grade: 'B4',
      studentId: 'S2023002',
    },
    {
      id: 3,
      name: '鈴木 一郎',
      grade: 'B3',
      studentId: 'S2023003',
    },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [editedMember, setEditedMember] = useState<Member | null>(null);

  const handleDelete = (id: number) => {
    if (confirm('本当にこのメンバーを削除しますか？')) {
      setMembers(members.filter((member) => member.id !== id));
    }
  };

  const handleEdit = (member: Member) => {
    setCurrentMember(member);
    setEditedMember({ ...member });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (editedMember) {
      setMembers(
        members.map((member) =>
          member.id === editedMember.id ? editedMember : member
        )
      );
      setIsEditModalOpen(false);
      setCurrentMember(null);
      setEditedMember(null);
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setCurrentMember(null);
    setEditedMember(null);
  };

  const teamName = 'シーン';

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
                <th className="py-2 px-4 border-b">学籍番号</th>
                <th className="py-2 px-4 border-b">操作</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="text-center">
                  <td className="py-2 px-4 border-b">{member.name}</td>
                  <td className="py-2 px-4 border-b">{member.grade}</td>
                  <td className="py-2 px-4 border-b">{member.studentId}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="編集"
                      >
                        <MdEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="削除"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
              <FormField
                label="名前"
                value={editedMember.name}
                onChange={(e) =>
                  setEditedMember({ ...editedMember, name: e.target.value })
                }
                required
              />
              <FormField
                label="学年"
                value={editedMember.grade}
                onChange={(e) =>
                  setEditedMember({ ...editedMember, grade: e.target.value })
                }
                required
              />
              <FormField
                label="学籍番号"
                value={editedMember.studentId}
                onChange={(e) =>
                  setEditedMember({
                    ...editedMember,
                    studentId: e.target.value,
                  })
                }
                required
              />

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
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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

const ManageMember: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center p-4 mt-[8rem]">
        <div className="w-full max-w-4xl">
          <ManageMemberSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ManageMember;
