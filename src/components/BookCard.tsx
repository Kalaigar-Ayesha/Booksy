
import React from 'react';
import { Star, BookOpen, Users } from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
  rating: number;
  reviews: number;
  cover: string;
  status: string;
}

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'trending': return 'bg-red-100 text-red-700';
      case 'new': return 'bg-green-100 text-green-700';
      case 'popular': return 'bg-blue-100 text-blue-700';
      case 'bestseller': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative overflow-hidden">
        <img 
          src={book.cover} 
          alt={book.title}
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
            {book.status}
          </span>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-3">
            <button className="bg-white/90 hover:bg-white p-3 rounded-full transition-colors">
              <BookOpen className="h-5 w-5 text-gray-700" />
            </button>
            <button className="bg-white/90 hover:bg-white p-3 rounded-full transition-colors">
              <Star className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{book.title}</h3>
        <p className="text-gray-600 mb-4">by {book.author}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-amber-400 fill-current" />
            <span className="text-sm font-medium text-gray-900">{book.rating}</span>
            <span className="text-sm text-gray-500">({book.reviews})</span>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-500">
            <Users className="h-4 w-4" />
            <span className="text-sm">{book.reviews}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
