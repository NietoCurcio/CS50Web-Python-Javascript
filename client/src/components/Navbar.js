import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RepoContext from '../context/repo/repoContext';

const Navbar = () => {
  const repoContext = useContext(RepoContext);
  const { isAuthenticated, user, authenticate } = repoContext;

  const [hamburger, setHamburger] = useState(false);

  useEffect(() => {
    if (isAuthenticated === false) {
      authenticate();
    }
    // eslint-disable-next-line
  }, []);

  const activeHamburger = () => {
    setHamburger(!hamburger);
  };

  return (
    <nav className={`navbar ${hamburger}`}>
      {/* sometimes inline style is not so evil */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1>Github Network</h1>
        {user && (
          <h3 style={{ marginLeft: '1rem', paddingTop: '0.1rem' }}>
            Signed as {user}
          </h3>
        )}
      </div>
      <ul>
        {isAuthenticated ? (
          <Fragment>
            <li onClick={activeHamburger}>
              <Link to='/'>Home</Link>
            </li>
            <li onClick={activeHamburger}>
              <Link to='/create'>Create Post</Link>
            </li>
            <li onClick={activeHamburger}>
              <Link to='/logout'>Logout</Link>
            </li>
            {/* <li>My Repos</li> */}
          </Fragment>
        ) : (
          <Fragment>
            <li onClick={activeHamburger}>
              <Link to='/login'>Login</Link>
            </li>
            <li onClick={activeHamburger}>
              <Link to='/register'>Register</Link>
            </li>
            <li onClick={activeHamburger}>
              <Link to='/'>Home</Link>
            </li>
          </Fragment>
        )}
      </ul>
      <div className='toggle' onClick={activeHamburger}></div>
    </nav>
  );
};

export default Navbar;
