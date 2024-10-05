import { FaSpinner } from 'react-icons/fa';

const SpinnerIcon = () => {
  return (
    <div className="flex flex-col items-center">
      <FaSpinner className="animate-spin text-blue-500 h-16 w-16" />
      <p className="text-xl mt-4">読み込み中...</p>
    </div>
  );
};

export default SpinnerIcon;
