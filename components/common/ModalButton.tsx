import { ReactNode } from 'react';

interface ModalButtonProps {
  color: string;
  hoverColor: string;
  icon?: ReactNode;
  text: string;
  onClick: () => void;
}

const ModalButton = ({
  color,
  hoverColor,
  icon,
  text,
  onClick,
}: ModalButtonProps) => {
  return (
    <button
      className={`text-white px-6 py-3 rounded transition-colors duration-300 mt-4 flex items-center justify-center ${color} hover:${hoverColor}`}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
};

export default ModalButton;
