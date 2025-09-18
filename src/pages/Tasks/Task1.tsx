import React, { useState } from "react";

// Dummy user with friend count
const currentUser = {
  username: "JohnDoe",
  friendsCount: 3, // change this number to test the posting limits
};

const Task1: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [postCount, setPostCount] = useState(0);

  // calculate daily posting limit
  const getPostLimit = () => {
    if (currentUser.friendsCount >= 10) return Infinity;
    if (currentUser.friendsCount >= 2) return 2;
    return 1;
  };

  const handlePost = () => {
    if (postCount >= getPostLimit()) {
      alert("You’ve reached your posting limit for today.");
      return;
    }

    if (!file) {
      alert("Please upload a picture or video.");
      return;
    }

    const newPost = {
      id: Date.now(),
      username: currentUser.username,
      caption,
      file: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
      likes: 0,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setPostCount(postCount + 1);
    setFile(null);
    setCaption("");
  };

  const handleLike = (id: number) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleComment = (id: number, comment: string) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );
  };

  return (
    <div className="public-space">
      <h2>Public Space</h2>
      <p>
        Posting limit:{" "}
        {getPostLimit() === Infinity ? "Unlimited" : getPostLimit()} per day
      </p>

      {/* Post Upload Section */}
      <div className="create-post">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <input
          type="text"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button onClick={handlePost}>Post</button>
      </div>

      {/* Posts Feed */}
      <div className="posts-feed">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h4>{post.username}</h4>
            {post.type === "image" ? (
              <img src={post.file} alt="user-upload" width="300" />
            ) : (
              <video src={post.file} controls width="300"></video>
            )}
            <p>{post.caption}</p>
            <button onClick={() => handleLike(post.id)}>👍 {post.likes}</button>
            <div className="comments">
              {post.comments.map((c: string, i: number) => (
                <p key={i}>💬 {c}</p>
              ))}
              <input
                type="text"
                placeholder="Add comment..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    handleComment(post.id, e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Task1;
