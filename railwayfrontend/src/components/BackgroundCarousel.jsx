import React, { useEffect, useState } from 'react';
const dayImages = ["/background_images/lutsk1night.jpg","/background_images/ivano-frankivsk1day.jpg", "/background_images/lutsk1day.jpg", "/background_images/lviv1day.png",
    "/background_images/odesa1day.jpg", "/background_images/ternopil1day.jpg", "/background_images/yaremche1day.jpg"]
import './BackgroundCarousel.css';
function BackgroundCarousel()
{
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prevIndex => (prevIndex + 1) % dayImages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);
    return(
        <div className="background-carousel" style={{backgroundImage: `url(${dayImages[index]})`}} />
    )
}
export default BackgroundCarousel;