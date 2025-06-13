
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Plus, BookOpen, Heart } from 'lucide-react';
import { useBookActions } from '@/hooks/useBookActions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Book {
  id: string;
  title: string;
  author: string;
  rating: number;
  cover: string;
  genres?: string[];
  description?: string;
}

interface WorkingBookCardProps {
  book: Book;
}

export const WorkingBookCard: React.FC<WorkingBookCardProps> = ({ book }) => {
  const { addToBooks, addReview, loading } = useBookActions();
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [selectedRating, setSelectedRating] = useState(5);

  const handleAddToReading = () => {
    addToBooks(book.id, 'reading');
  };

  const handleAddToWantToRead = () => {
    addToBooks(book.id, 'want_to_read');
  };

  const handleMarkAsRead = () => {
    addToBooks(book.id, 'read');
  };

  const handleSubmitReview = () => {
    addReview(book.id, selectedRating, reviewText);
    setShowReviewDialog(false);
    setReviewText('');
    setSelectedRating(5);
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-amber-400 fill-current' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-amber-400' : ''}`}
        onClick={interactive && onRatingChange ? () => onRatingChange(i + 1) : undefined}
      />
    ));
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-gray-600 mb-2">{book.author}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex mr-2">
            {renderStars(Math.round(book.rating))}
          </div>
          <span className="text-sm text-gray-600">{book.rating.toFixed(1)}</span>
        </div>

        {book.genres && (
          <div className="flex flex-wrap gap-1 mb-3">
            {book.genres.slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <Button
            onClick={handleAddToReading}
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            size="sm"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Start Reading
          </Button>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleAddToWantToRead}
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-1" />
              Want to Read
            </Button>
            
            <Button
              onClick={handleMarkAsRead}
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Heart className="h-4 w-4 mr-1" />
              Mark as Read
            </Button>
          </div>

          <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full">
                Write Review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
                <DialogDescription>
                  Share your thoughts about "{book.title}"
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  <div className="flex mt-2">
                    {renderStars(selectedRating, true, setSelectedRating)}
                  </div>
                </div>
                <div>
                  <Label htmlFor="review">Review (Optional)</Label>
                  <Textarea
                    id="review"
                    placeholder="What did you think of this book?"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={loading}
                    className="bg-amber-600 hover:bg-amber-700 flex-1"
                  >
                    Submit Review
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};
