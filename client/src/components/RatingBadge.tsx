import React from 'react';

interface RatingBadgeProps {
    rating: number;
}

const RatingBadge: React.FC<RatingBadgeProps> = ({ rating }) => {
    const getBadgeColor = (rating: number) => {
        if (rating >= 8) return 'bg-green-500';
        if (rating >= 5) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-white ${getBadgeColor(rating)}`}>
            {rating} / 10
        </div>
    );
};

export default RatingBadge;