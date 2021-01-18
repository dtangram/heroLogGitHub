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
      name: '',
      email: '',
      message: '',
      successMessage: '',
      formErrors: {
        name: '',
        email: '',
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
    const { name, email, message } = this.state;

    const isValid = this.validateFields();

    const userId = localStorage.getItem('id');

    if (!id && isValid && name.length >= 3 && message.length >= 10
      && email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      createMessaging({
        name,
        email,
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
      name,
      email,
      message,
    } = this.state;

    const currentNameValid = name.length >= 3;
    const currentEmailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    const currentMessageValid = message.length >= 10;

    this.setState({
      formErrors: {
        publisherName: currentNameValid ? '' : 'Name is required',
        email: currentEmailValid ? '' : 'Email is required',
        message: currentMessageValid ? '' : 'Message is required',
      },
    });

    return currentNameValid && currentEmailValid && currentMessageValid;
  }

  render() {
    const { match: { params: { userId } } } = this.props;

    const {
      messaging: {
        name: defaultName = '',
        email: defaultEmail = '',
        message: defaultMessage = '',
      },
      messagings,
    } = this.props;

    const {
      name = defaultName,
      email = defaultEmail,
      message = defaultMessage,
      formErrors,
      successMessage,
    } = this.state;

    const currentMessagingsData = messagings[userId] || {};
    const { allIds = [], byId = {} } = currentMessagingsData;

    // turn the array of ids into an array of objects
    const currentMessagings = allIds.map(id => byId[id].data);

    return (
      <React.Fragment>
        <article>
          <article className={styles.cbList}>
            <h2 className={styles.cbModalH2}>Sent Messages</h2>

            <article className={styles.messageSent}>
              {currentMessagings.map(fetchMessages => (
                <p key={fetchMessages.id}>
                  {fetchMessages.name}
                  <br />
                  {fetchMessages.email}
                  <br />
                  {fetchMessages.message}
                </p>
              ))}
            </article>

            {successMessage === 'success' ? <SuccessDisplay /> : null}

            <section className={styles.wrapper}>
              <form method="POST" onSubmit={this.save}>
                <h2 className={styles.cbModalH2}>Send a Message</h2>

                <FormErrors formErrors={formErrors} />

                <article>
                  <fieldset>
                    <label htmlFor="name">
                      Name

                      <input
                        ref={(input) => { this.inputFocus = input; }}
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
