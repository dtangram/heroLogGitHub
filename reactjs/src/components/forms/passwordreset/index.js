import React from 'react';
// import { Link, Redirect } from 'react-router-dom';
// import axios from 'axios';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import API from '../../../API';
import FormErrors from '../../../formErrors';
// import '../../../css/main.css';
import styles from './styles.module.css';
import container from './container';

class PasswordReset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordConfirm: '',
      formErrors: { password: '' },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.loadData();
  }

  async componentDidMount() {
    const { match: { params: { token } } } = this.props;
    await API.get(`/passwordreset/${token}`).then((res) => {
      if (res.message === 'Password reset OK') {
        this.setState({ username: res.username });
      }
    });
  }

  handleInputChange = (event) => {
    // pull the name of the input and value of input out of the even object
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  loadData = async () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    // if no id don't load the user
    if (!id) return;
    // update the state with the data from the updated user
    const { users } = this.props;
    this.setState({ ...users });
  };

  submitHandler = (event) => {
    // make sure the form doesn't submit with the browser
    event.preventDefault();

    const { history } = this.props;

    const {
      username,
      password,
      passwordConfirm,
    } = this.state;

    const isValid = this.validateFields();

    if (isValid && password === passwordConfirm && password !== '' && passwordConfirm !== '') {
      API.put('/passwordreset/passwordResetUpdate', {
        username,
        password,
      }).then(() => {
        if (isValid && password === passwordConfirm && password !== '' && passwordConfirm !== '') {
          history.push('/signin');
        }
      });
    }
  };

  async validateFields(fieldName, value) {
    const { password } = this.state;
    const { passwordConfirm } = this.state;

    const currentPasswordValid = password.length >= 8;
    const currentConfirm = password === passwordConfirm;
    this.setState({
      formErrors: {
        password: currentPasswordValid ? '' : 'Password is too short',
        confirmed: currentConfirm ? '' || password !== passwordConfirm : 'Passwords do not match',
      },
    });

    return currentPasswordValid && currentConfirm;
  }

  render() {
    const {
      users: {
        password: defaultPassword = '',
        passwordConfirm: defaultPasswordConfirm = '',
      },
      // user,
    } = this.props;

    const {
      password = defaultPassword,
      passwordConfirm = defaultPasswordConfirm,
      formErrors,
    } = this.state;

    return (
      <React.Fragment>
        <main id="signin" className={styles.signupMain}>
          <section className={styles.wrapper}>
            <h1>
              Reset Password
              <div className={styles.graphic} alt="Small burgandy, rectangle graphic." />
            </h1>

            <form method="POST" onSubmit={this.submitHandler}>
              <FormErrors formErrors={formErrors} />

              <fieldset>
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

              <fieldset>
                <label htmlFor="passwordConfirm">
                  Confirm Password

                  <input
                    id="passwordConfirm"
                    className={styles.inputBorder}
                    type="password"
                    name="passwordConfirm"
                    value={passwordConfirm}
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
            </form>
          </section>

          <figure className={styles.signBCK} />
        </main>
      </React.Fragment>
    );
  }
}

PasswordReset.propTypes = {
  users: PropTypes.shape({
    data: PropTypes.shape({
      id: PropTypes.string,
    }),
    password: PropTypes.string,
    passwordConfirm: PropTypes.string,
  }),
  history: RRPropTypes.history.isRequired,
  match: RRPropTypes.match.isRequired,
};

PasswordReset.defaultProps = {
  users: {},
};

export default container(PasswordReset);
