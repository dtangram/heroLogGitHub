import React from 'react';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import FormErrors from '../../../formErrors';
import Link from '../../../link';
import SuccessDisplay from '../success';
import styles from './styles.module.css';
import container from './container';

class ReplyMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      successMessage: '',
      formErrors: {
        message: '',
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.loadData();
  }

  componentDidMount() {
    window.scrollTo({
      top: 0,
    });

    const { fetchMessaging, match: { params: { userId } } } = this.props;
    if (userId) fetchMessaging(userId);

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
      // createMessaging,
      updateMessaging,
      match: {
        params: {
          messageID, userId, comicBookTitle, userSent, prevMessage, username, userEmail,
        },
      },
    } = this.props;

    const { message } = this.state;

    const isValid = this.validateFields();

    const subjectcomicBookTitle = comicBookTitle.replace('%23', '#');

    const prevMessageDecode = decodeURIComponent(prevMessage);

    // const currentSentUser = (userId, userSent);

    const replyMess = `${username}: ${message}\n\n${prevMessageDecode}\n\n`;

    console.log('prevMessage:', prevMessageDecode);

    if (isValid && (message.length > 9 && message.length < 501)) {
      updateMessaging({
        id: messageID,
        name: username,
        email: userEmail,
        subject: subjectcomicBookTitle,
        message: replyMess,
        messageUsersId: userId,
        userSent,
      }).then(() => this.setState({ successMessage: 'success' }));
    }

    // if (!id && isValid && (message.length > 9 && message.length < 501)) {
    //   createMessaging({
    //     id: messageID,
    //     name: username,
    //     email: userEmail,
    //     subject: subjectcomicBookTitle,
    //     message: replyMess,
    //     messageUsersId: userId,
    //     userSent,
    //   }).then(() => this.setState({ successMessage: 'success' }));
    // }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  async validateFields(fieldName, value) {
    const {
      message,
    } = this.state;

    this.setState({
      formErrors: {
        message: message.length > 9 && message.length < 501 ? '' : 'Message has to be at between 10 and 500 characters.',
      },
    });

    return message.length > 9 && message.length < 501;
  }

  render() {
    const {
      match: {
        params: {
          comicBookTitle, username, userEmail,
        },
      },
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

    const subjectcomicBookTitle = comicBookTitle.replace('%23', '#');

    return (
      <React.Fragment>
        <article id="cbMessage" className={styles.cbWrapper}>
          <h1>
            Send Reply About
            <br />
            {subjectcomicBookTitle}
            <figure className={styles.graphic} alt="Small burgandy, rectangle graphic." />
          </h1>

          <article className={styles.cbList}>
            {(formErrors.message.length <= 0) && successMessage === 'success' ? <SuccessDisplay /> : null}

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

ReplyMessage.propTypes = {
  messaging: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    message: PropTypes.string,
  }),

  // createMessaging: PropTypes.func.isRequired,
  updateMessaging: PropTypes.func.isRequired,
  fetchMessaging: PropTypes.func.isRequired,
  match: RRPropTypes.match.isRequired,
};

ReplyMessage.defaultProps = {
  messaging: {},
};

export default container(ReplyMessage);
