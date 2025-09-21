import axios from 'axios';

const API_BASE_URL = '/api';

export const uploadResume = async (
    file: File,
    opts?: { jobTitle?: string; jobSkills?: string[] }
) => {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        params: {
            jobTitle: opts?.jobTitle || undefined,
            jobSkills: opts?.jobSkills?.length ? opts?.jobSkills.join(',') : undefined,
        },
    });

    return response.data;
};

export const analyzeResume = async (resumeData: any) => {
    const response = await axios.post(`${API_BASE_URL}/analyze`, resumeData);
    return response.data;
};

export const getSuggestions = async (resumeId: string) => {
    const response = await axios.get(`${API_BASE_URL}/suggestions/${resumeId}`);
    return response.data;
};

export const getRating = async (resumeId: string) => {
    const response = await axios.get(`${API_BASE_URL}/rating/${resumeId}`);
    return response.data;
};