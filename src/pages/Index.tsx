
import React from 'react';
import { Hero } from '../components/Hero';
import { BookGrid } from '../components/BookGrid';
import { Stats } from '../components/Stats';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Stats />
      <BookGrid />
    </div>
  );
};

export default Index;
