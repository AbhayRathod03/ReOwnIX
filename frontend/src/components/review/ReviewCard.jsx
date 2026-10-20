// src/components/review/ReviewCard.jsx
import React from 'react';
import { Card, CardHeader, CardContent, IconButton, Avatar, Typography, Box } from '@mui/material';
import { Delete } from '@mui/icons-material';
import RatingStars from './RatingStars';
import { formatDistanceToNow } from 'date-fns';

/**
 * ReviewCard displays a single review.
 * Props:
 *   - review: ReviewResponse object from backend
 *   - canDelete: boolean – show delete button if true
 *   - onDelete: function(reviewId) – callback when delete is clicked
 */
const ReviewCard = ({ review, canDelete = false, onDelete }) => {
  const { reviewId, rating, comment, buyerName, createdAt } = review;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(reviewId);
  };

  return (
    <Card elevation={2} sx={{ mb: 2, backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255,255,255,0.1)' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ width: 40, height: 40 }}>
            {buyerName?.[0] ?? 'U'}
          </Avatar>
        }
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight="600">
              {buyerName ?? 'Anonymous'}
            </Typography>
            {canDelete && (
              <IconButton aria-label="delete review" size="small" onClick={handleDelete}>
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
        }
        subheader={formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
      />
      <CardContent>
        <RatingStars value={rating} readOnly />
        <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
          {comment}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
