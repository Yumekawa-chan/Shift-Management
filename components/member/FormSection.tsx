'use client';

import React from 'react';
import { auth, firestore } from '@/src/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import {
  useForm,
  Controller,
  SubmitHandler,
  FieldErrors,
} from 'react-hook-form';
import FormInput from './FormInput';
import toast from 'react-hot-toast';

interface FormSectionProps {
  leader: string | null;
}

interface FormData {
  startTime: string;
  endTime: string;
  location: string;
  shots: number;
  notes: string;
}

const FormSection: React.FC<FormSectionProps> = ({ leader }) => {
  const { control, handleSubmit, reset } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('ユーザーがログインしていません。再度ログインしてください。');
      return;
    }

    const startDate = new Date(data.startTime);
    const endDate = new Date(data.endTime);

    if (startDate >= endDate) {
      toast.error('撮影開始時間は撮影終了時間より前である必要があります。');
      return;
    }

    const reportData = {
      userId: user.uid,
      leader,
      startTime: Timestamp.fromDate(startDate),
      endTime: Timestamp.fromDate(endDate),
      location: data.location,
      shots: Number(data.shots),
      notes: data.notes,
      createdAt: Timestamp.fromDate(new Date()),
    };

    try {
      await addDoc(collection(firestore, 'reports'), reportData);
      reset();
      toast.success('報告が送信されました。');
    } catch (error) {
      toast.error('報告の送信に失敗しました。再度お試しください。');
      console.error(error);
    }
  };

  const onError = (errors: FieldErrors<FormData>) => {
    Object.values(errors).forEach((error) => {
      toast.error(error?.message || 'バリデーションエラーが発生しました。');
    });
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded shadow">
      <p className="text-2xl font-semibold mb-8 text-center">
        撮影報告フォーム
      </p>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Controller
          name="startTime"
          control={control}
          rules={{ required: '撮影開始時間は必須です。' }}
          render={({ field }) => (
            <FormInput
              label="撮影開始時間"
              type="datetime-local"
              placeholder="撮影開始時間を選択"
              {...field}
            />
          )}
        />

        <Controller
          name="endTime"
          control={control}
          rules={{ required: '撮影終了時間は必須です。' }}
          render={({ field }) => (
            <FormInput
              label="撮影終了時間"
              type="datetime-local"
              placeholder="撮影終了時間を選択"
              {...field}
            />
          )}
        />

        <Controller
          name="location"
          control={control}
          rules={{ required: '撮影場所は必須です。' }}
          render={({ field }) => (
            <FormInput
              label="撮影場所"
              type="text"
              placeholder="撮影場所を入力"
              {...field}
            />
          )}
        />

        <Controller
          name="shots"
          control={control}
          rules={{
            required: '撮影枚数は必須です。',
            validate: (value) =>
              value > 0 || '撮影枚数は正の数である必要があります。',
          }}
          render={({ field }) => (
            <FormInput
              label="撮影枚数"
              type="number"
              placeholder="撮影枚数を入力"
              {...field}
            />
          )}
        />

        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <FormInput
              label="備考"
              type="textarea"
              placeholder="備考を入力"
              {...field}
            />
          )}
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
