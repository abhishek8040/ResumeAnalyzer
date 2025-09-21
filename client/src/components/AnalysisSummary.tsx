import React from 'react';

interface AnalysisSummaryProps {
    summary: string;
    rating: number;
    highlights: string[];
}

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ summary, rating, highlights }) => {
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Professional Summary</h2>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">{summary}</p>

            <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Extracted Highlights</h3>
                {highlights.length ? (
                    <div className="flex flex-wrap gap-2">
                        {highlights.map((h, i) => (
                            <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                                {h}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-300">No highlights found.</p>
                )}
            </div>
        </div>
    );
};

export default AnalysisSummary;