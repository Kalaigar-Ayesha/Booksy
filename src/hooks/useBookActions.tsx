
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBookActions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const addToBooks = async (bookId: string, status: 'read' | 'reading' | 'want_to_read') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add books to your library.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_books')
        .upsert({
          user_id: user.id,
          book_id: bookId,
          status: status
        });

      if (error) throw error;

      toast({
        title: "Book added!",
        description: `Book added to your ${status.replace('_', ' ')} list.`
      });
    } catch (error) {
      console.error('Error adding book:', error);
      toast({
        title: "Error",
        description: "Failed to add book. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (bookId: string, rating: number, reviewText?: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to write reviews.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .upsert({
          user_id: user.id,
          book_id: bookId,
          rating: rating,
          text: reviewText || null
        });

      if (error) throw error;

      toast({
        title: "Review added!",
        description: "Your review has been published."
      });
    } catch (error) {
      console.error('Error adding review:', error);
      toast({
        title: "Error",
        description: "Failed to add review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    addToBooks,
    addReview,
    loading
  };
};
