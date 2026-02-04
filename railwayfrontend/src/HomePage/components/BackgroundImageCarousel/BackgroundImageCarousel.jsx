import React from 'react';
import {Carousel} from 'antd';
import './BackgroundImageCarousel.css';

const BackgroundImageCarousel = () => {
    return (
        <Carousel autoplay = {{dotDuration: true}}>
            <div>
                <img
                    src="/background_images/station1.jpg"
                    alt="Wallpaper 1"
                    style={{ width: '100%', height: '730px', objectFit: 'cover' }}
                />
            </div>
            <div>
                <img
                    src="/background_images/station2.jpg"
                    alt="Wallpaper 2"
                    style={{ width: '100%', height: '730px', objectFit: 'cover' }}
                />
            </div>
            <div>
                <img
                    src="/background_images/station3.jpg"
                    alt="Wallpaper 2"
                    style={{ width: '100%', height: '730px', objectFit: 'cover' }}
                />
            </div>
            <div>
                <img
                    src="/background_images/lutsk1night.jpg"
                    alt="Wallpaper 2"
                    style={{ width: '100%', height: '730px', objectFit: 'cover' }}
                />
            </div>
            <div>
                <img
                    src="/background_images/lviv1day.png"
                    alt="Wallpaper 3"
                    style={{ width: '100%', height: '730px', objectFit: 'cover' }}
                />
            </div>
        </Carousel>
    );
};

export default BackgroundImageCarousel;