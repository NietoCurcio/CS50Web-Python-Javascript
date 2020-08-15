import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RepoContext from '../context/repo/repoContext';

const Login = (props) => {
  const repoContext = useContext(RepoContext);
  const { register, isAuthenticated, error, removeErrorAlert } = repoContext;

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
  });

  useEffect(() => {
    if (isAuthenticated === true) {
      setForm({ username: '', email: '', password: '', confirm: '' });
      props.history.push('/');
    }
  }, [isAuthenticated, props.history]);

  function submitHandler(e) {
    e.preventDefault();

    register(form);
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
      <div className='auth-form register-form'>
        <div className='background-auth'>
          {error !== null && <div className='alert-danger'>{error}</div>}
          <h1>Register</h1>
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
                type='email'
                name='email'
                id='email'
                className='form-control'
                placeholder='Email Address'
                value={form.email}
                onChange={(e) => onChange(e)}
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
            <div className='form-box'>
              <input
                type='password'
                name='confirm'
                id='confirm'
                className='form-control'
                placeholder='Confirm Password'
                value={form.confirm}
                onChange={(e) => onChange(e)}
              />
            </div>
            <input type='submit' value='Register' />
          </form>
          <div className='paragraph-box'>
            <p>
              Already have an account?{' '}
              <Link className='link-to' to='/login'>
                Login
              </Link>{' '}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
