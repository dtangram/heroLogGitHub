import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import FormErrors from '../../../formErrors';
// import '../../../css/main.css';
import styles from './styles.module.css';
import container from './container';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      type: '',
      formErrors: {
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        type: '',
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.loadData();
  }

  componentDidMount() {
    window.scrollTo({
      top: 0,
    });

    const { fetchUser, match: { params: { id } } } = this.props;
    if (id) fetchUser(id);
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  loadData = async () => {
    const {
      match: {
        params: { id },
      },
      fetchUser,
    } = this.props;
    // if no id don't load the user
    if (!id) return;
    await fetchUser(id);
    // update the state with the data from the updated user
    const { signup } = this.props;
    this.setState({ ...signup });
  };

  save = (event) => {
    // make sure the form doesn't submit with the browser
    event.preventDefault();
    const {
      createUser,
      match: {
        params: { id },
      },
      history,
    } = this.props;
    const {
      firstname, lastname, username, email, password, type,
    } = this.state;

    const isValid = this.validateFields();

    if (!id && isValid) {
      createUser({
        firstname, lastname, username, email, password, type,
      }).then(() => {
        if (firstname.length >= 2 && lastname.length >= 2 && username.length >= 2
          && email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
          && password.length >= 8 && type) {
          history.push('/signin');
        }
      });
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  async validateFields(fieldName, value) {
    const {
      firstname,
      lastname,
      username,
      email,
      password,
      type,
    } = this.state;

    const currentFirstnameValid = firstname.length >= 2;
    const currentLastnameValid = lastname.length >= 2;
    const currentUsernameValid = username.length >= 2;
    const currentEmailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    const currentPasswordValid = password.length >= 8;
    const currentTypeValid = type;

    this.setState({
      formErrors: {
        firstname: currentFirstnameValid ? '' : 'First name is required',
        lastname: currentLastnameValid ? '' : 'Last name is required',
        username: currentUsernameValid ? '' : 'Username is required',
        email: currentEmailValid ? '' : 'Email is invalid',
        password: currentPasswordValid ? '' : 'Password is too short',
        type: currentTypeValid ? '' : 'Please select regular or fixer',
      },
    });

    return currentFirstnameValid && currentLastnameValid && currentUsernameValid
    && currentEmailValid && currentPasswordValid && currentTypeValid;
  }

  handleChange(event) {
    this.setState({
      type: event.target.value,
    });
  }

  render() {
    const {
      signup: {
        firstname: defaultFirstname = '',
        lastname: defaultLastname = '',
        username: defaultUsername = '',
        email: defaultEmail = '',
        password: defaultPassword = '',
      },
    } = this.props;

    const {
      firstname = defaultFirstname,
      lastname = defaultLastname,
      username = defaultUsername,
      email = defaultEmail,
      password = defaultPassword,
      type,
      formErrors,
    } = this.state;

    return (
      <React.Fragment>
        <main id="signup" className={styles.signupMain}>
          <h1>
            Sign Up
            <div className={styles.graphic} alt="Small burgandy, rectangle graphic." />
          </h1>

          <section className={styles.wrapper}>

            <form method="POST" onSubmit={this.save}>
              <FormErrors formErrors={formErrors} />

              <fieldset>
                <label htmlFor="firstname">
                  First Name

                  <input
                    id="firstname"
                    className={styles.inputBorder}
                    type="text"
                    name="firstname"
                    value={firstname}
                    onChange={this.handleInputChange}
                  />
                </label>

                <label htmlFor="lastname">
                  Last Name

                  <input
                    id="lastname"
                    className={styles.inputBorder}
                    type="text"
                    name="lastname"
                    value={lastname}
                    onChange={this.handleInputChange}
                  />
                </label>

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

                <label htmlFor="email">
                  Email

                  <input
                    id="email"
                    className={styles.inputBorder}
                    type="text"
                    name="email"
                    value={email}
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

              <article>
                <label className={styles.labelRadio} htmlFor="regular">
                  <input
                    id="regular"
                    type="radio"
                    value="regular"
                    checked={type === 'regular'}
                    onChange={this.handleChange}
                  />

                  Regular
                </label>

                <label className={styles.labelRadio} htmlFor="fixer">
                  <input
                    id="fixer"
                    type="radio"
                    value="fixer"
                    checked={type === 'fixer'}
                    onChange={this.handleChange}
                  />

                  Fixer
                </label>
              </article>

              <input
                id="submitQ1"
                className={styles.submit}
                type="submit"
                value="Submit"
              />

              <div>
                <p>
                  <Link to="/signin">Already have an Account?</Link>
                </p>
              </div>
            </form>
          </section>

          <figure className={styles.signBCK} />
        </main>
      </React.Fragment>
    );
  }
}

Signup.propTypes = {
  signup: PropTypes.shape({
    id: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    type: PropTypes.string,
  }),
  createUser: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  history: RRPropTypes.history.isRequired,
  match: RRPropTypes.match.isRequired,
};

Signup.defaultProps = {
  signup: {},
};

export default container(Signup);
