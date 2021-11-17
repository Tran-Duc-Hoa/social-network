import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import './App.css';

const App = () => (
    <Router>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <Switch>
            <section className="container">
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
            </section>
        </Switch>
    </Router>
);
export default App;
