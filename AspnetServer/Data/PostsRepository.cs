﻿using Microsoft.EntityFrameworkCore;

namespace aspnetserver.Data
{
    internal static class PostsRepository
    {
        internal async static Task<List<Post>> GetPostsAsync()
        {
            using (var db = new AppDbContext())
            {
                return await db.Posts.ToListAsync();
            }
        }

        internal async static Task<Post> GetPostByIdAsync(int postId)
        {
            using (var db = new AppDbContext())
            {
                return await db.Posts.FirstOrDefaultAsync(post => post.PostId == postId);    
            }
        }

        internal async static Task<bool> CreatePostAsync(Post postToCreate)
        {
            using (var db = new AppDbContext())
            {
                try
                {
                    await db.Posts.AddAsync(postToCreate);
                    return await db.SaveChangesAsync() >= 1;
                }
                catch (Exception)
                {
                    return false;
                }
            }
        }

        internal async static Task<bool> UpdatePostAsync(Post postToUpdate)
        {
            using (var db = new AppDbContext())
            {
                try
                {
                    db.Posts.Update(postToUpdate);
                    return await db.SaveChangesAsync() >= 1;
                }
                catch (Exception)
                {
                    return false;
                }
            }
        }

        internal async static Task<bool> DeletePostAsync(int postId)
        {
            using (var db = new AppDbContext())
            {
                try
                {
                    Post postToDelete = await GetPostByIdAsync(postId);
                    db.Posts.Remove(postToDelete);
                    return await db.SaveChangesAsync() >= 1;
                }
                catch (Exception)
                {
                    return false;
                }
            }
        }
    }
}