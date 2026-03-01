import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './admin.css';

function ReviewList() {

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get('http://localhost:8081/reviews');
      setReviews(res.data);
    } catch (error) {
      console.error('Fetch Reviews Error:', error);
    }
  };

  return (
    <div className="review-container">
      <h2>⭐ Farmer Reviews</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Farmer</th>
            <th>Customer</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length === 0 ? (
            <tr>
              <td colSpan="5">No Reviews Found</td>
            </tr>
          ) : (
            reviews.map((r) => (
              <tr key={r.id}>
                <td>{r.farmer_name}</td>
                <td>{r.customer_name}</td>
                <td>{'⭐'.repeat(r.rating)}</td>
                <td>{r.comment}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewList;