import PropTypes from 'prop-types';
import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import authService from "../services/auth.service";

const required = value => {
    if (!value) {
        return (
        <div className="alert alert-danger" role="alert">
            This field is required!
        </div>
        );
    }
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
        username: "",
        password: "",
        loading: false,
        message: ""
        };
    }

    handleLogin = e => {
        e.preventDefault();
        
        this.setState({ loading: true, message: "" });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            authService.login(this.state.username, this.state.password).then(
                (response) => {
                    this.setState({loading: false});
                    this.props.setToken(response.accessToken);
                    this.props.navigate("/exercises");
                    const tempUser=authService.getCurrentUser();
                    console.log('accesstoken: ', tempUser.accessToken);
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
        
                    this.setState({
                        loading: false,
                        message: resMessage
                    });
                }
            );
        } else {
        this.setState({
            loading: false,
            message: "Invalid credentials"
        });
        }
    };

    render() {
        return (
        <div className="login-form" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Form
            onSubmit={this.handleLogin}
            ref={c => {
                this.form = c;
            }}
            style={{ width: '100%', maxWidth: '450px' }}
            >
            <div style={{ marginBottom: '15px' }}>
                <Input
                type="text"
                name="username"
                className="form-control"
                value={this.state.username}
                onChange={e => this.setState({ username: e.target.value })}
                validations={[required]}
                style={{ width: '100%', maxWidth: '450px' }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <Input
                type="password"
                name="password"
                className="form-control"
                value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })}
                validations={[required]}
                style={{ width: '100%', maxWidth: '450px' }}
                />
            </div>

            <div>
                <button disabled={this.state.loading} style={{ width: '100%', maxWidth: '450px' }}>
                {this.state.loading ? "Logging in..." : "Login"}
                </button>
            </div>

            <CheckButton
                style={{ display: "none" }}
                ref={c => {
                this.checkBtn = c;
                }}
            />
            </Form>

            {this.state.message && (
            <div className="alert alert-danger" role="alert" style={{ width: '100%', maxWidth: '450px', marginTop: '15px' }}>
                {this.state.message}
            </div>
            )}
        </div>
        );
    }
}

const LoginWithNavigate = props => {
    const navigate = useNavigate();
    return <Login {...props} navigate={navigate} />;
};

Login.propTypes = {
    navigate: PropTypes.func.isRequired,
    setToken: PropTypes.func.isRequired,
};

export default LoginWithNavigate;