
import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: "Completed" | "In Progress" | "Pending";
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 text-xs font-medium rounded-full border",
      getStatusStyles(),
      className
    )}>
      {status}
    </span>
  );
};

export default StatusBadge;
