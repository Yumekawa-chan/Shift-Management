interface ReportDetailItemProps {
  label: string;
  value: string | number;
}

const ReportDetailItem = ({ label, value }: ReportDetailItemProps) => {
  return (
    <p>
      <span className="font-bold">{label}：</span> {value}
    </p>
  );
};

export default ReportDetailItem;
