'use client';

import React, { useState } from 'react';
import { auth, firestore } from '@/src/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

interface FormInputProps {
  label: string;
  type: string;
  placeholder: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 mb-1">{label}</label>
    {type === 'textarea' ? (
      <textarea
        className="w-full px-3 py-2 border rounded"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    ) : (
      <input
        type={type}
        className="w-full px-3 py-2 border rounded"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    )}
  </div>
);

interface FormSectionProps {
  leader: string | null;
}

const FormSection: React.FC<FormSectionProps> = ({ leader }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [shots, setShots] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      console.error('ユーザーがログインしていません。');
      alert('ユーザーがログインしていません。再度ログインしてください。');
      return;
    }

    if (!startTime || !endTime || !location || !shots) {
      alert('すべての必須フィールドを入力してください。');
      return;
    }

    if (isNaN(Number(shots)) || Number(shots) <= 0) {
      alert('撮影枚数は正の数である必要があります。');
      return;
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert('有効な日時を入力してください。');
      return;
    }

    if (startDate >= endDate) {
      alert('撮影開始時間は撮影終了時間より前である必要があります。');
      return;
    }

    const reportData = {
      userId: user.uid,
      leader: leader,
      startTime: Timestamp.fromDate(startDate),
      endTime: Timestamp.fromDate(endDate),
      location: location,
      shots: Number(shots),
      notes: notes,
      createdAt: Timestamp.fromDate(new Date()),
    };

    try {
      await addDoc(collection(firestore, 'reports'), reportData);
      setStartTime('');
      setEndTime('');
      setLocation('');
      setShots('');
      setNotes('');
      alert('報告が送信されました。');
    } catch (error: unknown) {
      console.error('報告の送信に失敗しました：', error);
      alert('報告の送信に失敗しました。再度お試しください。');
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded shadow">
      <p className="text-2xl font-semibold mb-8 text-center">撮影報告フォーム</p>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="撮影開始時間"
          type="datetime-local"
          placeholder="撮影開始時間を選択"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <FormInput
          label="撮影終了時間"
          type="datetime-local"
          placeholder="撮影終了時間を選択"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <FormInput
          label="撮影場所"
          type="text"
          placeholder="撮影場所を入力"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <FormInput
          label="撮影枚数"
          type="number"
          placeholder="撮影枚数を入力"
          value={shots}
          onChange={(e) => setShots(e.target.value)}
        />
        <FormInput
          label="備考"
          type="textarea"
          placeholder="備考を入力"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          送信
        </button>
      </form>
    </div>
  );
};

export default FormSection;
