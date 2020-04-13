import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import './imageCard.scss';

const ImageCard = props => {
    const { src } = props;
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.onload = () => setIsLoaded(true);
        img.src = src;
        return () => setIsLoaded(false);
    }, [src]);

    return (
        <div className="image-card-component">
            <img src={src} className={classNames(isLoaded && 'loaded')} />
        </div>
    );
};

export default ImageCard;
