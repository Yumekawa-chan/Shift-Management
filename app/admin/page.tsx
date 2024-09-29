"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Report {
  id: number;
  memberName: string;
  date: string; 
  start_time: string;
  end_time: string;
  location: string;
  shots: number;
  notes: string;
  comments: string;
}

const mockReports: Report[] = [
  {
    id: 1,
    memberName: "山田太郎",
    date: "2024-09-29",
    start_time: "10:00",
    end_time: "12:00",
    location: "東京",
    shots: 50,
    notes: "晴天で良い撮影ができました。",
    comments: "",
  },
  {
    id: 2,
    memberName: "佐藤花子",
    date: "2024-09-29",
    start_time: "14:30",
    end_time: "16:00",
    location: "大阪",
    shots: 30,
    notes: "曇りでしたが問題ありませんでした。",
    comments: "",
  },
  {
    id: 3,
    memberName: "鈴木一郎",
    date: "2024-09-28",
    start_time: "09:00",
    end_time: "11:00",
    location: "名古屋",
    shots: 40,
    notes: "雨でしたが撮影できました。",
    comments: "",
  },
];

interface ReportItemProps {
  report: Report;
  onCommentChange: (id: number, comment: string) => void;
}

const ReportItem: React.FC<ReportItemProps> = ({ report, onCommentChange }) => {
  const [comment, setComment] = useState(report.comments);

  const handleCommentSave = () => {
    onCommentChange(report.id, comment);
  };

  return (
    <div className="mb-4 border-b pb-4">
      <p>
        <span className="font-bold">メンバー名：</span> {report.memberName}
      </p>
      <p>
        <span className="font-bold">開始時間：</span> {report.start_time}
      </p>
      <p>
        <span className="font-bold">終了時間：</span> {report.end_time}
      </p>
      <p>
        <span className="font-bold">撮影場所：</span> {report.location}
      </p>
      <p>
        <span className="font-bold">撮影枚数：</span> {report.shots}
      </p>
      <p>
        <span className="font-bold">備考：</span> {report.notes}
      </p>
      <div className="mt-2">
        <label className="block text-gray-700 mb-1">コメント</label>
        <textarea
          className="w-full px-3 py-2 border rounded"
          placeholder="コメントを入力"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          onClick={handleCommentSave}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          保存
        </button>
      </div>
      {report.comments && (
        <div className="mt-2">
          <span className="font-bold">管理者コメント：</span> {report.comments}
        </div>
      )}
    </div>
  );
};

const ReportList: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reports, setReports] = useState<Report[]>(mockReports);

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleCommentChange = (id: number, comment: string) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id ? { ...report, comments: comment } : report
      )
    );
  };

  const formattedSelectedDate = selectedDate.toISOString().split("T")[0];

  const filteredReports = reports.filter((report) => report.date === formattedSelectedDate);

  return (
    <div className="w-full mx-auto p-6 bg-white rounded shadow">
      <p className="text-2xl font-semibold mb-4 text-center">撮影報告一覧</p>
      
      <div className="flex justify-center items-center mb-4 space-x-4">
        <button
          onClick={handlePreviousDay}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          前の日
        </button>
        
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => handleDateChange(date)}
          dateFormat="yyyy-MM-dd"
          className="px-3 py-2 border rounded"
        />
        
        <button
          onClick={handleNextDay}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          次の日
        </button>
      </div>

      {filteredReports.length > 0 ? (
        filteredReports.map((report) => (
          <ReportItem key={report.id} report={report} onCommentChange={handleCommentChange} />
        ))
      ) : (
        <p className="text-center text-gray-500">選択した日に報告はありません。</p>
      )}
    </div>
  );
};

const AdminPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header showExtras userName="テスト管理ユーザー" />
      <main className="flex-grow flex flex-col items-center p-4 pt-[7rem] pb-[3rem]">
  <div className="w-full max-w-3xl">
    <ReportList />
  </div>
</main>

      <Footer />
    </div>
  );
};

export default AdminPage;
