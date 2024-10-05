import React from 'react';

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
      <p>
        <span className="font-bold">開始時間：</span>{' '}
        {report.startTime.toLocaleString()}
      </p>
      <p>
        <span className="font-bold">終了時間：</span>{' '}
        {report.endTime.toLocaleString()}
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
        <div className="mt-2">
          <span className="font-bold">管理者からのコメント：</span> {report.comments}
        </div>
      )}
    </div>
  );
};

export default ReportItem;
