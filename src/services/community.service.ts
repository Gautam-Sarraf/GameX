import { ForumPost, ForumComment } from '../types';
import { COMMUNITY_POSTS } from '../mock/data';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

let inMemoryPosts = [...COMMUNITY_POSTS];

export class CommunityService {
  static async getPosts(category?: string, tag?: string): Promise<ForumPost[]> {
    await delay();
    let posts = [...inMemoryPosts];
    if (category && category !== 'All') {
      posts = posts.filter(p => p.category === category);
    }
    if (tag) {
      posts = posts.filter(p => p.tags.includes(tag));
    }
    return posts;
  }

  static async getPostById(id: string): Promise<ForumPost | null> {
    await delay();
    return inMemoryPosts.find(p => p.id === id) || null;
  }

  static async createPost(title: string, content: string, category: ForumPost['category'], tags: string[], author: { username: string; avatar: string }): Promise<ForumPost> {
    await delay(600);
    const newPost: ForumPost = {
      id: `post-${inMemoryPosts.length + 1}`,
      authorUsername: author.username,
      authorAvatar: author.avatar,
      title,
      content,
      category,
      tags,
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString()
    };
    inMemoryPosts.unshift(newPost);
    return newPost;
  }

  static async addComment(postId: string, content: string, author: { username: string; avatar: string }): Promise<ForumPost> {
    await delay(400);
    const newComment: ForumComment = {
      id: `comm-${postId}-${Date.now()}`,
      authorUsername: author.username,
      authorAvatar: author.avatar,
      content,
      timestamp: new Date().toISOString()
    };

    inMemoryPosts = inMemoryPosts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    });

    return inMemoryPosts.find(p => p.id === postId)!;
  }

  static async likePost(postId: string): Promise<ForumPost> {
    await delay(200);
    inMemoryPosts = inMemoryPosts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.likes + 1
        };
      }
      return p;
    });
    return inMemoryPosts.find(p => p.id === postId)!;
  }

  static async getPopularTags(): Promise<{ tag: string; count: number }[]> {
    await delay();
    const tagCounts: { [tag: string]: number } = {};
    inMemoryPosts.forEach(p => {
      p.tags.forEach(t => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}
