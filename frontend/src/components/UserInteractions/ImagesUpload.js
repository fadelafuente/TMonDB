import { useEffect, useRef, useState } from "react";
import { Carousel } from "react-bootstrap";
import { BsImages } from "react-icons/bs";

export default function ImagesUpload() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const urls = useRef(new Set());

    useEffect(() => {
        return () => {
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

    function handleUploadType(e) {
        e.preventDefault();

        if(e.target.files) {
            handleImagesUpload(e.target.files);
        } else if(e.dataTransfer.files) {
            handleImagesUpload(e.dataTransfer.files);
        }
    }

    function handleImagesDelete(e, id) {
    e.preventDefault();
    e.stopPropagation();

        setSelectedFiles(selectedFiles.filter((file) => {
                if(file.id !== id) return true;
                urls.current.delete(file.id);
                URL.revokeObjectURL(file.id);
                return false;
            })
        );
    }

    return (
        <div className="row-gap-container section-bottom-barrier">
            <label 
                className="col-gap-container images-upload-input"
                onDrop={ e => handleUploadType(e) }
                onDragOver={ (e) => e.preventDefault() }
            >
                <input
                    accept="image/png, image/jpg, image/gif"
                    type="file"
                    multiple 
                    onChange={ e => handleUploadType(e) }
                />
                    {
                        selectedFiles.length > 0 ? 
                            <div className="image-aspect-container image-uploaded-svg-container">
                                <Carousel interval={ null }>
                                    {
                                        selectedFiles.map((file, _) => {
                                            return (
                                                <Carousel.Item key={ file.id } onClick={ e => handleImagesDelete(e, file.id) }>
                                                    <div className="uploaded-images-container">
                                                        <img
                                                            src={ file.url }
                                                            alt={ "uploaded image" }
                                                        />
                                                    </div>
                                                </Carousel.Item>
                                            )
                                        })
                                    }
                                </Carousel>
                            </div>
                        :
                            <div className="image-upload-svg-container">
                                <BsImages />
                            </div>
                    }
                <div>
                    Drag and drop, or browse image(s).
                </div>
            </label>
        </div>
    );
}