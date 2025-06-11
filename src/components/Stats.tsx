
import React from 'react';
import { TrendingUp, Users, BookOpen, Star } from 'lucide-react';

export const Stats = () => {
  const stats = [
    {
      icon: BookOpen,
      value: "150K+",
      label: "Books Tracked",
      color: "text-amber-600"
    },
    {
      icon: Users,
      value: "12K+",
      label: "Active Readers",
      color: "text-red-600"
    },
    {
      icon: Star,
      value: "89K+",
      label: "Reviews Written",
      color: "text-orange-600"
    },
    {
      icon: TrendingUp,
      value: "2.4M+",
      label: "Pages Read",
      color: "text-amber-700"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
