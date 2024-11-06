"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './contactform.css';

type Comment = {
  id: number;
  name: string;
  comment: string;
  rating: number;
};

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get<Comment[]>('http://localhost:5000/comments');  // Specify the expected type here
      setComments(response.data);  // TypeScript will now recognize this as Comment[]
      calculateAverageRating(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const calculateAverageRating = (comments: Comment[]) => {
    const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
    setAverageRating(totalRating / comments.length || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !comment || rating === 0) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/comments', { name, comment, rating });
      fetchComments();
      setName('');
      setComment('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <section className="contact">
      <div className="contact-form">
        <h2>Leave a Comment & Rating</h2>
        <form onSubmit={handleSubmit}>
          <h4>Name</h4>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <h4>Comment</h4>
          <textarea
            placeholder="Your Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <h4>Rating</h4>
          <div className="rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                selected={star <= rating}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <button type="submit">Submit</button>
        </form>
        <h3>Average Rating : <span className="average-rating">{averageRating.toFixed(1)} ★</span></h3>
        <div className="comments-list">
          {comments.map((c) => (
            <div key={c.id} className="comment">
              <div className="comment-header">
                <strong>{c.name}</strong> - 
                <span className="comment-rating">{c.rating} ★</span>
              </div>
              <p>{c.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

type StarIconProps = {
  selected: boolean;
  onClick: () => void;
};

const StarIcon: React.FC<StarIconProps> = ({ selected, onClick }) => (
  <span 
    onClick={onClick} 
    style={{ 
      cursor: 'pointer', 
      color: selected ? 'yellow' : 'gray'  // Menambahkan warna kuning jika terpilih, abu-abu jika tidak
    }}
  >
    {selected ? '★' : '☆'}
  </span>
);

export default ContactForm;
