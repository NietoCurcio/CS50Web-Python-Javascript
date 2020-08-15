import React, { useReducer } from 'react';
// useReducer to dispatch to our reducer
import RepoContext from './repoContext';
import repoReducer from './repoReducer';
// import api from '../../config/api';
import axios from 'axios';
import config from '../../config/default.json';
import getCookie from '../../config/getCookie';
import {
  FETCH_REPOS,
  CREATE,
  REGISTER,
  REGISTER_FAIL,
  GET_CURRENT_REPO,
  COMMENT_ADD,
  COMMENT_DELETE,
  CREATE_FAIL,
  LOADING,
  DELETE_POST,
  DELETE_ERROR,
  AUTHENTICATE,
  LOGIN,
  LOGOUT,
  LOGIN_FAIL,
  FETCH_REPOS_FAIL,
  REMOVE_ERROR,
} from '../types';

const RepoState = (props) => {
  const initalState = {
    user: null,
    isAuthenticated: false,
    repos: null,
    currentRepo: null,
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(repoReducer, initalState);

  // Get all repos posts
  const getRepos = async () => {
    try {
      const res = await fetch('/api/repos');
      // console.log('Felipe getRepos');
      // console.log(res.data);
      // const data = res.data;
      const data = await res.json();

      dispatch({ type: FETCH_REPOS, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: FETCH_REPOS_FAIL });
      // dispatch({ type: FETCH_REPOS_FAIL, payload: error.response });
    }
  };

  const createPost = async (form) => {
    dispatch({ type: LOADING });
    try {
      const csrf = getCookie('csrftoken');
      const response = await fetch('/api/newRepo/', {
        method: 'POST',
        headers: { 'X-CSRFToken': csrf, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: form,
        }),
      });
      // console.log('EU CHEGUEI AQUI?');
      // console.log(response);
      const res = await response.json();
      // console.log(res);
      if (res.error) {
        dispatch({ type: CREATE_FAIL, payload: res.error });
      } else {
        dispatch({ type: CREATE });
        // like in C, everything ok return 0
        return 0;
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: CREATE_FAIL, payload: 'Failed to create a post' });
    }
  };

  const getRepo = async (repo_id) => {
    dispatch({ type: LOADING });
    const response = await fetch(`/api/repo/${repo_id}`);
    const res = await response.json();
    // res.repo.identityInGithub = https://github.com/NietoCurcio/CS50-Final-Project
    // https://api.github.com/repos/NietoCurcio/ContactKeeper-react-bradTraversy api
    let slash = 0;
    let inital = 0;
    let final = 0;
    for (let i = 16; i < res.repo.identityInGithub.length; i++) {
      // 16 because https://github.com/ or http://github.com/
      if (res.repo.identityInGithub[i] === '/' && slash === 0) {
        inital = i + 1;
        slash++;
      } else if (res.repo.identityInGithub[i] === '/' && slash === 1) {
        final = i;
        slash++;
      }
      if (slash === 2) {
        break;
      }
    }
    const username = res.repo.identityInGithub.substring(inital, final);
    final++;
    let length = res.repo.identityInGithub.length;
    const repoName = res.repo.identityInGithub.substring(final, length);
    // I know that is a C like way of do the things, but I like it
    // thank you cs50 in C projects, like tideman

    const responseGithub = await fetch(
      `https://api.github.com/repos/${username}/${repoName}`,
      {
        headers: { Authorization: `token ${config.githubToken}` },
      }
    );
    const data = await responseGithub.json();

    // I don't know why, but when I try get data with 'fetch' I receive that error:
    // "has been blocked by CORS policy"
    // my tests in app.js comments works with axios
    const markRes = await axios.get(
      `https://raw.githubusercontent.com/${username}/${repoName}/${data.default_branch}/README.md`,
      {
        'Content-type': 'text/plain',
        Authorization: `token ${config.githubToken}`,
      }
    );
    // console.log(markRes.data);
    // console.log(data);
    const payload = {
      repoGithub: data,
      post: res,
      markdown: markRes.data,
    };
    // console.log(payload);
    dispatch({ type: GET_CURRENT_REPO, payload: payload });
  };

  const addComment = async (comment, repo_id) => {
    const response = await fetch(`/api/comment/${repo_id}`, {
      // remember in project 4 that adding the /api solve the problem?
      method: 'POST',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
        'Content-type': 'application/json',
      },
      // Unsupported media type error = pass Content-type
      body: JSON.stringify({
        comment: comment,
      }),
    });
    const result = await response.json();
    // console.log(result);
    if (!result.error) {
      // console.log(result.comment);
      dispatch({ type: COMMENT_ADD, payload: result.comment });
    }
  };

  const deletePost = async (post_id) => {
    const res = await fetch(`/api/deleteRepo/${post_id}`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
    });
    const results = await res.json();
    // console.log(res);
    // console.log(results);

    // already will leave the state in home, because we fetch from our api
    // so is not needed .filter in our state, like in delete comments

    if (!results.error) {
      dispatch({ type: DELETE_POST, payload: post_id });
      return 0;
    } else {
      dispatch({ type: DELETE_ERROR });
    }
  };

  const deleteComment = async (comment) => {
    // comment.comment comment.user comment.repo
    const response = await fetch('/api/comment/delete', {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: comment,
      }),
    });
    const res = await response.json();
    console.log(res);
    if (res.message === 'Comment deleted') {
      console.log(res.comment);
      console.log(res.comment.id);
      dispatch({ type: COMMENT_DELETE, payload: res.comment.id });
    }
  };

  const login = async (form) => {
    try {
      const csrf = getCookie('csrftoken');
      // console.log(csrf);
      const response = await fetch('/api/login/', {
        // the proxy in package.json allow to do it, and not 'http://localhost:8000/api/login/' instead
        method: 'POST',
        headers: { 'X-CSRFToken': csrf },
        // (CSRF token missing or incorrect.) like in project 4, we need that to access views and send form
        credentials: 'include',
        // forbidden (CSRF cookie not set.), relationed with settyngs.py
        body: JSON.stringify({
          data: form,
        }),
      });
      // console.log(response);
      const res = await response.json();
      // console.log(res);
      if (res.error === 'Invalid credentials') {
        dispatch({ type: LOGIN_FAIL, payload: res.error });
      } else {
        dispatch({ type: LOGIN, payload: res.user });
      }
    } catch (error) {
      console.log('inside catch');
      console.log(error);
      dispatch({ type: LOGIN_FAIL, payload: error.response });
    }
  };

  const register = async (form) => {
    try {
      const csrf = getCookie('csrftoken');
      const response = await fetch('/api/register/', {
        method: 'POST',
        // unssported media type, change to Content-Type applciation json
        headers: { 'X-CSRFToken': csrf, 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          data: form,
        }),
      });
      const res = await response.json();

      if (res.error) {
        dispatch({ type: REGISTER_FAIL, payload: res.error });
      } else {
        dispatch({ type: REGISTER, payload: res.user });
      }
    } catch (error) {
      console.log('inside catch');
      console.log(error);
      dispatch({ type: LOGIN_FAIL, payload: error.response });
    }
  };

  const authenticate = async () => {
    const res = await fetch('/api/isAuthenticated');
    const result = await res.json();
    // console.log(result);
    if (result.message === 'Authenticated') {
      dispatch({ type: AUTHENTICATE, payload: result.user });
    } else {
      dispatch({ type: LOGOUT });
    }
  };

  const logoutUser = async () => {
    try {
      const response = await fetch('/api/logout');
      const res = await response.json();
      if (res.message === 'Logout') {
        dispatch({ type: LOGOUT });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeErrorAlert = () => {
    dispatch({ type: REMOVE_ERROR });
  };

  const setLoading = () => {
    dispatch({ type: LOADING });
  };

  return (
    // return the provider to wrap the entire app in this context
    <RepoContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        repos: state.repos,
        currentRepo: state.currentRepo,
        loading: state.loading,
        error: state.error,
        // pass our actions to our app as well
        getRepos,
        login,
        register,
        authenticate,
        logoutUser,
        createPost,
        getRepo,
        addComment,
        deleteComment,
        deletePost,
        removeErrorAlert,
        setLoading,
      }}
    >
      {/* two brackets because is a object, look this comment wrapepd in a bracket */}
      {props.children}
      {/* pass props.chidren to entire app, because the provider wraps the entire app */}
    </RepoContext.Provider>
  );
};

export default RepoState;
