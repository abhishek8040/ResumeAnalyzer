import React from 'react';

interface Suggestion {
    id: number;
    text: string;
}

interface SuggestionsListProps {
    suggestions: Suggestion[];
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({ suggestions }) => {
    if (!suggestions?.length) {
        return <p className="text-gray-600 dark:text-gray-300">No suggestions at this time.</p>;
    }
    return (
        <ul className="space-y-3">
            {suggestions.map((suggestion) => (
                <li key={suggestion.id} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="text-gray-800 dark:text-gray-200">{suggestion.text}</span>
                </li>
            ))}
        </ul>
    );
};

export default SuggestionsList;