# Github Network

## A social network to share repositories

In this network you can create and comments posts, as well as delete them. Those posts are based in your repo in github or repo of someone else which you would like to share with people registered.

![GithubNetwork](https://github.com/NietoCurcio/CS50Web-Python-Javascript/blob/master/readme/image1.png?raw=true)

## Project structure

### Server side (back-end)

My Django project have one app called githubNetwork, in that app are all django files, like urls, models and views to give JSON response when a route is requested on the server. The server is a REST API, then the server only returns the data which the client needs and not HTML content, pages or templates.

### Client side (front-end)

There is a folder called client, in that directory there is a React app, inside src has components, config files (get csrf cookie, as Django uses, and secret token), also has Context (app state) files and css files

Packages and dependencies in client side:

- react
- react-router-dom
- react-markdown
- axios

## About satisfy requirements

The project follows the RESTful API structure

The Server side is a REST API, then all the UI is built in Client side, it means the server side doesn't return render() method, to load some template, in any view, because only return JSON response to the request.

Beyond User model, the database have Comments and Repos table.

The Client side is a complete React App and have your routes as well, with react router DOM package. The client has access to the whole state using the useContext hook to wrap the entire application with the state and there are actions and reducers to change the application state.
Besides client side make requests to the Django server, based in that data that the client fetched it makes requests to the third API of Github, (to do that is necessary pass a token in the request) based in the Github's data we get the markdown content of that repo and convert it with React Markdown.
[Github API - Authentication](https://developer.github.com/v3/#authentication)

The application is mobile Responsive.

| <img src="https://github.com/NietoCurcio/CS50Web-Python-Javascript/blob/master/readme/image3mobile.png?raw=true" height="200"> | <img src="https://github.com/NietoCurcio/CS50Web-Python-Javascript/blob/master/readme/image4.png?raw=true" height="200">
