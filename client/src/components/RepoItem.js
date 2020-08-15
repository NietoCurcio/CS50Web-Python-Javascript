import React from 'react';
import { Link } from 'react-router-dom';

const RepoItem = ({ repo }) => {
  return (
    <div className='repo-item'>
      <div className='content'>
        <h3>
          <strong>{repo.user}</strong>
        </h3>
        <h4>{repo.titleRepoPost}</h4>
        <p>{repo.descriptionRepoPost}</p>
      </div>
      <Link to={`/repo/${repo.id}`}>More</Link>
    </div>
  );
};

export default RepoItem;
