import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;

  return (
    <div className="star-rating">
      {[...Array(fullStars)].map((_, i) => <FaStar key={i} className="star full" />)}
      {halfStar && <FaStar className="star half" />}
      {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => <FaRegStar key={i} className="star empty" />)}
    </div>
  );
};

const Review = ({ review }) => (
  <div className="review">
    <p><strong>{review.user}</strong></p>
    <StarRating rating={review.rating} />
    <p>{review.comment}</p>
  </div>
);

export default Review;