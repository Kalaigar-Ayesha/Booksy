
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Star, TrendingUp } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-20 px-4">
      <div className="container mx-auto max-w-6xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center space-x-2 rounded-full bg-amber-100 px-4 py-2 text-amber-700">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm font-medium">Your Reading Journey Starts Here</span>
          </div>
        </div>
        
        <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-7xl">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
            Booky
          </span>
        </h1>
        
        <p className="mb-8 text-xl text-gray-600 md:text-2xl max-w-3xl mx-auto">
          Track your reading, discover new books, share reviews, and connect with fellow book lovers in the ultimate literary social network.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg">
            Start Reading Journey
          </Button>
          <Button variant="outline" size="lg" className="border-amber-600 text-amber-700 hover:bg-amber-50 px-8 py-3 text-lg">
            Explore Books
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center p-6 rounded-lg bg-white/50 backdrop-blur-sm">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Your Reading</h3>
            <p className="text-gray-600 text-center">Mark books as read, currently reading, or want to read. Track your progress and build your library.</p>
          </div>
          
          <div className="flex flex-col items-center p-6 rounded-lg bg-white/50 backdrop-blur-sm">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rate & Review</h3>
            <p className="text-gray-600 text-center">Share your thoughts with detailed reviews and star ratings. Help others discover their next great read.</p>
          </div>
          
          <div className="flex flex-col items-center p-6 rounded-lg bg-white/50 backdrop-blur-sm">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect & Discover</h3>
            <p className="text-gray-600 text-center">Follow fellow readers, see what they're reading, and discover trending books in the community.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
