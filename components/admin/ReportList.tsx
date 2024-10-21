'use client';

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReportItem from '@/components/admin/ReportItem';
import { toast } from 'react-hot-toast';
import { firestore } from '@/src/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  getDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import SpinnerIcon from '@/components/SpinnerIcon';

interface Report {
  id: string;
  memberName: string;
  startTime: Date;
  endTime: Date;
  location: string;
  shots: number;
  notes: string;
  comments: string;
}

interface ReportListProps {
  adminUid: string;
}

const ReportList: React.FC<ReportListProps> = ({ adminUid }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchReports = async () => {
      setLoadingReports(true);
      setError('');

      try {
        const membersRef = collection(firestore, 'users');
        const membersQuery = query(membersRef, where('leader', '==', adminUid));
        const membersSnapshot = await getDocs(membersQuery);

        if (membersSnapshot.empty) {
          console.log('管理者に属するメンバーが見つかりませんでした。');
          setReports([]);
          setLoadingReports(false);
          return;
        }

        const memberUids: string[] = membersSnapshot.docs.map(
          (docSnap) => docSnap.id
        );

        const chunkSize = 10;
        const chunks: string[][] = [];
        for (let i = 0; i < memberUids.length; i += chunkSize) {
          chunks.push(memberUids.slice(i, i + chunkSize));
        }

        let allReports: Report[] = [];

        for (const chunk of chunks) {
          const reportsRef = collection(firestore, 'reports');
          const startOfDay = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            0,
            0,
            0
          );
          const endOfDay = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            23,
            59,
            59
          );

          const reportsQuery = query(
            reportsRef,
            where('userId', 'in', chunk),
            where('startTime', '>=', Timestamp.fromDate(startOfDay)),
            where('startTime', '<=', Timestamp.fromDate(endOfDay))
          );

          const reportsSnapshot = await getDocs(reportsQuery);

          console.log('取得したドキュメント数:', reportsSnapshot.docs.length);

          if (reportsSnapshot.empty) {
            console.log('クエリ結果が空です');
            continue;
          }

          const reportsData = await Promise.all(
            reportsSnapshot.docs.map(async (reportDoc) => {
              try {
                const data = reportDoc.data();

                if (!data.userId) {
                  console.warn(
                    `ドキュメント ${reportDoc.id} に userId フィールドがありません。`
                  );
                  return null;
                }

                const userDocRef = doc(firestore, 'users', data.userId);
                const userDocSnap = await getDoc(userDocRef);
                let memberName = '不明なユーザー';
                if (userDocSnap.exists()) {
                  const userData = userDocSnap.data() as {
                    firstName: string;
                    lastName: string;
                  };
                  memberName = `${userData.lastName} ${userData.firstName}`;
                }

                return {
                  id: reportDoc.id,
                  memberName,
                  startTime: data.startTime.toDate(),
                  endTime: data.endTime.toDate(),
                  location: data.location,
                  shots: data.shots,
                  notes: data.notes,
                  comments: data.comments || '',
                };
              } catch (error) {
                console.error(
                  `ドキュメント ${reportDoc.id} の処理中にエラーが発生しました:`,
                  error
                );
                return null;
              }
            })
          );

          const validReports: Report[] = reportsData.filter(
            (report): report is Report => report !== null
          );

          allReports = allReports.concat(validReports);
        }

        setReports(allReports);
      } catch (error: unknown) {
        console.error('報告データの取得に失敗しました：', error);
        if (error instanceof Error) {
          setError(`報告データの取得に失敗しました：${error.message}`);
        } else {
          setError('報告データの取得に失敗しました：不明なエラー');
        }
      }

      setLoadingReports(false);
    };

    fetchReports();
  }, [selectedDate, adminUid]);

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

  const handleCommentChange = async (id: string, comment: string) => {
    try {
      const reportRef = doc(firestore, 'reports', id);
      await updateDoc(reportRef, {
        comments: comment,
      });
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === id ? { ...report, comments: comment } : report
        )
      );
    } catch (error) {
      console.error('コメントの更新に失敗しました：', error);
      toast.error('コメントの更新に失敗しました。');
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded shadow">
      <p className="text-2xl font-semibold mb-4 text-center">撮影報告一覧</p>

      <div className="flex justify-center items-center mb-4 space-x-4">
        <button
          onClick={handlePreviousDay}
          className="px-3 py-1 bg-purple-200 text-purple-700 rounded hover:bg-purple-300"
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
          className="px-3 py-1 bg-purple-200 text-purple-700 rounded hover:bg-purple-300"
        >
          次の日
        </button>
      </div>

      {loadingReports ? (
        <div className="flex items-center justify-center">
          <SpinnerIcon />
        </div>
      ) : error ? (
        <p className="text-center text-rose-500">{error}</p>
      ) : reports.length > 0 ? (
        reports.map((report) => (
          <ReportItem
            key={report.id}
            report={report}
            onCommentChange={handleCommentChange}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">
          選択した日に報告はありません。
        </p>
      )}
    </div>
  );
};

export default ReportList;
