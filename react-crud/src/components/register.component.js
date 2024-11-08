import React, { Component } from "react";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { isEmail } from "validator";
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

const email = value => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      loading: false,
      message: ""
    };
  }

  handleRegister = e => {
    e.preventDefault();
    
    this.setState({ loading: true, message: "" });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      authService.register(this.props.username, this.props.email, this.props.password)
      .then((response) => {
        setToken(response.accessToken);
        navigate(`/exercises`);

        }
      )
    } else {
      this.setState({
        loading: false,
        message: "Form validation failed"
      });
    }
  };

  render() {
    return (
      <div className="register-form">
        <Form
          onSubmit={this.handleRegister}
          ref={c => {
            this.form = c;
          }}
        >
          <div>
            <Input
              type="text"
              name="username"
              className="form-control"
              value={this.state.username}
              onChange={e => this.setState({ username: e.target.value })}
              validations={[required]}
            />
          </div>

          <div>
            <Input
              type="text"
              name="email"
              className="form-control"
              value={this.state.email}
              onChange={e => this.setState({ email: e.target.value })}
              validations={[required, email]}
            />
          </div>

          <div>
            <Input
              type="password"
              name="password"
              className="form-control"
              value={this.state.password}
              onChange={e => this.setState({ password: e.target.value })}
              validations={[required]}
            />
          </div>

          <div>
            <button disabled={this.state.loading}>
              {this.state.loading ? "Registering..." : "Register"}
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
          <div className="alert alert-danger" role="alert">
            {this.state.message}
          </div>
        )}
      </div>
    );
  }
}

export default Register;
