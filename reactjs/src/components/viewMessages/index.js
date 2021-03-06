import React from 'react';
import { Link as RRLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import { BeatLoader } from 'react-spinners';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import ReplyIcon from '@material-ui/icons/Reply';
import Link from '../../link';
import Empty from '../empty/empty';
import '../../css/main.css';
// import styles from './styles.module.css';
import styles from './styles.module.css';
import container from './container';
import logo from '../../img/logo.png';

class ViewMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    props.fetchMessagings();
  }

  componentDidMount() {
    const {
      fetchMessagings, fetchUser, match: { params: { userId } },
    } = this.props;
    if (userId) {
      fetchMessagings(userId);
      fetchUser(userId);
    }

    window.scrollTo({
      top: 0,
    });
  }

  delete = async (id) => {
    const { deleteMessaging } = this.props;
    await deleteMessaging(id);
    window.location.reload(false);
  }

  render() {
    const { messagings, signups, match: { params: { userId } } } = this.props;
    const currentMessagingsData = messagings[userId] || {};
    const { allIds = [], byId = {}, isLoading } = currentMessagingsData;

    // turn the array of ids into an array of objects
    const currentMessagings = allIds.map(id => byId[id].data);

    const newSubject = encodeURIComponent(currentMessagings.map(newmess => newmess.subject));

    console.log('currentMessagings:', newSubject);

    return (
      <React.Fragment>
        <article id="cbVeiwMessage">
          <h1>
            Your Messages
            <div className="graphic" alt="Small burgandy, rectangle graphic." />
          </h1>

          <article className={styles.viewMess}>
            <RRLink to={`/sentMessages/${userId}`}>
              <figure><SendIcon /></figure>
              <p className="link">View Sent Messages</p>
            </RRLink>
          </article>

          <article className="cbList">
            <section>
              <article>
                {currentMessagings.length === 0 && !isLoading ? <Empty /> : <Empty /> === null}

                {isLoading && (
                  <React.Fragment>
                    <article className="loadMessageWrap">
                      <section>
                        <img src={logo} alt="HeroLog Logo" />
                      </section>

                      <section className="loadWrap">
                        <p className="loadMessage">Loading</p>
                        <BeatLoader size={10} color="#770422" />
                      </section>
                    </article>
                  </React.Fragment>
                )}

                <section className="viewMessage">
                  {!isLoading && currentMessagings.length > 0
                    && currentMessagings.map(fetchMessages => (
                      <article key={fetchMessages.id}>
                        <p>
                          <span>From:</span>
                          <br />
                          {fetchMessages.name}
                        </p>

                        <p>
                          <span>Email:</span>
                          <br />
                          {fetchMessages.email}
                        </p>

                        <p>
                          <span>Subject:</span>
                          <br />
                          {fetchMessages.subject}
                        </p>

                        <p>
                          <span>Message:</span>
                        </p>

                        <p>
                          {fetchMessages.message}
                        </p>

                        <section>
                          <section className="replyStyle">
                            <figure><ReplyIcon /></figure>

                            {signups.map(user => (
                              <p className={styles.link} key={user.id}>
                                <Link
                                  url={`/forms/reply/${fetchMessages.id}/${fetchMessages.userSent}/${encodeURIComponent(fetchMessages.subject)}/${encodeURIComponent(fetchMessages.message)}/${user.id}/${user.username}/${user.email}`}
                                  title="Reply"
                                />
                              </p>
                            ))}
                          </section>

                          <button className={styles.deleteStyle} type="submit" onClick={() => this.delete(fetchMessages.id)}>
                            <figure><DeleteIcon /></figure>
                            <p>Delete</p>
                          </button>
                        </section>
                      </article>
                    ))}
                </section>
              </article>
            </section>
          </article>
        </article>
      </React.Fragment>
    );
  }
}

ViewMessages.propTypes = {
  fetchMessagings: PropTypes.func.isRequired,
  messagings: PropTypes.shape({
    // id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    subject: PropTypes.string,
    message: PropTypes.string,
  }),

  messaging: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    subject: PropTypes.string,
    message: PropTypes.string,
  }),

  fetchUser: PropTypes.func.isRequired,
  signups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string,
      email: PropTypes.string,
    }),
  ),

  deleteMessaging: PropTypes.func.isRequired,
  match: RRPropTypes.match.isRequired,
};

ViewMessages.defaultProps = {
  messagings: {},
  messaging: {},
  signups: [],
};

export default container(ViewMessages);
