'use client';

import React from 'react';
import Link from 'next/link';

interface MenuItemProps {
  href: string;
  onClick: () => void;
  itemName: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ href, onClick, itemName }) => {
  return (
    <li>
      <Link
        href={href}
        className="text-pink-400 hover:text-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-600 rounded"
        onClick={onClick}
      >
        {itemName}
      </Link>
    </li>
  );
};

export default MenuItem;
