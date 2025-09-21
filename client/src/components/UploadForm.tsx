import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUpload from '@/hooks/useUpload';

const UploadForm: React.FC = () => {
    const navigate = useNavigate();
    const { file, handleFileChange, upload, loading, error } = useUpload();
    const [jobTitle, setJobTitle] = useState('');
    const [jobSkills, setJobSkills] = useState('');
    const dropRef = useRef<HTMLLabelElement>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = await upload({
            jobTitle: jobTitle.trim() || undefined,
            jobSkills: jobSkills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        });
        if (result) {
            navigate('/result', { state: { analysisResults: result } });
        }
    };

        const onDragOver = (e: React.DragEvent) => {
            e.preventDefault();
            dropRef.current?.classList.add('border-blue-500');
        };

        const onDragLeave = () => {
            dropRef.current?.classList.remove('border-blue-500');
        };

        const onDrop = (e: React.DragEvent) => {
            e.preventDefault();
            dropRef.current?.classList.remove('border-blue-500');
            const f = e.dataTransfer.files?.[0];
            if (f && f.type === 'application/pdf') {
                const input = document.createElement('input');
                const dt = new DataTransfer();
                dt.items.add(f);
                input.files = dt.files;
                handleFileChange({ target: input } as any);
            }
        };

    return (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
                        <label
                            ref={dropRef}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                        >
                            <span className="text-gray-600 dark:text-gray-300">Drag & drop your PDF here, or click to select</span>
                            <input aria-label="Upload resume PDF" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                        </label>
                        {file && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Selected: {file.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Target job title (optional)"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <input
                            type="text"
                            placeholder="Target skills comma-separated (optional)"
                            value={jobSkills}
                            onChange={(e) => setJobSkills(e.target.value)}
                            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-70">
                        {loading ? 'Analyzing…' : 'Analyze Resume'}
                    </button>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </form>
    );
};

export default UploadForm;