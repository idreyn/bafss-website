import React from 'react';
import classNames from 'classnames';
import { useImageLoader } from '../util';

const TeamMember = props => {
    const {
        member: { name, detail, imageUrl },
    } = props;
    const imageLoaded = useImageLoader(imageUrl);

    return (
        <div className="team-member-component">
            <div className="headshot-container">
                <div
                    className={classNames('headshot', imageLoaded && 'loaded')}
                    style={{ backgroundImage: `url("${imageUrl}")` }}
                />
            </div>
            <div className="name">{name}</div>
            {detail && <div className="detail">detail</div>}
        </div>
    );
};

export default TeamMember;
