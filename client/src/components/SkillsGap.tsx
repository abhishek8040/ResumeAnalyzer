import React from 'react';

interface SkillsGapProps {
    missingSkills: string[];
    targetJobTitle: string;
}

const SkillsGap: React.FC<SkillsGapProps> = ({ missingSkills, targetJobTitle }) => {
    return (
        <div>
            <p className="text-gray-700 dark:text-gray-200 mb-3">
                Missing skills for <span className="font-medium">{targetJobTitle}</span>:
            </p>
            {missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {missingSkills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                            {skill}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="text-green-700 dark:text-green-300">No skills gaps identified for this position.</p>
            )}
        </div>
    );
};

export default SkillsGap;