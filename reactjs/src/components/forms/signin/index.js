import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import GoogleLogin from 'react-google-login';
import API from '../../../API';
import FormErrors from '../../../formErrors';
// import '../../../css/main.css';
import styles from './styles.module.css';
import container from './container';

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      formErrors: { username: '', password: '' },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.loadData();
    this.responseSuccessGoogle();
  }

  componentDidMount() {
    window.scrollTo({
      top: 0,
    });

    const { fetchLoginUser } = this.props;
    fetchLoginUser();
  }

  handleInputChange = (event) => {
    // pull the name of the input and value of input out of the even object
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  responseSuccessGoogle = (response) => {
    const { history } = this.props;

    if (response) {
      API.post('/auth/googleLogin', {
        tokenId: response.tokenObj.id_token,
        email: response.profileObj.email,
      })
        .then((res) => {
          const resData = JSON.stringify(res.data)
            .substring(16)
            .replace(/["/{/}/]/gi, '')
            .replace(/,/gi, '\n')
            .replace(/:/gi, ': ')
            .replace(/timestamp/gi, 'Timestamp')
            .replace(/base/gi, 'Base')
            .replace(/date/gi, 'Date')
            .replace(/rates:/gi, 'Rates:\n');

          localStorage.setItem('token', res.token);
          localStorage.setItem('id', res.id);
          localStorage.setItem('data', resData);
          // console.log('Response Profile: ', response.tokenObj.id_token);
          // console.log('Response: ', response.profileObj.email);
          // console.log('Response: ', res.id);
        }).then(() => {
          const token = localStorage.getItem('token');
          const userId = localStorage.getItem('id');

          if (token === 'undefined' || userId === 'undefined'
            || token === '' || userId === '') {
            history.push('/signup');
          } else {
            history.push('/');
          }
        });
    }
  };

  loadData = async () => {
    const {
      match: {
        params: { id },
      },
      fetchLoginUser,
    } = this.props;
    // if no id don't load the user
    if (!id) return;
    await fetchLoginUser(id);
    // update the state with the data from the updated user
    const { users } = this.props;
    this.setState({ ...users });
  };

  submitHandler = (event) => {
    // make sure the form doesn't submit with the browser
    event.preventDefault();
    const {
      loginUser,
      history,
    } = this.props;
    const {
      username, password,
    } = this.state;
    const validToken = localStorage.getItem('token');

    const currentUsernameValid = username.length >= 2;
    const currentPasswordValid = password.length >= 8;
    const currentToken = validToken;

    if (currentUsernameValid && currentPasswordValid) {
      this.setState({ formErrors: {} });
      loginUser({
        username,
        password,
      }).then(() => {
        if (currentToken) {
          history.push('/');
        } else if (!currentToken) {
          this.setState({
            formErrors: {
              validToken: 'Incorrect username and/or password',
            },
          });
        }
      });
    } else if (username.length < 2 || '' || password.length < 8 || '') {
      this.setState({
        formErrors: {
          username: currentUsernameValid ? '' : 'Username is required',
          password: currentPasswordValid ? '' : 'Password is too short',
        },
      });
    }
  };

  render() {
    const {
      users: {
        username: defaultUsername = '',
        password: defaultPassword = '',
      },
      user,
    } = this.props;

    const {
      username = defaultUsername,
      password = defaultPassword,
      formErrors,
    } = this.state;

    if (user.data) return <Redirect to="/" />;

    return (
      <React.Fragment>
        <main id="signin" className={styles.signupMain}>
          <section className={styles.wrapper}>
            <h1>
              Signin
              <div className={styles.graphic} alt="Small burgandy, rectangle graphic." />
            </h1>

            <form method="POST" onSubmit={this.submitHandler}>
              <FormErrors formErrors={formErrors} />

              <fieldset>
                <GoogleLogin
                  className={styles.googleBTN}
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                  buttonText="Login in with Google"
                  onSuccess={this.responseSuccessGoogle}
                  cookiePolicy="single_host_origin"
                />

                <section className={styles.orSec}>
                  <hr />
                  <span>or</span>
                  <hr />
                </section>

                <label htmlFor="username">
                  Username

                  <input
                    id="username"
                    className={styles.inputBorder}
                    type="text"
                    name="username"
                    value={username}
                    onChange={this.handleInputChange}
                  />
                </label>

                <label htmlFor="password">
                  Password

                  <input
                    id="password"
                    className={styles.inputBorder}
                    type="password"
                    name="password"
                    value={password}
                    onChange={this.handleInputChange}
                  />
                </label>
              </fieldset>

              <input
                id="submitQ1"
                className={styles.submit}
                type="submit"
                value="Submit"
              />

              <section>
                <p>
                  <Link to="/signup">Need an Account?</Link>
                </p>
                <p>&nbsp;|&nbsp;</p>
                <p>
                  <Link to="/forms/emailpasswordreset">Forgot Password</Link>
                </p>
              </section>
            </form>
          </section>

          <figure className={styles.signBCK} />
        </main>
      </React.Fragment>
    );
  }
}

Signin.propTypes = {
  users: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string,
  }),
  user: PropTypes.shape({
    data: PropTypes.shape({
      id: PropTypes.string,
    }),
    // isLoading: PropTypes.bool.isRequired
  }).isRequired,
  fetchLoginUser: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  history: RRPropTypes.history.isRequired,
  match: RRPropTypes.match.isRequired,
};

Signin.defaultProps = {
  users: {},
};

export default container(Signin);
