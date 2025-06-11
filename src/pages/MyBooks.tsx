
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, BookMarked, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserBook {
  id: string;
  status: string;
  progress: number;
  book: {
    id: string;
    title: string;
    author: string;
    cover_url: string;
    average_rating: number;
  };
}

const MyBooks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reading');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchUserBooks();
  }, [user, navigate]);

  const fetchUserBooks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_books')
        .select(`
          id,
          status,
          progress,
          book:books(id, title, author, cover_url, average_rating)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setUserBooks(data || []);
    } catch (error) {
      console.error('Error fetching user books:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBooksByStatus = (status: string) => {
    return userBooks.filter(userBook => userBook.status === status);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reading':
        return <BookOpen className="h-5 w-5" />;
      case 'want_to_read':
        return <BookMarked className="h-5 w-5" />;
      case 'read':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getStatusCount = (status: string) => {
    return getBooksByStatus(status).length;
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-amber-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading your books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Books</h1>
          <p className="text-xl text-gray-600">Track your reading journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{getStatusCount('reading')}</p>
                <p className="text-gray-600">Currently Reading</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <BookMarked className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{getStatusCount('want_to_read')}</p>
                <p className="text-gray-600">Want to Read</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{getStatusCount('read')}</p>
                <p className="text-gray-600">Books Read</p>
              </div>
            </div>
          </div>
        </div>

        {/* Books Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reading" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Reading ({getStatusCount('reading')})</span>
              </TabsTrigger>
              <TabsTrigger value="want_to_read" className="flex items-center space-x-2">
                <BookMarked className="h-4 w-4" />
                <span>Want to Read ({getStatusCount('want_to_read')})</span>
              </TabsTrigger>
              <TabsTrigger value="read" className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Read ({getStatusCount('read')})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reading" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getBooksByStatus('reading').map((userBook) => (
                  <BookCard
                    key={userBook.id}
                    book={{
                      id: parseInt(userBook.book.id),
                      title: userBook.book.title,
                      author: userBook.book.author,
                      rating: userBook.book.average_rating,
                      reviews: 0,
                      cover: userBook.book.cover_url,
                      status: 'reading'
                    }}
                  />
                ))}
              </div>
              {getBooksByStatus('reading').length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No books currently reading</h3>
                  <p className="text-gray-600 mb-4">Start reading a book to see it here</p>
                  <Button onClick={() => navigate('/discover')} className="bg-amber-600 hover:bg-amber-700">
                    Discover Books
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="want_to_read" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getBooksByStatus('want_to_read').map((userBook) => (
                  <BookCard
                    key={userBook.id}
                    book={{
                      id: parseInt(userBook.book.id),
                      title: userBook.book.title,
                      author: userBook.book.author,
                      rating: userBook.book.average_rating,
                      reviews: 0,
                      cover: userBook.book.cover_url,
                      status: 'want_to_read'
                    }}
                  />
                ))}
              </div>
              {getBooksByStatus('want_to_read').length === 0 && (
                <div className="text-center py-12">
                  <BookMarked className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No books in your reading list</h3>
                  <p className="text-gray-600 mb-4">Add books you want to read</p>
                  <Button onClick={() => navigate('/discover')} className="bg-amber-600 hover:bg-amber-700">
                    Discover Books
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="read" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getBooksByStatus('read').map((userBook) => (
                  <BookCard
                    key={userBook.id}
                    book={{
                      id: parseInt(userBook.book.id),
                      title: userBook.book.title,
                      author: userBook.book.author,
                      rating: userBook.book.average_rating,
                      reviews: 0,
                      cover: userBook.book.cover_url,
                      status: 'read'
                    }}
                  />
                ))}
              </div>
              {getBooksByStatus('read').length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No books finished yet</h3>
                  <p className="text-gray-600 mb-4">Mark books as read when you finish them</p>
                  <Button onClick={() => navigate('/discover')} className="bg-amber-600 hover:bg-amber-700">
                    Discover Books
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MyBooks;
