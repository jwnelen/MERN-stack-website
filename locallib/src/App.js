import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/navbar.component"
import ExercisesList from "./components/exercises-list.component";

function App() {
    return (
        <Router>
            <div className="container">
                <Navbar/>
                <br/>
                <Route path="/" exact component={ExercisesList}/>
            </div>
        </Router>
    );
}

export default App;