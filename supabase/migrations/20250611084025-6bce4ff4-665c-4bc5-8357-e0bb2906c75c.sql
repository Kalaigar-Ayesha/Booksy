
-- Update the existing profiles table to match our schema
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_picture TEXT;

-- Create books table
CREATE TABLE IF NOT EXISTS public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT,
  cover_url TEXT,
  description TEXT,
  published_date DATE,
  genres TEXT[],
  average_rating DECIMAL(2,1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create user_books table for tracking reading status
CREATE TABLE IF NOT EXISTS public.user_books (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('read', 'reading', 'want_to_read')),
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(user_id, book_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.books ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(user_id, book_id)
);

-- Create lists table for user-defined book lists
CREATE TABLE IF NOT EXISTS public.lists (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create list_books junction table
CREATE TABLE IF NOT EXISTS public.list_books (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES public.lists ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(list_id, book_id)
);

-- Create follows table for user relationships
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create review_likes table
CREATE TABLE IF NOT EXISTS public.review_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(review_id, user_id)
);

-- Enable Row Level Security on new tables
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;

-- Books policies (public read access)
CREATE POLICY "Books are viewable by everyone" ON public.books FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert books" ON public.books FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- User books policies
CREATE POLICY "Users can view their own book tracking" ON public.user_books FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own book tracking" ON public.user_books FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own book tracking" ON public.user_books FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own book tracking" ON public.user_books FOR DELETE USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert their own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Lists policies
CREATE POLICY "Public lists are viewable by everyone" ON public.lists FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can insert their own lists" ON public.lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own lists" ON public.lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own lists" ON public.lists FOR DELETE USING (auth.uid() = user_id);

-- List books policies
CREATE POLICY "List books are viewable based on list visibility" ON public.list_books FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.lists 
    WHERE lists.id = list_books.list_id 
    AND (lists.is_public = true OR lists.user_id = auth.uid())
  )
);
CREATE POLICY "Users can manage their own list books" ON public.list_books FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.lists 
    WHERE lists.id = list_books.list_id 
    AND lists.user_id = auth.uid()
  )
);

-- Follows policies
CREATE POLICY "Follows are viewable by everyone" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow others" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- Review likes policies
CREATE POLICY "Review likes are viewable by everyone" ON public.review_likes FOR SELECT USING (true);
CREATE POLICY "Users can like reviews" ON public.review_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike reviews" ON public.review_likes FOR DELETE USING (auth.uid() = user_id);

-- Update the existing handle_new_user function to include username and bio
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, bio)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'username',
    'Book lover 📚'
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    bio = EXCLUDED.bio;
  RETURN new;
END;
$$;

-- Insert some sample books
INSERT INTO public.books (title, author, cover_url, description, genres, average_rating) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop', 'A classic American novel set in the Jazz Age', ARRAY['Fiction', 'Classic'], 4.2),
('To Kill a Mockingbird', 'Harper Lee', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop', 'A gripping tale of racial injustice and childhood innocence', ARRAY['Fiction', 'Drama'], 4.5),
('1984', 'George Orwell', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=400&fit=crop', 'A dystopian social science fiction novel', ARRAY['Fiction', 'Dystopian', 'Science Fiction'], 4.3),
('Pride and Prejudice', 'Jane Austen', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop', 'A romantic novel of manners', ARRAY['Romance', 'Classic'], 4.4),
('The Catcher in the Rye', 'J.D. Salinger', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop', 'A controversial novel about teenage rebellion', ARRAY['Fiction', 'Coming of Age'], 3.8),
('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=400&fit=crop', 'The first book in the magical Harry Potter series', ARRAY['Fantasy', 'Young Adult'], 4.6)
ON CONFLICT DO NOTHING;
