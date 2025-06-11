
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, List, Users, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface BookList {
  id: string;
  title: string;
  description: string;
  is_public: boolean;
  created_at: string;
  book_count: number;
}

const Lists = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lists, setLists] = useState<BookList[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newList, setNewList] = useState({
    title: '',
    description: '',
    is_public: true
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchLists();
  }, [user, navigate]);

  const fetchLists = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('lists')
        .select(`
          id,
          title,
          description,
          is_public,
          created_at,
          list_books(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const listsWithCount = data.map(list => ({
        ...list,
        book_count: list.list_books?.[0]?.count || 0
      }));

      setLists(listsWithCount);
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const createList = async () => {
    if (!user || !newList.title.trim()) return;

    try {
      const { error } = await supabase
        .from('lists')
        .insert({
          title: newList.title,
          description: newList.description,
          is_public: newList.is_public,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "List created!",
        description: "Your new book list has been created successfully."
      });

      setNewList({ title: '', description: '', is_public: true });
      setIsCreateDialogOpen(false);
      fetchLists();
    } catch (error) {
      console.error('Error creating list:', error);
      toast({
        title: "Error",
        description: "Failed to create list. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <List className="h-12 w-12 text-amber-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading your lists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Lists</h1>
            <p className="text-xl text-gray-600">Organize your books into custom lists</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4 mr-2" />
                Create List
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New List</DialogTitle>
                <DialogDescription>
                  Create a custom list to organize your books
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">List Title</Label>
                  <Input
                    id="title"
                    placeholder="My Favorite Sci-Fi Books"
                    value={newList.title}
                    onChange={(e) => setNewList({ ...newList, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="A collection of my favorite science fiction novels..."
                    value={newList.description}
                    onChange={(e) => setNewList({ ...newList, description: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={newList.is_public}
                    onCheckedChange={(checked) => setNewList({ ...newList, is_public: checked })}
                  />
                  <Label htmlFor="public">Make this list public</Label>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={createList} className="bg-amber-600 hover:bg-amber-700 flex-1">
                    Create List
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {lists.length === 0 ? (
          <div className="text-center py-16">
            <List className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No lists yet</h3>
            <p className="text-gray-600 mb-6">Create your first book list to get started</p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First List
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => (
              <Card key={list.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{list.title}</CardTitle>
                    {list.is_public ? (
                      <Users className="h-4 w-4 text-green-600" />
                    ) : (
                      <Lock className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <CardDescription>
                    {list.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{list.book_count} book{list.book_count !== 1 ? 's' : ''}</span>
                    <span>
                      {list.is_public ? 'Public' : 'Private'}
                    </span>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(`/lists/${list.id}`)}
                    >
                      View List
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lists;
