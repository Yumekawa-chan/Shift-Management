import { ReactNode } from 'react';

interface ButtonProps {
  color: string;
  hoverColor: string;
  icon: ReactNode;
  text: string;
  onClick: () => void;
}

const HomeButton = ({
  color,
  hoverColor,
  icon,
  text,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`text-white px-4 py-3 rounded transition-colors duration-300 flex items-center ${color} hover:${hoverColor}`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      {text}
    </button>
  );
};

export default HomeButton;
