import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RepoContext from '../context/repo/repoContext';

const Login = (props) => {
  const repoContext = useContext(RepoContext);
  const { isAuthenticated, error, removeErrorAlert } = repoContext;

  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated === true) {
      props.history.push('/');
    }
  }, [isAuthenticated, props.history]);

  function submitHandler(e) {
    e.preventDefault();

    // console.log(repoContext);
    setForm({ username: '', password: '' });
    repoContext.login(form);
  }

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // console.log(form);
  };

  if (error !== null) {
    setTimeout(() => {
      removeErrorAlert();
    }, 8000);
  }

  return (
    <div className='showcase-auth' id='showcase'>
      <div className='auth-form'>
        <div className='background-auth'>
          {error !== null && <div className='alert-danger'>{error}</div>}
          <h1>Login</h1>
          <form onSubmit={(e) => submitHandler(e)}>
            <div className='form-box'>
              <input
                type='text'
                name='username'
                id='username'
                className='form-control'
                placeholder='Username'
                value={form.username}
                onChange={(e) => onChange(e)}
                autoFocus
              />
            </div>
            <div className='form-box'>
              <input
                type='password'
                name='password'
                id='password'
                className='form-control'
                placeholder='Password'
                value={form.password}
                onChange={(e) => onChange(e)}
              />
            </div>
            <input type='submit' value='Login' />
          </form>
          <div className='paragraph-box'>
            <p>
              Don't have an account yet?{' '}
              <Link className='link-to' to='/register'>
                Register
              </Link>{' '}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
