'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';

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

const FormSection: React.FC = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [shots, setShots] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          placeholder="撮影場所を入力（カンマ区切り）"
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

const MemberPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="md:flex-row md:space-x-10 md:items-start md:justify-center w-full max-w-2xl">
          <FormSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MemberPage;
