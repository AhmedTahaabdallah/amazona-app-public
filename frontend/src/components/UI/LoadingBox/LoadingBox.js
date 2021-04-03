import React from 'react';

import './LoadingBox.css';

const loadingBox = (props) => {
    return (
        <div className={props.className ? props.className : "centerdiv"}>
            <div className="loader">
                Loading...
            </div>
        </div>
      );
};

export default loadingBox;
