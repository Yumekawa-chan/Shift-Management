"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

interface Report {
  id: number;
  start_time: string;
  end_time: string;
  location: string;
  shots: number;
  notes: string;
  comments?: string;
}

interface ReportItemProps {
  report: Report;
}

const ReportItem: React.FC<ReportItemProps> = ({ report }) => (
  <div className="mb-4 border-b pb-4">
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
    {report.comments && (
      <p className="mt-2">
        <span className="font-bold">管理者コメント：</span> {report.comments}
      </p>
    )}
  </div>
);

const PastReportsSection: React.FC = () => {
  const reports: Report[] = [
    {
      id: 1,
      start_time: "2024-09-29 10:00",
      end_time: "2024-09-29 12:00",
      location: "東京",
      shots: 50,
      notes: "晴天で良い撮影ができました。",
      comments: "素晴らしい撮影結果です。引き続き頑張ってください。",
    },
    {
      id: 2,
      start_time: "2024-09-29 14:30",
      end_time: "2024-09-29 16:00",
      location: "大阪",
      shots: 30,
      notes: "曇りでしたが問題ありませんでした。",
      // コメントなし
    },
    {
      id: 3,
      start_time: "2024-09-28 09:00",
      end_time: "2024-09-28 11:00",
      location: "名古屋",
      shots: 40,
      notes: "雨でしたが撮影できました。",
      comments: "雨天でも撮影を完遂してお疲れ様でした。",
    },
    {
      id: 4,
      start_time: "2024-09-27 15:00",
      end_time: "2024-09-27 17:00",
      location: "福岡",
      shots: 35,
      notes: "風が強かったです。",
      // コメントなし
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 3;

  const totalPages = Math.ceil(reports.length / reportsPerPage);
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="w-full mx-auto p-6 bg-white rounded shadow">
      <p className="text-2xl font-semibold mb-8 text-center">過去の撮影報告</p>
      {currentReports.map((report) => (
        <ReportItem key={report.id} report={report} />
      ))}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-3 py-1 rounded ${
              currentPage === number
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

const MemberPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header showExtras userName="テストユーザー" />
      <main className="flex-grow flex flex-col items-center p-4 pt-[8rem]"> 
        <div className="md:flex-row md:items-start md:justify-center w-full max-w-2xl">
          <PastReportsSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MemberPage;
