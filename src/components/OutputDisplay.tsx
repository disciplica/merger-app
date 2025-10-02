import { useState } from 'react';

interface OutputDisplayProps {
    content: string;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ content }) => {
    const [copied, setCopied] = useState(false);

    if (!content) {
        return null;
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'merged-study-guide.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="mt-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                    📄 Merged Document
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="group relative px-3 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-indigo-500/50 flex items-center gap-2 text-sm"
                    >
                        {copied ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="hidden sm:inline">Copied!</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span className="hidden sm:inline">Copy</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="group relative px-3 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-cyan-500/50 flex items-center gap-2 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span className="hidden sm:inline">Download</span>
                    </button>
                </div>
            </div>

            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative bg-slate-800 rounded-lg p-4 border border-slate-700 shadow-xl max-h-[500px] overflow-y-auto custom-scrollbar">
                    <pre className="whitespace-pre-wrap text-slate-300 font-mono text-xs md:text-sm leading-relaxed">
                        {content}
                    </pre>
                </div>
            </div>
        </div>
    );
};