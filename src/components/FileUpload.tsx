import { useState, useRef, useCallback } from 'react';

interface FileUploadProps {
    id: string;
    label: string;
    onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ id, label, onFileSelect }) => {
    const [fileName, setFileName] = useState<string>('');
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.name.endsWith('.docx')) {
                alert('Please upload a .docx file');
                return;
            }
            setFileName(file.name);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            if (!file.name.endsWith('.docx')) {
                alert('Please upload a .docx file');
                return;
            }
            setFileName(file.name);
            onFileSelect(file);
        }
    };

    return (
        <div className="animate-fadeIn">
            <label htmlFor={id} className="block text-xs font-semibold text-slate-300 mb-1.5">
                {label}
            </label>
            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    relative group cursor-pointer
                    flex flex-col items-center justify-center
                    p-4 rounded-lg
                    border-2 border-dashed transition-all duration-300
                    min-h-[140px]
                    ${isDragging
                        ? 'border-indigo-400 bg-indigo-500/10 scale-105'
                        : fileName
                            ? 'border-green-500 bg-green-500/5 hover:bg-green-500/10'
                            : 'border-slate-600 bg-slate-800/30 hover:border-indigo-500 hover:bg-slate-800/50'
                    }
                    backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-indigo-500/10
                    transform hover:-translate-y-1
                `}
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-indigo-600/5 to-indigo-600/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">
                    {fileName ? (
                        <>
                            <div className="w-10 h-10 mb-2 rounded-full bg-green-500/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-xs font-semibold text-green-400 mb-1">✓ Uploaded</p>
                            <p className="text-xs text-slate-400 text-center max-w-full px-2 truncate">
                                {fileName}
                            </p>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFileName('');
                                }}
                                className="mt-2 text-xs text-slate-400 hover:text-white transition-colors underline"
                            >
                                Change
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="w-10 h-10 mb-2 rounded-full bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                                <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <p className="text-xs font-semibold text-slate-300 mb-1 text-center">
                                {isDragging ? 'Drop here' : 'Click or drag'}
                            </p>
                            <p className="text-xs text-slate-500 text-center">
                                .DOCX only
                            </p>
                        </>
                    )}
                </div>

                <input
                    id={id}
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".docx"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};