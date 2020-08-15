import {
  FETCH_REPOS,
  FETCH_REPOS_FAIL,
  CREATE,
  REGISTER,
  REGISTER_FAIL,
  LOADING,
  COMMENT_ADD,
  GET_CURRENT_REPO,
  CREATE_FAIL,
  DELETE_POST,
  DELETE_ERROR,
  LOGIN,
  LOGIN_FAIL,
  LOGOUT,
  AUTHENTICATE,
  COMMENT_DELETE,
  REMOVE_ERROR,
} from '../types';

// I love this Component, Action, Reducer, Store. CARS idea
export default (state, action) => {
  switch (action.type) {
    case FETCH_REPOS:
      return {
        ...state,
        repos: action.payload,
        loading: false,
      };
    case GET_CURRENT_REPO:
      return {
        ...state,
        currentRepo: action.payload,
        loading: false,
      };
    case COMMENT_ADD:
      return {
        ...state,
        currentRepo: {
          ...state.currentRepo,
          post: {
            ...state.currentRepo.post,
            comments: [...state.currentRepo.post.comments, action.payload],
          },
        },
        // that was little hard, the state must imutateble, so we have to spread each 'branch' of the 'tree'
      };
    case DELETE_POST:
      return {
        ...state,
        repos: state.repos.filter((repo) => repo.id !== action.payload),
      };
    case COMMENT_DELETE:
      return {
        ...state,
        currentRepo: {
          ...state.currentRepo,
          post: {
            ...state.currentRepo.post,
            comments: state.currentRepo.post.comments.filter(
              (comment) => comment.id !== action.payload
            ),
          },
        },
      };
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case AUTHENTICATE:
    case REGISTER:
    case LOGIN:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case CREATE:
      return {
        ...state,
        loading: false,
      };
    case CREATE_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case FETCH_REPOS_FAIL:
      return {
        ...state,
        repos: null,
        loading: false,
      };
    case REMOVE_ERROR:
      return {
        ...state,
        error: null,
      };
    case DELETE_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
