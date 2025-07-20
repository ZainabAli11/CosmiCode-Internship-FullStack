import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts', err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) return alert('Please fill in all fields');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (file) formData.append('image', file);

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/posts/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Post updated successfully');
        setEditId(null);
      } else {
        await axios.post('http://localhost:5000/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Post created successfully');
      }

      setTitle('');
      setContent('');
      setFile(null);
      setPreview(null);
      fetchPosts();
    } catch (err) {
      console.error('Submit failed:', err);
      alert('Submit failed. See console for details.');
    }
  };

  const handleEdit = (post) => {
    setEditId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setPreview(post.image ? `http://localhost:5000/uploads/${post.image}` : null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:5000/posts/${id}`);
        alert('Post deleted');
        fetchPosts();
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Delete failed');
      }
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="wrapper">
      <header>My Blog</header>
      <main className="container">
        <div className="content-box">
          <div className="form-box">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
            />
            <label className="file-card">
              <input type="file" onChange={handleFileChange} />
              <span>{file?.name || 'Choose an image'}</span>
            </label>
            {preview && <img src={preview} alt="preview" className="preview" />}
            <button onClick={handleSubmit}>
              {editId ? 'Update Post' : 'Create Post'}
            </button>
          </div>

          <div className="posts">
            {posts.map((post) => (
              <div key={post._id} className="post">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                {post.image && (
                  <img
                    src={`http://localhost:5000/uploads/${post.image}`}
                    alt="post"
                    className="post-image"
                  />
                )}
                <div className="actions">
                  <button onClick={() => handleEdit(post)}>Edit</button>
                  <button onClick={() => handleDelete(post._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer>&copy; 2025 Blog Platform. All rights reserved.</footer>
    </div>
  );
}

export default App;
