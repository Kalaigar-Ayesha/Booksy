
import React from 'react';
import { BookCard } from './BookCard';

export const BookGrid = () => {
  const trendingBooks = [
    {
      id: 1,
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      rating: 4.8,
      reviews: 124,
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop&crop=top",
      status: "trending"
    },
    {
      id: 2,
      title: "Project Hail Mary",
      author: "Andy Weir",
      rating: 4.6,
      reviews: 89,
      cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop&crop=center",
      status: "new"
    },
    {
      id: 3,
      title: "The Midnight Library",
      author: "Matt Haig",
      rating: 4.4,
      reviews: 256,
      cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop&crop=center",
      status: "popular"
    },
    {
      id: 4,
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      rating: 4.2,
      reviews: 167,
      cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop&crop=center",
      status: "acclaimed"
    },
    {
      id: 5,
      title: "The Four Winds",
      author: "Kristin Hannah",
      rating: 4.7,
      reviews: 203,
      cover: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=300&h=450&fit=crop&crop=center",
      status: "bestseller"
    },
    {
      id: 6,
      title: "The Sanatorium",
      author: "Sarah Pearse",
      rating: 4.1,
      reviews: 98,
      cover: "https://images.unsplash.com/photo-1606787620819-8bdf0c44c293?w=300&h=450&fit=crop&crop=center",
      status: "thriller"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Trending Books</h2>
          <p className="text-xl text-gray-600">Discover what the community is reading right now</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            View All Books
          </button>
        </div>
      </div>
    </section>
  );
};
