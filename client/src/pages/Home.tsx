import React from 'react';
import UploadForm from '@/components/UploadForm';

const Home: React.FC = () => {
    return (
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                    <header className="py-8">
                        <div className="container mx-auto px-4">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Resume Analysis</h1>
                            <p className="text-gray-600 dark:text-gray-300">Upload your resume (PDF) to get instant insights, score, and a professional summary.</p>
                        </div>
                    </header>
                    <main className="container mx-auto px-4 pb-12">
                        <UploadForm />
                    </main>
                </div>
    );
};

export default Home;