import React, { Component } from "react";
import "../assets/css/auth.css";
import { toastActions, authActions, helmetActions } from "../actions";
import Loader from "react-loader-spinner";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { store } from "../store";
import { musicIllustration, masterLogo } from "../assets/images";
import queryString from 'query-string';

class Auth extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      displayRegister: false,
      queuePath: ''
    };
    this.Toggler = this.Toggler.bind(this);
    this.Login = this.Login.bind(this);
    this.Register = this.Register.bind(this);
  }

  async componentDidMount() {
    this._isMounted = true;
    helmetActions.updateHelment({
      title: (this.state.displayRegister ? "Register" : "Login") + " - OpenBeats"
    })
    if (this.props.isAuthenticated) {
      store.dispatch(push("/"))
    }
    const queryValues = await queryString.parse(this.props.location.search)
    if (queryValues.queue) {
      /* eslint-disable-next-line */
      this.setState({ queuePath: Base64.decode(queryValues.queue) })
    }

  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate() {
    helmetActions.updateHelment({
      title: (this.state.displayRegister ? "Register" : "Login") + " - OpenBeats"
    })
  }

  Login() {
    return (
      <form
        className={`login-holder ${
          this.state.displayRegister ? "hide-me" : ""
          }`}
        onSubmit={e => {
          e.preventDefault();
          let element = e.target.elements;
          this.props.loginHandler(element.email.value, element.password.value, this.state.queuePath);
        }}
      >
        <img className="responsive-master-logo" src={masterLogo} alt="" />
        <div className="login-header">Login</div>
        <div className="native-login-input">
          <input required placeholder="Email" name="email" type="email" />
        </div>
        <div className="native-login-input mt-4 mb-2">
          <input
            required
            placeholder="Password"
            name="password"
            type="password"
          />
        </div>
        <button type="submit" className="native-login-button cursor-pointer mt-4">
          Login
        </button>
        <div onClick={() => this.props.push("/auth/forgot")} className="forgot-password-holder cursor-pointer">
          Forgot password?
        </div>
        <div className="responsive-link-creator">
          Don't have a OpenBeats Account yet?
        </div>
        <div
          onClick={() =>
            this.setState({
              displayRegister: !this.state.displayRegister
            })
          }
          className="responsive-custom-link cursor-pointer"
        >
          Create One
        </div>
        <div className="mt-2">
          <div onClick={() => this.props.push("/")} className="responsive-custom-link display-block mt-4 cursor-pointer" >Go Back to Home</div>
        </div>
      </form>
    );
  }

  Register() {
    return (
      <form
        className={`register-holder ${
          !this.state.displayRegister ? "hide-me" : ""
          }`}
        onSubmit={e => {
          e.preventDefault();
          let element = e.target.elements;
          if (element.password.value !== element.confirmpassword.value) {
            this.props.notify("Password doesn't match!");
            element.confirmpassword.value = "";
          } else {
            this.props.registerHandler(
              element.name.value,
              element.email.value,
              element.password.value,
              this.state.queuePath
            );
          }
        }}
      >
        <img className="responsive-master-logo" src={masterLogo} alt="" />

        <div className="login-header">Register</div>
        <div className="native-login-input">
          <input required placeholder="Username" type="text" name="name" />
        </div>
        <div className="native-login-input mt-4">
          <input required placeholder="Email" type="email" name="email" />
        </div>
        <div className="native-login-input mt-4">
          <input
            required
            placeholder="Password"
            type="password"
            name="password"
          />
        </div>
        <div className="native-login-input mt-4 mb-2">
          <input
            required
            placeholder="Confirm Password"
            type="password"
            name="confirmpassword"
          />
        </div>
        <button type="submit" className="native-login-button cursor-pointer mt-4">
          Register
        </button>
        <div className="responsive-link-creator">
          Already have a OpenBeats Account?
        </div>
        <div
          onClick={() =>
            this._isMounted && this.setState({
              displayRegister: !this.state.displayRegister
            })
          }
          className="responsive-custom-link cursor-pointer"
        >
          Login
        </div>
        <div className="mt-2">
          <div onClick={() => this.props.push("/")} className="responsive-custom-link display-block mt-4 cursor-pointer" >Go Back to Home</div>
        </div>
      </form>
    );
  }

  Toggler() {
    return (
      <div
        className={`toggle-slider ${
          this.state.displayRegister ? "display-register" : ""
          }`}
      >
        {this.state.displayRegister ? (
          <div className="toggle-content-holder">
            <img
              className="music-master-logo"
              src={masterLogo}
              alt=""
              srcSet=""
            />
            <img
              className="music-illustration"
              src={musicIllustration}
              alt=""
              srcSet=""
            />
            <div className="toggler-content-holder">
              Already have a OpenBeats Account ?
            </div>
            <button
              onClick={() =>
                this._isMounted && this.setState({
                  displayRegister: !this.state.displayRegister
                })
              }
              className="toggler-login-register-button cursor-pointer"
            >
              Login
            </button>
          </div>
        ) : (
            <div className="toggle-content-holder">
              <img
                className="music-master-logo"
                src={masterLogo}
                alt=""
                srcSet=""
              />
              <img
                className="music-illustration"
                src={musicIllustration}
                alt=""
                srcSet=""
              />
              <div className="toggler-content-holder">
                Don't have a OpenBeats Account Yet?
            </div>
              <button
                onClick={() =>
                  this._isMounted && this.setState({
                    displayRegister: !this.state.displayRegister
                  })
                }
                className="toggler-login-register-button cursor-pointer"
              >
                Register
            </button>
            </div>
          )}
      </div>
    );
  }

  render() {
    return (
      <div className="auth-wrapper">
        {this.props.isAuthLoading && (
          <div className="auth-preloader">
            <Loader type="ThreeDots" color="#F32C2C" height={80} width={80} />
          </div>
        )}
        <this.Toggler />
        <this.Register />
        <this.Login />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.authReducer.isAuthenticated,
    isAuthLoading: state.authReducer.isAuthLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    push: path => {
      if (path !== store.getState().router.location.pathname)
        dispatch(push(path));
    },
    notify: message => {
      toastActions.showMessage(message);
    },
    featureNotify: () => {
      toastActions.featureNotify();
    },
    loginHandler: (email, password, queuePath) => {
      authActions.loginHandler(email, password, queuePath);
    },
    registerHandler: (userName, email, password, queuePath) => {
      authActions.registerHandler(userName, email, password, queuePath);
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
