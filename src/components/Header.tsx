import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center py-3 animate-fadeIn">
            <div className="relative inline-block mb-2">
                <div className="absolute inset-0 blur-xl bg-gradient-to-r from-indigo-600 to-cyan-600 opacity-20"></div>
                <h1 className="relative text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-gradient-animate">
                    Bilingual Bible Study Merger
                </h1>
            </div>

            <p className="text-sm md:text-base text-slate-300 font-light mb-3">
                ✨ AI-Powered Document Formatting
            </p>

            <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-400 mb-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700">
                    <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Spanish & English</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700">
                    <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <span>Bible Studies</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700">
                    <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                    <span>Instant</span>
                </div>
            </div>
        </header>
    );
};