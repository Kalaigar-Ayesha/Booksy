
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, User, Bell } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-amber-600" />
              <span className="text-2xl font-bold text-gray-900">Booky</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-700 hover:text-amber-600 transition-colors">Discover</a>
              <a href="#" className="text-gray-700 hover:text-amber-600 transition-colors">My Books</a>
              <a href="#" className="text-gray-700 hover:text-amber-600 transition-colors">Lists</a>
              <a href="#" className="text-gray-700 hover:text-amber-600 transition-colors">Community</a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search books, authors, users..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent w-80"
              />
            </div>
            
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="sm" className="p-2">
              <User className="h-5 w-5" />
            </Button>
            
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
