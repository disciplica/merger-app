import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { OutputDisplay } from './components/OutputDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { extractTextFromDocx } from './services/docParser';
import { mergeDocuments } from './services/geminiService';

function App() {
  const [spanishFile, setSpanishFile] = useState<File | null>(null);
  const [englishFile, setEnglishFile] = useState<File | null>(null);
  const [mergedContent, setMergedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSpanishFileSelect = useCallback((file: File) => {
    setSpanishFile(file);
  }, []);

  const handleEnglishFileSelect = useCallback((file: File) => {
    setEnglishFile(file);
  }, []);

  const handleMerge = async () => {
    if (!spanishFile || !englishFile) {
      setError('Please upload both Spanish and English documents.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMergedContent('');

    try {
      const spanishText = await extractTextFromDocx(spanishFile);
      const englishText = await extractTextFromDocx(englishFile);
      const result = await mergeDocuments(spanishText, englishText);
      setMergedContent(result);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred during merging.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const canMerge = spanishFile && englishFile && !isLoading;

  return (
    <div className="bg-slate-900 min-h-screen text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Header />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUpload
            id="spanish-file"
            label="Spanish Study Guide (.docx)"
            onFileSelect={handleSpanishFileSelect}
          />
          <FileUpload
            id="english-file"
            label="English Study Guide (.docx)"
            onFileSelect={handleEnglishFileSelect}
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleMerge}
            disabled={!canMerge}
            className="w-full md:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span>Merging...</span>
              </>
            ) : (
              'Merge Documents'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <OutputDisplay content={mergedContent} />
      </div>
    </div>
  );
}

export default App;
