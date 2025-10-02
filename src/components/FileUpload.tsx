
import React, { useState, useRef, useCallback } from 'react';

interface FileUploadProps {
    id: string;
    label: string;
    onFileSelect: (file: File) => void;
}

const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export const FileUpload: React.FC<FileUploadProps> = ({ id, label, onFileSelect }) => {
    const [fileName, setFileName] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-400 mb-2">{label}</label>
            <div
                onClick={handleClick}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-slate-800 transition-colors duration-300"
            >
                <FileIcon />
                <p className="text-sm text-slate-400 text-center">
                    <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500 mt-1">DOCX file</p>
                {fileName && <p className="text-xs text-green-400 mt-2 truncate max-w-full px-2">{fileName}</p>}
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
