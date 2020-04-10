import React, { useState } from 'react';
import classNames from 'classnames';

import './imageCard.scss';

const ImageCard = props => {
    const { src } = props;
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="image-card-component">
            <img
                src={src}
                onLoad={() => setIsLoaded(true)}
                className={classNames(isLoaded && 'loaded')}
            />
        </div>
    );
};

export default ImageCard;
