import React from 'react';
import ReportDetailItem from '@/components/common/ReportDetailItem';
interface Report {
  id: string;
  startTime: Date;
  endTime: Date;
  location: string;
  shots: number;
  notes: string;
  comments: string;
}

interface ReportItemProps {
  report: Report;
}

const ReportItem: React.FC<ReportItemProps> = ({ report }) => {
  return (
    <div className="mb-4 border-b pb-4">
      <ReportDetailItem
        label="開始時間"
        value={report.startTime.toLocaleString()}
      />
      <ReportDetailItem
        label="終了時間"
        value={report.endTime.toLocaleString()}
      />
      <ReportDetailItem label="撮影場所" value={report.location} />
      <ReportDetailItem label="撮影枚数" value={report.shots} />
      <ReportDetailItem label="備考" value={report.notes} />

      {report.comments && (
        <div className="mt-2">
          <ReportDetailItem
            label="管理者からのコメント"
            value={report.comments}
          />
        </div>
      )}
    </div>
  );
};

export default ReportItem;
