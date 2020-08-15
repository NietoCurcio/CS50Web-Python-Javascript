import React, { useEffect, useContext, Fragment, useState } from 'react';
import RepoContext from '../context/repo/repoContext';
import Preloader from './Preloader';
import ReactMarkdown from 'react-markdown';
import { useParams, useHistory } from 'react-router-dom';

const Post = (props) => {
  const history = useHistory();
  const params = useParams();
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [readMd, setReadMd] = useState(false);

  const repoContext = useContext(RepoContext);
  const {
    currentRepo,
    getRepo,
    loading,
    addComment,
    isAuthenticated,
    user,
    deleteComment,
    deletePost,
  } = repoContext;

  useEffect(() => {
    // console.log(props);
    // console.log(props.match.params);
    // console.log(params);
    getRepo(params.repo_id);
    // eslint-disable-next-line
  }, []);

  const onClick = (e) => {
    setReadMd(!readMd);
  };

  const onClickDelete = (e, comment) => {
    deleteComment(comment);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isAuthenticated === false) {
      setError('Login required');
      setTimeout(() => {
        history.push('/login');
      }, 1350);
    }
    addComment(comment, props.match.params.repo_id);
    setComment('');
  };

  const removePost = async (e, id) => {
    // console.log(e.target);
    // console.log(id);
    const res = await deletePost(id);
    if (res === 0) {
      history.push('/');
    }
  };

  const onChange = (e) => {
    setComment(e.target.value);
  };

  // console.log(currentRepo);
  // console.log(user);
  return (
    <Fragment>
      <div className='showcase-inner' id='showcase'>
        <div className='showcase-inner-content'>
          {loading ? (
            <h2>Repo Post</h2>
          ) : (
            <h2>Post - {currentRepo && currentRepo.post.repo.titleRepoPost}</h2>
          )}
        </div>
      </div>
      <div className='container'>
        {loading ? (
          <Preloader />
        ) : (
          <div className='post-repo'>
            <div className='content'>
              {currentRepo && (
                <Fragment>
                  <div className='by-user-delete'>
                    <h2>Post by - {currentRepo.post.repo.user}</h2>
                    {currentRepo.post.repo.user === user ? (
                      <button
                        className='btn-danger'
                        onClick={(e) => removePost(e, currentRepo.post.repo.id)}
                      >
                        {' '}
                        <i className='fas fa-trash-alt'></i> Delete
                      </button>
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <h3>{currentRepo.post.repo.titleRepoPost}</h3>
                  <p>{currentRepo.post.repo.descriptionRepoPost}</p>
                  <div className='url'>
                    <h5>Github - {currentRepo.post.repo.identityInGithub}</h5>
                    <a
                      href={currentRepo.post.repo.identityInGithub}
                      target='__blank'
                    >
                      <i className='fab fa-github'></i>
                      {' '}Github
                    </a>
                  </div>
                </Fragment>
              )}
            </div>
            <div className='line'></div>
            <div className='github-about'>
              {currentRepo && (
                <Fragment>
                  <h2>About this repo in Github</h2>
                  <h3>
                    name: <span>{currentRepo.repoGithub.name}</span>
                  </h3>
                  <h3>
                    description:{' '}
                    <span>{currentRepo.repoGithub.description}</span>
                  </h3>
                  <div className='owner'>
                    <h3>
                      owner: <span>{currentRepo.repoGithub.owner.login}</span>
                    </h3>
                    <a href={currentRepo.repoGithub.owner.html_url}>
                      owner{'  '}
                      <i
                        style={{ marginTop: '0.2rem' }}
                        className='fas fa-arrow-right'
                      ></i>
                    </a>
                  </div>
                  <h3>
                    Created: <span>{currentRepo.repoGithub.created_at}</span>
                  </h3>
                  <h3>
                    Updated: <span>{currentRepo.repoGithub.updated_at}</span>
                  </h3>
                  <div className='misc-info'>
                    <h4>
                      {' '}
                      <i className='far fa-star'></i>{' '}
                      {currentRepo.repoGithub.stargazers_count}
                    </h4>
                    <h4>
                      <i className='far fa-eye'></i>
                      {currentRepo.repoGithub.watchers_count}
                    </h4>

                    <h4>
                      <i className='fas fa-terminal'></i>
                      {currentRepo.repoGithub.language}
                    </h4>
                  </div>
                </Fragment>
              )}
            </div>
            <h2 style={{ textAlign: 'center', paddingBottom: '1rem' }}>
              Readme Content
            </h2>
            <div className='markdown'>
              <button onClick={(e) => onClick(e)}>Readme</button>
              {readMd ? (
                <ReactMarkdown
                  source={currentRepo.markdown}
                  escapeHtml={false}
                  // https://github.com/rexxars/react-markdown (allowNode) that took me a while
                  allowNode={(node) => {
                    // console.log(node);
                    if (node.type === 'image') {
                      // avoid not found images (direct element)
                      if (node.url.substring(0, 5) !== 'http') return false;
                      else return true;
                    } else {
                      if (!node.children) {
                        // avoid not found images when image is not a child of an element, but inside HTML node
                        if (typeof node.value === String) {
                          if (
                            node.value.indexOf('<img') > -1 &&
                            node.value.indexOf('http') < 0
                          ) {
                            return false;
                          } else {
                            return true;
                          }
                        } else {
                          return true;
                        }
                      } else {
                        // avoid not found images when image is a child of an element
                        if (node.children.length > 0) {
                          let isFound = 0;
                          node.children.forEach((item) => {
                            if (typeof item.value === 'string') {
                              // string allow indexOf
                              if (
                                item.value.indexOf('<img') > -1 &&
                                item.value.indexOf('http') < 0
                              ) {
                                isFound = 1;
                              }
                            }
                          });
                          if (isFound) {
                            return false;
                          } else {
                            return true;
                          }
                        } else {
                          return true;
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div></div>
              )}
            </div>
            <div className='comments'>
              <h2 style={{ marginBottom: '1.5rem' }}>Comments</h2>
              <div className='comments-box'>
                <form onSubmit={(e) => onSubmit(e)}>
                  {error !== null && (
                    <div
                      className='alert-danger'
                      style={{ marginBottom: '0.5rem' }}
                    >
                      {error}
                    </div>
                  )}
                  <textarea
                    name='comment'
                    placeholder='Place your comment here'
                    value={comment}
                    onChange={(e) => onChange(e)}
                    cols='30'
                    rows='10'
                    required
                  ></textarea>
                  <input type='submit' value='Comment' />
                </form>
                <div className='all-comments'>
                  {currentRepo &&
                    currentRepo.post.comments.map((comment, id) => (
                      <div className='comment-item' key={id}>
                        <div>
                          <h3>{comment.user}:</h3>
                          {comment.user === user ? (
                            <button
                              onClick={(e) => onClickDelete(e, comment)}
                              className='btn-danger'
                            >
                              Delete comment
                            </button>
                          ) : (
                            ''
                          )}
                        </div>
                        <p>{comment.comment}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Post;
