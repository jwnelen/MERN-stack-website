import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/navbar.component"
import BookList from "./components/book-list.component";
import EventsList from "./components/events-list.component";
import LoginPage from "./components/login-page.component";
import RegisterPage from "./components/register-page.component";
import UserProfile from "./components/user-profile.component";

function App() {
    return (
        <Router>
            <div className="container">
                <Navbar/>
                <br/>
                <Route path="/catalog/books" exact component={BookList}/>
                <Route path="/events" exact component={EventsList}/>
                <Route path="/login" exact component={LoginPage}/>
                <Route path="/register" exact component={RegisterPage}/>
                <Route path="/user/profile" exact component={UserProfile}/>
            </div>
        </Router>
    );
}

export default App;