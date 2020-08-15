import React, { useEffect, useContext } from 'react';
import RepoContext from '../context/repo/repoContext';
import Preloader from './Preloader';

const Logout = (props) => {
  const repoContext = useContext(RepoContext);
  const { logoutUser } = repoContext;

  useEffect(() => {
    logoutUser();
    setTimeout(() => {
      props.history.push('/login');
    }, 200);
    // eslint-disable-next-line
  }, []);
  return (
    <div className='container'>
      <Preloader />
    </div>
  );
};

export default Logout;
