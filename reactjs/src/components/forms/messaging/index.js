import React from 'react';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import FormErrors from '../../../formErrors';
import Link from '../../../link';
import SuccessDisplay from '../success';
import styles from './styles.module.css';
import container from './container';

class ModalMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      successMessage: '',
      formErrors: {
        message: '',
      },
    };

    props.fetchMessagings();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.loadData();
  }

  componentDidMount() {
    window.scrollTo({
      top: 0,
    });

    const { fetchMessagings, match: { params: { userId } } } = this.props;
    if (userId) fetchMessagings(userId);

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
      fetchMessaging,
    } = this.props;
    // if no id don't load the publisher
    if (!id) return;
    await fetchMessaging(id);
    // update the state with the data from the updated publisher
    const { messaging } = this.props;
    this.setState({ ...messaging });
  };

  save = (event) => {
    // make sure the form doesn't submit with the browser
    event.preventDefault();
    const {
      createMessaging,
      match: {
        params: { id },
      },
    } = this.props;
    const { message } = this.state;

    const isValid = this.validateFields();

    const { match: { params: { userId, username, userEmail } } } = this.props;

    if (!id && isValid && message.length >= 10) {
      createMessaging({
        name: username,
        email: userEmail,
        message,
        messageUsersId: userId,
      }).then(() => this.setState({ successMessage: 'success' }));
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  async validateFields(fieldName, value) {
    const {
      message,
    } = this.state;

    const currentMessageValid = message.length >= 10;

    this.setState({
      formErrors: {
        message: currentMessageValid ? '' : 'Message is required',
      },
    });

    return currentMessageValid;
  }

  render() {
    const {
      match: { params: { comicBookTitle, username, userEmail } },
      messaging: {
        name = `${username}`,
        email = `${userEmail}`,
        message: defaultMessage = '',
      },
    } = this.props;

    const {
      message = defaultMessage,
      formErrors,
      successMessage,
    } = this.state;

    return (
      <React.Fragment>
        <article id="cbMessage" className={styles.cbWrapper}>
          <h1>
            Send Message About &nbsp;
            {comicBookTitle}
            <figure className={styles.graphic} alt="Small burgandy, rectangle graphic." />
          </h1>

          <article className={styles.cbList}>
            {successMessage === 'success' ? <SuccessDisplay /> : null}

            <section className={styles.wrapper}>
              <form method="POST" onSubmit={this.save}>
                <FormErrors formErrors={formErrors} />

                <article>
                  <fieldset>
                    <label htmlFor="name">
                      From

                      <input
                        id="name"
                        className={styles.inputBorder}
                        type="text"
                        name="name"
                        value={name}
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

                    <textarea
                      ref={(input) => { this.inputFocus = input; }}
                      id="message"
                      type="text"
                      name="message"
                      value={message}
                      onChange={this.handleInputChange}
                      rows="4"
                      placeholder="Message"
                    />
                  </fieldset>
                </article>

                <article>
                  <p><Link url="/" title="CANCEL" /></p>

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

ModalMessage.propTypes = {
  fetchMessagings: PropTypes.func.isRequired,
  messagings: PropTypes.shape({
    // id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    message: PropTypes.string,
  }),

  messaging: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    message: PropTypes.string,
  }),

  createMessaging: PropTypes.func.isRequired,
  fetchMessaging: PropTypes.func.isRequired,
  match: RRPropTypes.match.isRequired,
};

ModalMessage.defaultProps = {
  messagings: {},
  messaging: {},
};

export default container(ModalMessage);
