import React from 'react';

const messageBox = (props) => {
    return (
        <div className={`alert alert-${props.variant || 'info'} ${props.isNotCenter ? '' : 'centerdiv'}`}>
          {props.children}
        </div>
      );
};

export default messageBox;
