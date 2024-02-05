import React from 'react';

const Footer = () => {
    //JSX structure
    return (
        <>
            <div className="footer_container">
                <span id="gh_link">
                    <a href="https://github.com/a10abrams/task_manager">
                        <img id="gh_cat_logo" src="github-mark.png" alt="Navigate to github repository for this project"/>
                    </a>
                </span>
            </div>
        </>
    )
};

export default Footer;
