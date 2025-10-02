import { useState, useCallback } from 'react';
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
  const [progress, setProgress] = useState<string>('');

  const handleSpanishFileSelect = useCallback((file: File) => {
    setSpanishFile(file);
    setError(null);
  }, []);

  const handleEnglishFileSelect = useCallback((file: File) => {
    setEnglishFile(file);
    setError(null);
  }, []);

  const handleMerge = async () => {
    if (!spanishFile || !englishFile) {
      setError('Please upload both Spanish and English documents.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMergedContent('');
    setProgress('Reading Spanish document...');

    try {
      const spanishText = await extractTextFromDocx(spanishFile);
      setProgress('Reading English document...');

      const englishText = await extractTextFromDocx(englishFile);
      setProgress('Merging documents with AI...');

      const result = await mergeDocuments(spanishText, englishText);
      setMergedContent(result);
      setProgress('');
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred during merging.');
      }
      setProgress('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSpanishFile(null);
    setEnglishFile(null);
    setMergedContent('');
    setError(null);
    setProgress('');
  };

  const canMerge = spanishFile && englishFile && !isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-3 py-4 space-y-4">
        <Header />

        {/* File Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUpload
            id="spanish-file"
            label="📖 Spanish Study Guide"
            onFileSelect={handleSpanishFileSelect}
          />
          <FileUpload
            id="english-file"
            label="📖 English Study Guide"
            onFileSelect={handleEnglishFileSelect}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-2">
          <button
            onClick={handleMerge}
            disabled={!canMerge}
            className="group relative w-full sm:w-auto flex items-center justify-center px-6 py-2.5 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-indigo-500/50 disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Merge Documents
              </>
            )}
          </button>

          {(spanishFile || englishFile || mergedContent) && (
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 text-sm font-semibold rounded-lg text-white bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          )}
        </div>

        {/* Progress Indicator */}
        {progress && (
          <div className="flex items-center justify-center gap-2 p-2.5 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-indigo-500/30">
            <LoadingSpinner />
            <span className="text-indigo-300 text-xs font-medium">{progress}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="animate-shake bg-red-900/30 backdrop-blur-sm border border-red-500 text-red-200 px-3 py-2.5 rounded-lg shadow-lg" role="alert">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Output Display */}
        <OutputDisplay content={mergedContent} />

        {/* Footer */}
        <footer className="text-center pt-3 pb-2 text-slate-500 text-xs">
          <p>Created by MM - Powered by Google Gemini AI ✨</p>
        </footer>
      </div>
    </div>
  );
}

export default App;