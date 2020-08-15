import React, { useContext, Fragment, useEffect } from 'react';
import RepoContext from '../context/repo/repoContext';
import RepoItem from './RepoItem';
import Showcase from './Showcase';

const Repos = () => {
  const repoContext = useContext(RepoContext);
  const { repos, getRepos } = repoContext;

  useEffect(() => {
    getRepos();
    // eslint-disable-next-line
  }, []);
  // https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies
  // It is only safe to omit a function from the dependency list if nothing in it (or the functions called by it)
  // references props, state, or values derived from them. This example has a bug:

  const showcase = {
    showcaseStyle: 'showcase-main',
    showcaseTitle: 'Github Network',
    showcaseText: 'Post & Comments Github Repos',
  };

  return (
    <Fragment>
      <Showcase showcase={showcase} />
      <div className='container'>
        <h2 className='home-title'>Repos in Network</h2>
        {repos &&
          repos.map((repo, index) => <RepoItem repo={repo} key={index} />)}
      </div>
    </Fragment>
  );
};

export default Repos;
