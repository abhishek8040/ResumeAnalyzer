import React from 'react';
import { useLocation } from 'react-router-dom';
import AnalysisSummary from '@/components/AnalysisSummary';
import SuggestionsList from '@/components/SuggestionsList';
import RatingBadge from '@/components/RatingBadge';
import SkillsGap from '@/components/SkillsGap';

const Result: React.FC = () => {
    const location = useLocation();
    const state = location.state as any;
    const analysisResults = state?.analysisResults;

    if (!analysisResults) {
        return <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">No analysis results available.</div>;
    }

        const highlightsList: string[] = [
                ...analysisResults?.highlights?.skills || [],
                ...analysisResults?.highlights?.projects || [],
                ...analysisResults?.highlights?.keywords?.slice(0, 5) || []
        ];

            return (
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4 py-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analysis Results</h1>
                            <RatingBadge rating={analysisResults.rating} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
                                <AnalysisSummary summary={analysisResults.summary} rating={analysisResults.rating} highlights={highlightsList} />
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Skills Gap</h2>
                                <SkillsGap missingSkills={analysisResults.skillsGap || []} targetJobTitle={analysisResults.jobTitle || 'Target Role'} />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Suggestions</h2>
                            <SuggestionsList suggestions={analysisResults.suggestions || []} />
                        </div>
                    </div>
                </div>
            );
};

export default Result;