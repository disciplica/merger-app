import mammoth from 'mammoth';

export const extractTextFromDocx = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            if (!arrayBuffer) {
                return reject(new Error("Failed to read file."));
            }
            // Convert to HTML to preserve formatting like bold, italics, and lists
            mammoth.convertToHtml({ arrayBuffer })
                .then(result => {
                    resolve(result.value); // The value is the HTML of the document
                })
                .catch(err => {
                    const message = err instanceof Error ? err.message : String(err);
                    reject(new Error("Could not parse DOCX file: " + message));
                });
        };
        reader.onerror = (error) => {
            reject(new Error("File reading error: " + error));
        };
        reader.readAsArrayBuffer(file);
    });
};