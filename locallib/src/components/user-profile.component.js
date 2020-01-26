import React, {Component} from 'react';
import axios from 'axios';

export default class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        axios.get('http://localhost:5000/user/5e298ecb1c9d440000443cfa')
            .then(response => {
                console.log(response.data);
            }).catch((error) => {
            console.log(error);
        })
    }


    render() {
        return (
            <div>
                <p>You are on the User List!</p>
            </div>
        )
    }
}