import { Carousel } from 'react-bootstrap';

function handleCarouselItem(image) {
    return (
        <Carousel.Item>
            <img src={ image } />
        </Carousel.Item>
    )
}

function ImageGallery({ gallery, uploaded=true }) {
    if(uploaded) return;
    if(!gallery) {
        return (
            <Carousel interval={null}>
                <Carousel.Item>
                    <img src={ 'https://placehold.co/600x400' } alt="placeholder image" />
                </Carousel.Item>
                <Carousel.Item>
                    <img src={ 'https://placehold.co/600x400' } alt="placeholder image" />
                </Carousel.Item>
            </Carousel>
        ) 
    } 
    /*
    else if(gallery.length == 1) {
        return <img src={ gallery } />
    } else {
        return (
            <Carousel interval={null}>
                { gallery.map(handleCarouselItem) }
            </Carousel>
        ) 
    }
    */
}

export default ImageGallery;