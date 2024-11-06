import React, { Component } from "react";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { isEmail } from "validator";

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
      // handle successful login
    } else {
      this.setState({
        loading: false,
        message: "Invalid credentials"
      });
    }
  };

  render() {
    return (
      <div className="login-form">
        <Form
          onSubmit={this.handleLogin}
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
          <div className="alert alert-danger" role="alert">
            {this.state.message}
          </div>
        )}
      </div>
    );
  }
}

export default Login;
