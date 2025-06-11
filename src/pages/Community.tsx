
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Users, BookOpen, MessageCircle, Heart } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  text: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    profile_picture?: string;
  };
  book: {
    id: string;
    title: string;
    author: string;
    cover_url: string;
  };
  likes_count: number;
}

interface CommunityUser {
  id: string;
  username: string;
  bio: string;
  profile_picture?: string;
  books_read_count: number;
  reviews_count: number;
}

const Community = () => {
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [topReaders, setTopReaders] = useState<CommunityUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    try {
      // Fetch recent reviews with user and book data
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          text,
          created_at,
          user_id,
          books!inner(id, title, author, cover_url)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
      }

      // Fetch user profiles for the reviews
      const userIds = reviewsData?.map(review => review.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, profile_picture')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Combine reviews with user data
      const reviewsWithUsers = reviewsData?.map(review => ({
        id: review.id,
        rating: review.rating,
        text: review.text,
        created_at: review.created_at,
        user: profilesData?.find(profile => profile.id === review.user_id) || {
          id: review.user_id,
          username: 'Unknown User',
          profile_picture: undefined
        },
        book: review.books,
        likes_count: 0 // Default value for now
      })) || [];

      // Fetch top readers with stats
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, username, bio, profile_picture')
        .limit(6);

      if (usersError) {
        console.error('Error fetching users:', usersError);
      }

      // Add mock stats for now since we don't have aggregated data yet
      const usersWithStats = usersData?.map(user => ({
        ...user,
        books_read_count: Math.floor(Math.random() * 50) + 1,
        reviews_count: Math.floor(Math.random() * 20) + 1
      })) || [];

      setRecentReviews(reviewsWithUsers);
      setTopReaders(usersWithStats);
    } catch (error) {
      console.error('Error fetching community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-amber-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getInitials = (username: string) => {
    return username?.slice(0, 2).toUpperCase() || 'UN';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 text-amber-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community</h1>
          <p className="text-xl text-gray-600">Connect with fellow book lovers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Reviews */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Reviews</h2>
            <div className="space-y-6">
              {recentReviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={review.user?.profile_picture} />
                        <AvatarFallback>{getInitials(review.user?.username || '')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold">{review.user?.username}</span>
                          <span className="text-gray-500 text-sm">reviewed</span>
                          <span className="font-medium">{review.book?.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <img
                        src={review.book?.cover_url}
                        alt={review.book?.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    </div>
                  </CardHeader>
                  {review.text && (
                    <CardContent>
                      <p className="text-gray-700 mb-4">{review.text}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <button className="flex items-center space-x-1 hover:text-red-500">
                          <Heart className="h-4 w-4" />
                          <span>{review.likes_count || 0}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-blue-500">
                          <MessageCircle className="h-4 w-4" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}

              {recentReviews.length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600">Be the first to share a review!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Top Readers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Top Readers</span>
                </CardTitle>
                <CardDescription>Most active community members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topReaders.map((user, index) => (
                    <div key={user.id} className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                        {index + 1}
                      </div>
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.profile_picture} />
                        <AvatarFallback className="text-xs">{getInitials(user.username)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{user.username}</p>
                        <p className="text-xs text-gray-500">
                          {user.books_read_count} books • {user.reviews_count} reviews
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {topReaders.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No active readers yet</p>
                )}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Reviews</span>
                    <Badge variant="secondary">{recentReviews.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Readers</span>
                    <Badge variant="secondary">{topReaders.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Books Tracked</span>
                    <Badge variant="secondary">6</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Featured Lists */}
            <Card>
              <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline" className="mr-2 mb-2">#SciFi</Badge>
                  <Badge variant="outline" className="mr-2 mb-2">#Romance</Badge>
                  <Badge variant="outline" className="mr-2 mb-2">#Classics</Badge>
                  <Badge variant="outline" className="mr-2 mb-2">#Fantasy</Badge>
                  <Badge variant="outline" className="mr-2 mb-2">#NonFiction</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
