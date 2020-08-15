import React, { useState, useContext, useEffect } from 'react';
import RepoContext from '../context/repo/repoContext';

const CreatePost = ({ history }) => {
  const repoContext = useContext(RepoContext);
  const { createPost, isAuthenticated, error, removeErrorAlert } = repoContext;

  const [form, setForm] = useState({
    title: '',
    description: '',
    githubURL: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login');
    }
  }, [isAuthenticated, history]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function submitHandler(e) {
    e.preventDefault();
    // setLoading();
    const response = await createPost(form);
    // console.log(response);
    if (response === 0) {
      setForm({ title: '', description: '', githubURL: '' });
      history.push('/');
    }
    // the error is null, until we get a response, that is wrong and not works
    // if (!error === 'Login required' || !error === 'Failed to create a post') {
    //   history.push('/');
    // } else {
    //   setAlertError(error);

    //   setTimeout(() => {
    //     setAlertError(null);
    //   }, 5000);
    // }
  }

  if (error !== null) {
    setTimeout(() => {
      removeErrorAlert();
    }, 3000);
  }

  return (
    <div className='showcase-auth' id='showcase'>
      <div className='post-form'>
        <div className='create-post-background'>
          {error !== null && <div className='alert-danger'>{error}</div>}
          <h1 style={{ margin: '1rem 1.5rem' }}>
            Create a post about your repo
          </h1>
          <form onSubmit={(e) => submitHandler(e)}>
            <div className='form-box'>
              <input
                type='text'
                name='title'
                placeholder='Title'
                className='form-control'
                value={form.title}
                onChange={(e) => onChange(e)}
                autoFocus
              />
            </div>
            <div className='form-box'>
              <textarea
                type='text'
                name='description'
                placeholder='Description'
                className='form-control'
                value={form.description}
                onChange={(e) => onChange(e)}
              />
            </div>
            <div className='form-box-url'>
              <input
                type='text'
                name='githubURL'
                id='githubURL'
                placeholder='Github URL of Repo'
                className='form-control'
                value={form.githubURL}
                onChange={(e) => onChange(e)}
              />
              <label htmlFor='githubURL'>
                e.g: https://github.com/username/repo
              </label>
            </div>
            <input type='submit' value='Create' />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
