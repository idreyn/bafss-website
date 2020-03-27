import React from 'react';

const Photos = props => {
    const { srcs } = props;
    return (
        <div className="photos">
            {srcs.map(src => (
                <img key={src} src={src} />
            ))}
        </div>
    );
};

export default Photos;
