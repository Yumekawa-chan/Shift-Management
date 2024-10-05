import React, { useState } from 'react';

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

interface ReportItemProps {
  report: Report;
  onCommentChange: (id: string, comment: string) => void;
}

const ReportItem: React.FC<ReportItemProps> = ({ report, onCommentChange }) => {
  const [comment, setComment] = useState(report.comments);

  const handleCommentSave = () => {
    onCommentChange(report.id, comment);
  };

  return (
    <div className="mb-4 border-b pb-4">
      <p>
        <span className="font-bold">名前：</span> {report.memberName}
      </p>
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

export default ReportItem;
