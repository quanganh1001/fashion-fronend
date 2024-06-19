import { useState } from 'react';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption,
} from 'reactstrap';


 
export default function Home() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

     const listBanner = [
         'https://res.cloudinary.com/dmmvhjl0m/image/upload/v1711885305/ysmew6aqlneqdojqdgdq.webp',
         'https://res.cloudinary.com/dmmvhjl0m/image/upload/v1711885303/bfbpbb0zfrhe5k1wn8hx.webp',
         'https://res.cloudinary.com/dmmvhjl0m/image/upload/v1711885307/tzbdiicr7ds9ncao7jxj.webp',
         'https://res.cloudinary.com/dmmvhjl0m/image/upload/v1711885309/k6eyr9bcnhwppvvmshq2.webp',
    ];
    
    const next = () => {
        if (animating) return;
        const nextIndex =
            activeIndex === listBanner.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    };

    const previous = () => {
        if (animating) return;
        const nextIndex =
            activeIndex === 0 ? listBanner.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    };

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    };

    const slides = listBanner.map((item, index) => {
        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={index}
            >
                <img
                    src={item}
                    alt={`Slide ${index + 1}`}
                    className="d-block w-100"
                />
                <CarouselCaption captionText="" captionHeader="" />
            </CarouselItem>
        );
    });

   

    return (
        <>
                <Carousel
                    activeIndex={activeIndex}
                    next={next}
                    previous={previous}
                    className="position-relative"
                >
                    <CarouselIndicators
                        items={listBanner}
                        activeIndex={activeIndex}
                        onClickHandler={goToIndex}
                    />
                    {slides}
                    <CarouselControl
                        direction="prev"
                        directionText="Previous"
                        onClickHandler={previous}
                    />
                    <CarouselControl
                        direction="next"
                        directionText="Next"
                        onClickHandler={next}
                    />
                </Carousel>
        </>
    );
}
