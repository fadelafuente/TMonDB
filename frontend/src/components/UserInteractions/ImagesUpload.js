import { Carousel } from "react-bootstrap";
import { BsImages } from "react-icons/bs";
import { useFilesUpload } from "../../hooks/hooks";

export default function ImagesUpload() {
    const [selectedFiles, setSelectedFiles] = useFilesUpload();

    return (
        <div className="row-gap-container section-bottom-barrier">
            <label 
                className="col-gap-container images-upload-input"
                onDrop={ e => setSelectedFiles(e) }
                onDragOver={ (e) => e.preventDefault() }
            >
                <input
                    accept="image/png, image/jpg, image/gif"
                    type="file"
                    multiple 
                    onChange={ e => setSelectedFiles(e) }
                />
                    {
                        selectedFiles.length > 0 ? 
                            <div className="image-aspect-container image-uploaded-svg-container">
                                <Carousel interval={ null }>
                                    {
                                        selectedFiles.map((file, index) => {
                                            return (
                                                <Carousel.Item key={ file.id } onClick={ e => setSelectedFiles(e, file.id) }>
                                                    <div className="uploaded-images-container">
                                                        <img
                                                            src={ file.url }
                                                            alt={ `new_mon_${index}` }
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