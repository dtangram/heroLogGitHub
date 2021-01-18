import React from 'react';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import FormErrors from '../../../formErrors';
import Link from '../../../link';
import SuccessDisplay from '../success';
// import '../../../css/main.css';
import styles from './styles.module.css';
import container from './container';

class ProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      type: '',
      successMessage: '',
      formErrors: {
        firstname: '',
        lastname: '',
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

    this.inputFocus.focus();
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
    // if no id don't load the signup
    if (!id) return;
    await fetchUser(id);
    // update the state with the data from the updated signup
    const { signup } = this.props;
    this.setState({ ...signup });
  };

  save = (event) => {
    // make sure the form doesn't submit with the browser
    event.preventDefault();
    const {
      updateUser,
      match: {
        params: { id },
      },
      // history,
    } = this.props;
    const {
      firstname, lastname, email, password, type,
    } = this.state;

    const isValid = this.validateFields();

    const userId = localStorage.getItem('id');

    if (id && isValid && firstname.length >= 2 && lastname.length >= 2
      && email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
      && password.length >= 8 && type) {
      updateUser({
        id,
        firstname,
        lastname,
        email,
        password,
        type,
        userId,
      }).then(() => this.setState({ successMessage: 'success' }));
    }
  };

  async validateFields(fieldName, value) {
    const {
      firstname,
      lastname,
      email,
      password,
      type,
    } = this.state;

    const currentFirstnameValid = firstname.length >= 2;
    const currentLastnameValid = lastname.length >= 2;
    const currentEmailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    const currentPasswordValid = password.length >= 8;
    const currentTypeValid = type;

    this.setState({
      formErrors: {
        firstname: currentFirstnameValid ? '' : 'First name is required',
        lastname: currentLastnameValid ? '' : 'Last name is required',
        email: currentEmailValid ? '' : 'Email is invalid',
        password: currentPasswordValid ? '' : 'Password is too short',
        type: currentTypeValid ? '' : 'Please select regular or fixer',
      },
    });

    return currentFirstnameValid && currentLastnameValid && currentEmailValid
    && currentPasswordValid && currentTypeValid;
  }

  handleChange(event) {
    this.setState({
      type: event.target.value,
    });
  }

  render() {
    const userId = localStorage.getItem('id');

    const {
      signup: {
        id,
        firstname: defaultFirstname = '',
        lastname: defaultLastname = '',
        email: defaultEmail = '',
        password: defaultPassword = '',
      },
    } = this.props;

    const {
      firstname = defaultFirstname,
      lastname = defaultLastname,
      email = defaultEmail,
      password = defaultPassword,
      formErrors,
      successMessage,
    } = this.state;

    const { type } = this.state;

    return (
      <React.Fragment>
        <article id="cbComicForm" className={styles.cbWrapper}>
          <h1>
            {id && (
              `Update ${firstname}'s Profile`
            )}

            <figure className={styles.graphic} alt="Small burgandy, rectangle graphic." />
          </h1>

          <article className={styles.cbList}>
            {(formErrors.firstname.length <= 0
              || formErrors.lastname.length <= 0
              || formErrors.email.length <= 0
              || formErrors.password.length <= 0
              || !type)
              && successMessage === 'success' && <SuccessDisplay />}

            <section className={styles.wrapper}>
              <form method="POST" onSubmit={this.save}>
                <FormErrors formErrors={formErrors} />

                <article>
                  <fieldset>
                    <label htmlFor="login-first-name">
                      Change First Name

                      <input
                        ref={(input) => { this.inputFocus = input; }}
                        id="firstname"
                        className={styles.inputBorder}
                        type="text"
                        name="firstname"
                        value={firstname}
                        onChange={this.handleInputChange}
                      />
                    </label>

                    <label htmlFor="login-last-name">
                      Change Last Name

                      <input
                        id="lastname"
                        className={styles.inputBorder}
                        type="text"
                        name="lastname"
                        value={lastname}
                        onChange={this.handleInputChange}
                      />
                    </label>
                  </fieldset>

                  <fieldset>
                    <label htmlFor="login-email">
                      Change Email

                      <input
                        id="email"
                        className={styles.inputBorder}
                        type="text"
                        name="email"
                        value={email}
                        onChange={this.handleInputChange}
                      />
                    </label>

                    <label htmlFor="login-password">
                      Change Password

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
                </article>

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

                <article>
                  <p><Link url={`/profile/${userId}`} title="CANCEL" /></p>

                  <input
                    id="submitQ1"
                    className={styles.submit}
                    type="submit"
                    value="SUBMIT"
                  />
                </article>
              </form>
            </section>
          </article>
        </article>
      </React.Fragment>
    );
  }
}

ProfileForm.propTypes = {
  signup: PropTypes.shape({
    id: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    type: PropTypes.string,
  }),
  fetchUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  // history: RRPropTypes.history.isRequired,
  match: RRPropTypes.match.isRequired,
};

ProfileForm.defaultProps = {
  signup: {},
};

export default container(ProfileForm);
