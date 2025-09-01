import React from 'react';
import {Carousel} from 'antd';
import './BackgroundImageCarousel.css';

const BackgroundImageCarousel = () => {
    return (
        <Carousel autoplay>
            <div>
                <img
                    src="/background_images/lutsk1night.jpg"
                    alt="Wallpaper 1"
                    style={{ width: '100%', height: '700px', objectFit: 'cover' }}
                />
            </div>
            <div>
                <img
                    src="/background_images/lutsk1day.jpg"
                    alt="Wallpaper 2"
                    style={{ width: '100%', height: '700px', objectFit: 'cover' }}
                />
            </div>
            <div>
                <img
                    src="/background_images/lviv1day.png"
                    alt="Wallpaper 3"
                    style={{ width: '100%', height: '700px', objectFit: 'cover' }}
                />
            </div>
        </Carousel>
    );
};

export default BackgroundImageCarousel;