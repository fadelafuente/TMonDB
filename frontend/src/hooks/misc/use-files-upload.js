import { useEffect, useState, useRef } from 'react';

export function useFilesUpload() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const urls = useRef(new Set());

    useEffect(() => {
        return () => {
            // eslint-disable-next-line
            for(const url of urls.current) URL.revokeObjectURL(url);
        }
    }, []);

    function handleImagesUpload(files) {
        const newFiles = Array.from(files, (fileObject) => {
            const id = crypto.randomUUID();

            const url = URL.createObjectURL(fileObject);
            urls.current.add(url);
            return { id, url, fileObject };
        });

        setSelectedFiles([...selectedFiles, ...newFiles]);
    }

    function handleImagesDelete(e, id) {
        e.stopPropagation();

        setSelectedFiles(selectedFiles.filter((file) => {
                if(file.id !== id) return true;
                urls.current.delete(file.id);
                URL.revokeObjectURL(file.id);
                return false;
            })
        );
    }

    function handleUploadType(e, id=null) {
        e.preventDefault();

        if(id) {
            handleImagesDelete(e, id);
        } else if(e.target.files) {
            handleImagesUpload(e.target.files);
        } else if(e.dataTransfer.files) {
            handleImagesUpload(e.dataTransfer.files);
        }
    }

    return [selectedFiles, handleUploadType];
}