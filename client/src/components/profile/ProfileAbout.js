import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual } from 'react-redux';

const ProfileAbout = ({
    profile: {
        bio,
        skills,
        user: { name },
    },
}) => {
    return (
        <div class="profile-about bg-light p-2">
            {bio && (
                <Fragment>
                    <h2 class="text-primary">{name.trim().split(' ')[0]}'s Bio</h2>
                    <p>{bio}</p>
                    <div class="line"></div>
                </Fragment>
            )}
            <h2 class="text-primary">Skill Set</h2>
            <div class="skills">
                {skills.map((item) => (
                    <div key={item} class="p-1">
                        <i class="fa fa-check"></i> {item}
                    </div>
                ))}
            </div>
        </div>
    );
};

ProfileAbout.propTypes = {
    profile: PropTypes.object.isRequired,
};

export default ProfileAbout;
