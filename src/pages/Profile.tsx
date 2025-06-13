
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Mail, User, Calendar, Edit, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  username: string;
  bio: string;
  profile_picture: string;
  created_at: string;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist, create one
        await createProfile();
      } else {
        setProfile(data);
        setEditForm({
          username: data.username || '',
          bio: data.bio || ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: user.email?.split('@')[0] || 'User',
          bio: 'Book lover 📚'
        })
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      setEditForm({
        username: data.username || '',
        bio: data.bio || ''
      });
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: editForm.username,
          bio: editForm.bio
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile({
        ...profile,
        username: editForm.username,
        bio: editForm.bio
      });
      
      setEditing(false);
      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setEditForm({
      username: profile?.username || '',
      bio: profile?.bio || ''
    });
    setEditing(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-amber-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
          <p className="text-xl text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Info Card */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your personal details and bio</CardDescription>
                  </div>
                  {!editing ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleCancel}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleSave}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.profile_picture} />
                    <AvatarFallback className="text-lg">
                      {profile?.username?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {profile?.username || user.email?.split('@')[0]}
                    </h3>
                    <p className="text-gray-600 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {user.email}
                    </p>
                  </div>
                </div>

                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        placeholder="Enter your username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label>Username</Label>
                      <p className="text-gray-900 mt-1">{profile?.username || 'Not set'}</p>
                    </div>
                    <div>
                      <Label>Bio</Label>
                      <p className="text-gray-900 mt-1">{profile?.bio || 'No bio added yet'}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Card */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Stats</CardTitle>
                <CardDescription>Your reading journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-600">Member since</p>
                    <p className="font-semibold">
                      {profile?.created_at ? 
                        new Date(profile.created_at).toLocaleDateString() : 
                        'Recently'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-600">Books read</p>
                    <p className="font-semibold">0</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-600">Reading streak</p>
                    <p className="font-semibold">0 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
