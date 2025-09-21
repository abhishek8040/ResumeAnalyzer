import { useState } from 'react';
import { analyzeResume } from '../services/api';

const useAnalysis = () => {
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const analyze = async (resumeFile) => {
        setLoading(true);
        setError(null);
        try {
            const result = await analyzeResume(resumeFile);
            setAnalysisResult(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { analysisResult, loading, error, analyze };
};

export default useAnalysis;