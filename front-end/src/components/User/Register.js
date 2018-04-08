import React, { Component } from 'react';
import { ApiWrapper } from '../../ApiWrapper';
import GENRES from '../../Genres'
import { OOPS } from '../../Errors'


class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            age: 0,
            genre: '',
            error: ''
        }

        this.submit = this.submit.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
      }

    handleInputChange(e) {
        const val = e.target.value;
        const fieldName = e.target.name;

        this.setState({[fieldName]: val});
    }

    submit(e) {
        var data = {
            'name': this.state.name,
            'email': this.state.email,
            'password': this.state.password,
            'age': this.state.age,
            'genre': this.state.genre
        }

        ApiWrapper().api().post('/user/register/', data)
        .then(res => {
            window.location = "/login";
        })
        .catch(err => {
            this.setState({error: OOPS + err.response.data.error});
        });

        e.preventDefault();
    }

    renderOptions() {
        var opts = []
        for (var genre in GENRES) {
            opts.push(<option value={genre} >{genre}</option>)
        }
        return opts
    }

    render() {
        
        return (
            <div>
                <div>
                      <i>{this.state.error}</i>
                </div>
                <form onSubmit={this.submit}>
                    <div>
                        <label>Name</label>
                        <input type="text" placeholder="Jane Doe" name="name" value={this.state.name}
                            onChange={this.handleInputChange} required/>
                    </div>

                    <div>
                        <label>Email</label>
                        <input type="email" placeholder="myemail@example.com" name="email" value={this.state.email}
                            onChange={this.handleInputChange} required/>
                    </div>

                    <div>
                        <label>Age</label>
                        <input type="number" placeholder="18" name="age" value={this.state.age}
                            onChange={this.handleInputChange} required/>
                    </div>

                    <div>
                        <label>Password</label>
                        <input type="password" name="password" value={this.state.password}
                            onChange={this.handleInputChange} required/>
                    </div>

                    <div>
                        <label>Favorite Genre</label>
                        <select name="genre" value={this.state.genre} onChange={this.handleInputChange} required>
                            <option value="" disabled>Choose your favorite Genre</option>
                            {this.renderOptions()}
                        </select>
                    </div>

                    <div>
                        <input type="submit" value="Register" />
                    </div>
                </form>
            </div>
        );
    }
}


export default Register;
