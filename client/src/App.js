import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RepoState from './context/repo/RepoState';
import Post from './components/Post';
import Login from './components/Login';
import Register from './components/Register';
import CreatePost from './components/CreatePost';
import Logout from './components/Logout';
import Repos from './components/Repos';
import './App.css';
import './Media.css';
import Footer from './components/Footer';

function App() {
  // IGNORE THIS COMMENTS, this is only test, but I'd like to leave this here because everything started here :)
  // const [rawMark, setRawMark] = useState('');

  // useEffect(() => {
  //   // getRepos();
  //   console.log(config.githubToken);
  //   async function fetch() {
  //     const uri = `https://api.github.com/users/${'NietoCurcio'}/repos`;
  //     const headers = {
  //       Authorization: `token ${config.githubToken}`,
  //     };
  //     const res = await axios.get(uri, { headers });
  //     console.log('felipe');
  //     console.log(res.data);

  //     const uriTwo = `https://api.github.com/markdown`;
  //     const resTwo = await axios.post(uriTwo, {
  //       text: 'Hello world github/linguist#1 **cool**, and #1!',
  //       mode: 'markdown',
  //       context: 'github/gollum',
  //     });
  //     console.log(resTwo.data);

  //     const uriThree = `https://raw.githubusercontent.com/NietoCurcio/CS50-Final-Project/master/README.md`;

  //     const headersTwo = {
  //       'Content-Type': 'text/plain',
  //     };

  //     const resThree = await axios.get(uriThree, { headersTwo });
  //     console.log('GETTING MARDOWN');
  //     console.log(resThree.data);
  //     setRawMark(resThree.data);
  //   }
  // }, []);

  return (
    <RepoState>
      <BrowserRouter>
        <div className='App'>
          <Navbar />
          <Switch>
            <Route exact path='/' component={Repos} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/create' component={CreatePost} />
            <Route exact path='/repo/:repo_id' component={Post} />
            <Route exact path='/logout' component={Logout} />
            <Route exact path='/register' component={Register} />
          </Switch>
          <Footer />
          {/* comments below were just tests */}
          {/* <h1>Hello world</h1>
          <h2>Raw markdown -</h2>
          <div>{rawMark}</div>
          <h2>React markdown with raw</h2>
          <ReactMarkdown source={rawMark} /> */}
        </div>
      </BrowserRouter>
    </RepoState>
  );
}

export default App;
