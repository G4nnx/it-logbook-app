
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Settings } from 'lucide-react';
import Logo from './Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/">
          <Logo />
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="h-5 w-5 text-gray-600 cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
              1
            </span>
          </div>
          <Settings className="h-5 w-5 text-gray-600 cursor-pointer" />
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className="bg-blue-100 text-blue-800">AU</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
