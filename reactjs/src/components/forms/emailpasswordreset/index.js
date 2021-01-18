import React from 'react';
// import { NavLink as RRNavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import FormErrors from '../../../formErrors';
import SuccessDisplay from '../success/emailSuccess';
// import '../../../css/main.css';
import styles from './styles.module.css';
import container from './container';

class EmailPasswordReset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      email: '',
      successMessage: '',
      formErrors: { email: '' },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.loadData();
  }

  componentDidMount() {
    const { emailpasswordresetUser, match: { params: { id } } } = this.props;
    if (id) {
      emailpasswordresetUser();
    }

    this.inputFocus.focus();
  }

  handleInputChange = (event) => {
    // pull the name of the input and value of input out of the even object
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  sendEmail = (event) => {
    const { emailpasswordresetUser } = this.props;
    event.preventDefault();
    emailpasswordresetUser();
  };

  loadData = async () => {
    const {
      match: {
        params: { id },
      },
      emailpasswordresetUser,
    } = this.props;
    // if no id don't load the signup
    if (!id) return;
    await emailpasswordresetUser(id);
    // update the state with the data from the updated signup
    const { emailpasswordreset } = this.props;
    this.setState({ ...emailpasswordreset });
  };

  submitHandler = (event) => {
    // make sure the form doesn't submit with the browser
    event.preventDefault();
    const {
      emailpasswordresetUser,
      // history,
    } = this.props;
    const {
      email,
    } = this.state;

    const isValid = this.validateFields();

    if (isValid && email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      emailpasswordresetUser({
        email,
      }).then(() => this.setState({ successMessage: 'success' }));
    }
  };

  toggle = () => {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  };

  async validateFields(fieldName, value) {
    const { email } = this.state;

    const currentEmailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

    setTimeout(() => {
      this.setState({
        formErrors: {
          email: currentEmailValid ? '' : 'Email is invalid',
          validToken: !email ? '' || !currentEmailValid : 'Email is not found',
        },
      });
    }, 5000);

    return currentEmailValid && email;
  }

  render() {
    const {
      emailpasswordreset: {
        email: defaultEmail = '',
      },
    } = this.props;

    const {
      email = defaultEmail,
      formErrors,
      successMessage,
    } = this.state;

    return (
      <React.Fragment>
        <main id="emailpassReset" className={styles.signupMain}>
          <section className={styles.wrapper}>
            <h1>
              Change Password
              <div className={styles.graphic} alt="Small burgandy, rectangle graphic." />
            </h1>

            <div>
              {(formErrors.email.length <= 0)
              && successMessage === 'success' && <SuccessDisplay />}
            </div>

            <form method="POST" onSubmit={this.submitHandler}>
              {(successMessage !== 'success') ? <FormErrors formErrors={formErrors} /> : formErrors.email.length <= 0}

              <fieldset>
                <label htmlFor="login-email">
                  Enter Your Email

                  <input
                    ref={(input) => { this.inputFocus = input; }}
                    id="email"
                    className={styles.inputBorder}
                    type="text"
                    name="email"
                    value={email}
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

EmailPasswordReset.propTypes = {
  emailpasswordresetUser: PropTypes.func.isRequired,
  emailpasswordreset: PropTypes.shape({
    email: PropTypes.string,
  }),
  match: RRPropTypes.match.isRequired,
};

EmailPasswordReset.defaultProps = {
  emailpasswordreset: {},
};

export default container(EmailPasswordReset);
