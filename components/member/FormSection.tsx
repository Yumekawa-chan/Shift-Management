'use client';

import React, { useState } from 'react';
import { auth, firestore } from '@/src/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import FormInput from './FormInput';
import toast from 'react-hot-toast';

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
      toast.error('ユーザーがログインしていません。再度ログインしてください。');
      return;
    }

    if (!startTime || !endTime || !location || !shots) {
      toast.error('すべての必須フィールドを入力してください。');
      return;
    }

    if (isNaN(Number(shots)) || Number(shots) < 0) {
      toast.error('撮影枚数は正の数である必要があります。');
      return;
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      toast.error('有効な日時を入力してください。');
      return;
    }

    if (startDate >= endDate) {
      toast.error('撮影開始時間は撮影終了時間より前である必要があります。');
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
      toast.success('報告が送信されました。');
    } catch (error: unknown) {
      console.error('報告の送信に失敗しました：', error);
      toast.error('報告の送信に失敗しました。再度お試しください。');
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded shadow">
      <p className="text-2xl font-semibold mb-8 text-center">
        撮影報告フォーム
      </p>
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
          className="w-full bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
        >
          送信
        </button>
      </form>
    </div>
  );
};

export default FormSection;
