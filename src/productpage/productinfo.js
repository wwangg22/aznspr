import './productinfo.css';
import React from 'react';

export default function ProductInfo({ 
    title, 
    price, 
    reviews, 
    description, 
    averageRating,  // New prop
    reviewCount,     // New prop
    features,
    href,
    details,          // New prop
}) {
    console.log(details);
    //const d = JSON.parse(details);
    return (
        <div className="product-page">
            <h1 className="product-title">{title}</h1>

            {/* Display average rating and total review count below title */}
            <div className="product-rating">
                <span className="rating-value">
                    {averageRating} ⭐ / 5 
                </span>
                <span className="review-count">
                    ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                </span>
            </div>
            
            <p className="product-price">${price}</p>

            <div className="product-reviews">
                <h2>Reviews:</h2>
                {reviews.map((review, index) => (
                    <div key={index} className="review">
                        <p><strong>{review.author}</strong>: {review.comment}</p>
                    </div>
                ))}
            </div>

            <div className="product-description">
                <h2>Description:</h2>
                <p>{description}</p>
            </div>
            <div className="product-features">
                <h2>Features:</h2>
                <p>{features}</p>
            </div>

            {/* New Section for Details */}
            <div className="product-details">
                <h2>Details:</h2>
                <div>
                    {Object.entries(details).map(([key, value], index) => (
                        <p key={index}><strong>{key}:</strong> {value}</p>
                    ))}
                </div>
            </div>

            <div className="link">
                <h2>Link:</h2>
                <a href={href}>{href}</a>
            </div>
            
        </div>
    )
}
