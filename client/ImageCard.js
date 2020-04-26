import React from 'react';
import classNames from 'classnames';

import { useImageLoader } from './util';

import './imageCard.scss';

const ImageCard = props => {
    const { src } = props;
    const isLoaded = useImageLoader(src);

    return (
        <div className="image-card-component">
            <img src={src} className={classNames(isLoaded && 'loaded')} />
        </div>
    );
};

export default ImageCard;
