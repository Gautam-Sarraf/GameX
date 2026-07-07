'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Heart, Search, Users, ChevronRight, MessageCircle, AlertCircle, Plus, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CommunityService } from '@/services/community.service';
import { AuthService } from '@/services/auth.service';
import { ForumPost } from '@/types';
import { cn, formatDate } from '@/lib/utils';

export default function CommunityPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<'All' | 'Trending' | 'Latest' | 'Tournament Posts' | 'Announcements'>('All');
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  
  // Dialog Open States
  const [isPostOpen, setIsPostOpen] = React.useState(false);
  const [activePost, setActivePost] = React.useState<ForumPost | null>(null);

  // Form states for creating post
  const [newTitle, setNewTitle] = React.useState('');
  const [newContent, setNewContent] = React.useState('');
  const [newPostCategory, setNewPostCategory] = React.useState<ForumPost['category']>('Latest');
  const [newTagsStr, setNewTagsStr] = React.useState('');

  // Comment state
  const [commentText, setCommentText] = React.useState('');

  // Fetch Session User
  const { data: user } = useQuery({
    queryKey: ['session-user'],
    queryFn: () => AuthService.getCurrentUser()
  });

  // Fetch Forum Posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['forum-posts', activeCategory, selectedTag],
    queryFn: () => CommunityService.getPosts(activeCategory, selectedTag || undefined)
  });

  // Fetch Popular Tags
  const { data: popularTags = [] } = useQuery({
    queryKey: ['popular-tags'],
    queryFn: () => CommunityService.getPopularTags()
  });

  // Create Post Mutation
  const createPostMutation = useMutation({
    mutationFn: (data: { title: string; content: string; category: ForumPost['category']; tags: string[] }) => {
      if (!user) throw new Error('Not logged in');
      return CommunityService.createPost(data.title, data.content, data.category, data.tags, {
        username: user.username,
        avatar: user.avatar
      });
    },
    onSuccess: () => {
      toast.success('Discussions post published successfully!');
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      setIsPostOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewTagsStr('');
    }
  });

  // Like Mutation
  const likeMutation = useMutation({
    mutationFn: (postId: string) => CommunityService.likePost(postId),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      if (activePost && activePost.id === updated.id) {
        setActivePost(updated);
      }
    }
  });

  // Add Comment Mutation
  const commentMutation = useMutation({
    mutationFn: (data: { postId: string; content: string }) => {
      if (!user) throw new Error('Not logged in');
      return CommunityService.addComment(data.postId, data.content, {
        username: user.username,
        avatar: user.avatar
      });
    },
    onSuccess: (updated) => {
      toast.success('Comment posted!');
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      setActivePost(updated);
      setCommentText('');
    }
  });

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Login required to post.');
      return;
    }
    if (!newTitle.trim() || !newContent.trim()) return;
    const tagList = newTagsStr.split(',').map(t => t.trim()).filter(t => t !== '');
    createPostMutation.mutate({
      title: newTitle,
      content: newContent,
      category: newPostCategory,
      tags: tagList
    });
  };

  const handlePostCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Login required to reply.');
      return;
    }
    if (!activePost || !commentText.trim()) return;
    commentMutation.mutate({
      postId: activePost.id,
      content: commentText
    });
  };

  // Search filter Client-side on top of active queries
  const searchedPosts = React.useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.content.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [posts, searchQuery]);

  return (
    <div className="min-h-screen bg-[#030303] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold uppercase text-white font-oswald tracking-tight flex items-center gap-2">
              <MessageSquare className="h-8 w-8 text-cyan-400" /> Community Forums
            </h1>
            <p className="text-zinc-400 text-sm mt-1">Discuss tournament guidelines, check scrim boards, or talk gaming meta.</p>
          </div>

          <Button variant="glow" size="sm" onClick={() => setIsPostOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Start Discussion
          </Button>
        </div>

        {/* Double split layout: Left (Threads & Search), Right (Tags feed) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Threads */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Search and Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-950 p-3 border border-zinc-900 rounded-xl items-center">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full h-10 rounded-md border border-zinc-800 bg-zinc-900/60 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Reset selected tag badge */}
              {selectedTag && (
                <div className="flex justify-end pr-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs font-bold" onClick={() => setSelectedTag(null)}>
                    Reset Tag: {selectedTag}
                  </Button>
                </div>
              )}
            </div>

            {/* Forum Categories Tabs */}
            <Tabs
              value={activeCategory}
              onValueChange={(val) => {
                setActiveCategory(val as any);
                setSelectedTag(null);
              }}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="All">All Feed</TabsTrigger>
                <TabsTrigger value="Trending">Trending</TabsTrigger>
                <TabsTrigger value="Latest">Latest</TabsTrigger>
                <TabsTrigger value="Tournament Posts">Tournaments</TabsTrigger>
                <TabsTrigger value="Announcements">Alerts</TabsTrigger>
              </TabsList>
            </Tabs>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-28 w-full bg-zinc-900/50 rounded-xl border border-zinc-800 animate-pulse" />
                ))}
              </div>
            ) : searchedPosts.length > 0 ? (
              <div className="space-y-4">
                {searchedPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="border-zinc-900 bg-zinc-950/40 hover:border-zinc-850 transition-colors cursor-pointer"
                    onClick={() => setActivePost(post)}
                  >
                    <CardContent className="p-5 flex gap-4">
                      {/* Avatar */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.authorAvatar} alt="" className="h-10 w-10 rounded-full border border-zinc-800 bg-zinc-900 flex-shrink-0" />
                      
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <span className="font-bold text-zinc-300">{post.authorUsername}</span>
                          <span>•</span>
                          <span>{formatDate(post.timestamp)}</span>
                          <span>•</span>
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-cyan-400 font-bold uppercase text-[9px] tracking-wider">
                            {post.category}
                          </span>
                        </div>

                        <h4 className="text-base font-extrabold text-white leading-tight truncate">{post.title}</h4>
                        <p className="text-xs text-zinc-400 font-semibold line-clamp-2 leading-relaxed">{post.content}</p>

                        <div className="flex justify-between items-center pt-2">
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5">
                            {post.tags.map(t => (
                              <span key={t} className="text-[9px] font-bold bg-zinc-900/60 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                                #{t}
                              </span>
                            ))}
                          </div>

                          {/* Likes & Comments Count */}
                          <div className="flex items-center gap-4 text-xs text-zinc-500">
                            <span className="flex items-center hover:text-red-500 transition-colors" onClick={(e) => {
                              e.stopPropagation();
                              likeMutation.mutate(post.id);
                            }}>
                              <Heart className="h-4 w-4 mr-1 text-red-500/80 fill-current" /> {post.likes}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" /> {post.comments.length}
                            </span>
                          </div>
                        </div>

                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-zinc-900 rounded-xl bg-zinc-950/20 text-zinc-500">
                No discussion threads found. Start a new one!
              </div>
            )}

          </div>

          {/* Right: Popular Tags Feed */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white font-oswald flex items-center gap-2 border-b border-zinc-900 pb-3">
                <Users className="h-5 w-5 text-cyan-400" /> Popular Tags
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-2 p-4 bg-zinc-950/40 border border-zinc-900 rounded-xl">
              {popularTags.map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={cn(
                    'px-2.5 py-1 text-xs rounded-md border font-semibold uppercase transition-all cursor-pointer',
                    selectedTag === tag
                      ? 'border-cyan-500 bg-cyan-950/30 text-cyan-400 font-bold'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700'
                  )}
                >
                  #{tag} <span className="text-[10px] text-zinc-600 font-mono ml-0.5">({count})</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Start Discussion Modal Dialog */}
      <Dialog open={isPostOpen} onOpenChange={setIsPostOpen}>
        <DialogContent onClose={() => setIsPostOpen(false)}>
          <DialogHeader>
            <DialogTitle>Start a Discussion</DialogTitle>
            <DialogDescription>Share updates, team recruitment notes, or questions.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePostSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Discussion Title</label>
              <Input
                placeholder="Write a catchy summary title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Category Category</label>
              <select
                value={newPostCategory}
                onChange={(e) => setNewPostCategory(e.target.value as any)}
                className="w-full h-10 rounded-md border border-zinc-800 bg-zinc-900 text-sm text-zinc-300 px-3 focus:outline-none"
              >
                <option value="Latest">General Forum</option>
                <option value="Trending">Trending</option>
                <option value="Tournament Posts">Tournament Feed</option>
                <option value="Announcements">Announcement Alert</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Tags (comma separated)</label>
              <Input
                placeholder="e.g. CS2, update, aiming, LFG"
                value={newTagsStr}
                onChange={(e) => setNewTagsStr(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Content Body</label>
              <Textarea
                placeholder="Explain details..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={5}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button type="button" variant="ghost" onClick={() => setIsPostOpen(false)}>Cancel</Button>
              <Button type="submit" variant="glow" disabled={createPostMutation.isPending}>
                {createPostMutation.isPending ? 'Publishing...' : 'Publish Thread'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Discussion Thread Detail Modal Dialog */}
      {activePost && (
        <Dialog open={!!activePost} onOpenChange={() => setActivePost(null)}>
          <DialogContent className="max-w-2xl" onClose={() => setActivePost(null)}>
            <DialogHeader>
              <DialogTitle className="text-xl">{activePost.title}</DialogTitle>
              <div className="flex items-center gap-2 text-xs text-zinc-500 mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activePost.authorAvatar} alt="" className="h-6 w-6 rounded-full" />
                <span className="font-bold text-zinc-300">{activePost.authorUsername}</span>
                <span>•</span>
                <span>{formatDate(activePost.timestamp)}</span>
              </div>
            </DialogHeader>

            <div className="space-y-6 pt-2">
              {/* Thread Content */}
              <p className="text-sm text-zinc-300 leading-relaxed font-semibold">
                {activePost.content}
              </p>

              {/* Likes Row */}
              <div className="flex items-center gap-4 text-xs text-zinc-500 border-b border-zinc-900 pb-4">
                <Button variant="outline" size="sm" onClick={() => likeMutation.mutate(activePost.id)} className="h-8">
                  <Heart className="h-3.5 w-3.5 mr-1.5 text-red-500 fill-current" /> Like Thread ({activePost.likes})
                </Button>
                <span>{activePost.comments.length} Comments</span>
              </div>

              {/* Comments/Replies Feed */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {activePost.comments.map(c => (
                  <div key={c.id} className="flex items-start gap-3 text-xs border-b border-zinc-950 pb-3 last:border-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.authorAvatar} alt="" className="h-7 w-7 rounded-full border border-zinc-800" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{c.authorUsername}</span>
                        <span className="text-[10px] text-zinc-500">{formatDate(c.timestamp)}</span>
                      </div>
                      <p className="text-zinc-400 font-semibold leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                ))}

                {activePost.comments.length === 0 && (
                  <div className="text-center py-6 text-zinc-500 text-xs">No replies yet. Be the first to answer!</div>
                )}
              </div>

              {/* Reply Field */}
              <form onSubmit={handlePostCommentSubmit} className="flex gap-2 border-t border-zinc-900 pt-4">
                <input
                  type="text"
                  placeholder={user ? "Write a response..." : "Login to write replies..."}
                  disabled={!user}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-grow h-10 px-4 rounded-md border border-zinc-800 bg-zinc-900/60 text-sm text-white focus:outline-none"
                />
                <Button type="submit" disabled={!user || !commentText.trim()} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
