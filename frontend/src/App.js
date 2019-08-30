import React, { useReducer } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom';

// import { Nav, Navbar } from 'react-bootstrap';
import Context from './context';

import Home from './components/Home';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Application from './components/Application';
import CompanyDetails from './components/CompanyDetails';
import Listing from './components/Listing';
// import Apartments from './components/Apartments';
// import Admin from './components/Admin';

import { getCurrentUser } from './utils';
// import { signout } from './actions';


const App = () => {
  const [user, updateUser] = useReducer(getCurrentUser, getCurrentUser());

  return (
    <Context.Auth.Provider value={{ user, updateUser }}>
      <Router>
        <Route path="/" component={Header} />

        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <Route path="/home" component={Home} />
        <Route path="/login" render={() => user ? <Redirect to="/" /> : <Login />} />
        <Route path="/register" component={() => user ? <Redirect to="/" /> : <Register />} />
        <Route path="/application" render={() => user && user.role === 'candidate' ? <Application />: <Redirect to="/login" />} />
        <Route path="/company-details" render={() => user && user.role === 'employer' ? <CompanyDetails />: <Redirect to="/login" />} />
        <Route path="/jobs" component={Listing} />

      </Router>
    </Context.Auth.Provider>
  );
};

export default App;
