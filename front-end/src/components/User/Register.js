import React, { Component } from 'react';
import axios from 'axios';


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
        this.handleInputChange = this.handleInputChange.bind(this);
      }

    handleInputChange(e) {
        const val = e.target.value;
        const fieldName = e.target.name;

        this.setState({[fieldName]: val});
    }

    submit(e) {
        var url = 'http://ec2-54-87-191-69.compute-1.amazonaws.com:5000/user/register/';

        var data = {
            'name': this.state.name,
            'email': this.state.email,
            'password': this.state.password,
            'age': this.state.age,
            'genre': this.state.genre
        }

        axios.post(url, data)
        .then(res => {
            window.location = "/login";
        })
        .catch(err => {
            this.setState({error: String(err)});
        });

        e.preventDefault();
    }

    render() {
        return (
            <div>
                <h3>{this.state.error}</h3>
                <form onSubmit={this.submit}>
                    <div>
                        <label>Name</label>
                        <input type="text" placeholder="Jane Doe" name="name" value={this.state.name}
                            onChange={this.handleInputChange} />
                    </div>

                    <div>
                        <label>Email</label>
                        <input type="email" placeholder="myemail@example.com" name="email" value={this.state.email}
                            onChange={this.handleInputChange} />
                    </div>

                    <div>
                        <label>Age</label>
                        <input type="number" placeholder="18" name="age" value={this.state.age}
                            onChange={this.handleInputChange}  />
                    </div>

                    <div>
                        <label>Password</label>
                        <input type="password" name="password" value={this.state.password}
                            onChange={this.handleInputChange} />
                    </div>

                    <div>
                        <label>Favorite Genre</label>
                        <input type="text" placeholder="Horror" name="genre" value={this.state.genre}
                            onChange={this.handleInputChange} />
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
