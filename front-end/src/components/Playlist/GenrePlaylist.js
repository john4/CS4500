import React, { Component } from 'react';
import axios from 'axios';
import Playlist from './Playlist'

class GenrePlaylist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playlist: []
        };
    }

    getResults(response) {
        this.setState({
            playlist: response.results
        })
    }

    componentWillMount() {
        var url = "https://api.themoviedb.org/3/genre/" + this.props.genre_id + "/movies?api_key=020a1282ad51b08df67da919fca9f44e&language=en-US&include_adult=false&sort_by=created_at.asc"
        axios.get(url)
            .then(res => {
                const response = res.data;
                this.getResults(response);
            })
    }

    render() {
        return (
            <div>
                <Playlist playlist={this.state.playlist} />
            </div>
          );
    } 
}
export default GenrePlaylist;