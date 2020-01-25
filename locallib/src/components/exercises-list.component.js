import React, {Component} from 'react';
import axios from 'axios';

export default class ExercisesList extends Component {
    componentDidMount() {
        axios.get('http://localhost:5000/events')
            .then(response => {
                console.log(response.data[0]);
            }).catch((error) => {
            console.log(error);
        })
    }


    render() {
        return (
            <div>
                <p>You are on the Exercises List component!</p>
            </div>
        )
    }
}