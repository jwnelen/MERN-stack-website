import React, {Component} from 'react';
import axios from 'axios';
import Moment from 'react-moment';

export default class BookList extends Component {
    constructor(props) {
        super(props);

        this.state = {events: []};

    }

    componentDidMount() {
        axios.get('http://localhost:5000/events')
            .then(response => {
                console.log(response.data);
                this.setState({events: response.data});
            }).catch((error) => {
            console.log(error);
        })
    }

    handleClick(e) {
        e.preventDefault();
        console.log('Link was clicked');
    }

    eventList() {
        return (
            <table className="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Location</th>
                    <th>Amount of Participants</th>
                </tr>
                </thead>
                <tbody>
                {
                    this.state.events.map((currentEvent) =>
                        <React.Fragment key={currentEvent._id}>
                            <tr>
                                <td>{currentEvent.name}</td>
                                <td><Moment format="YYYY/MM/DD, HH:MM">
                                    {currentEvent.start_date}
                                </Moment></td>
                                <td><Moment format="YYYY/MM/DD, HH:mm">
                                    {currentEvent.end_date}
                                </Moment></td>
                                <td>{currentEvent.location}</td>
                                <td>{currentEvent.sign_ups.length}</td>
                                <td><a className={'button'} onClick={this.handleClick} href="#">Register</a></td>
                            </tr>
                        </React.Fragment>
                    )}
                </tbody>
            </table>
        )
    }


    render() {
        return (
            <div>
                {this.eventList()}
            </div>
        )
    }
}