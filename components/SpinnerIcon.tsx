import { FaSpinner } from 'react-icons/fa';

const SpinnerIcon = () => {
  return (
    <div className="flex flex-col items-center">
      <FaSpinner className="animate-spin text-blue-500 h-16 w-16" />
    </div>
  );
};

export default SpinnerIcon;
