import React from 'react';

const Showcase = (props) => {
  return (
    <div id='showcase'>
      <div className={props.showcase.showcaseStyle}>
        <h1 style={{ fontSize: '3.7rem' }}>{props.showcase.showcaseTitle}</h1>
        <hr className='line-showcase' />
        <h3>{props.showcase.showcaseText}</h3>
      </div>
    </div>
  );
};

export default Showcase;
