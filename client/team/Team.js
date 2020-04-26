import React from 'react';

import TeamMember from './TeamMember';

import './team.scss';

const Team = props => {
    const { teamMembers } = props;
    return (
        <div className="team-component">
            {teamMembers.map((member, index) => (
                <TeamMember key={index} member={member} />
            ))}
        </div>
    );
};

export default Team;
