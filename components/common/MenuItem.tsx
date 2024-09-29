"use client";

import React from "react";
import Link from "next/link";

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
        className="text-gray-700 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        onClick={onClick}
      >
        {itemName}
      </Link>
    </li>
  );
};

export default MenuItem;
