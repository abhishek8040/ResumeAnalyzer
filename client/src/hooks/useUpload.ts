import { useState } from 'react';
import { uploadResume as apiUploadResume } from '@/services/api';

export default function useUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        if (!selectedFile) return;
        if (selectedFile.type !== 'application/pdf') {
            setError('Please upload a valid PDF file (.pdf).');
            setFile(null);
            return;
        }
        setError(null);
        setFile(selectedFile);
    };

    const upload = async (opts?: { jobTitle?: string; jobSkills?: string[] }): Promise<any | null> => {
        if (!file) {
            setError('No file selected.');
            return null;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await apiUploadResume(file, opts);
            return data;
        } catch (e: any) {
            setError(e?.message || 'Upload failed');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { file, setFile, loading, error, handleFileChange, upload };
}