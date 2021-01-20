import React from 'react';
// import { Link as RRLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import { BeatLoader } from 'react-spinners';
// import Link from '../../link';
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
    const { fetchMessagings, match: { params: { userId } } } = this.props;
    if (userId) fetchMessagings(userId);

    window.scrollTo({
      top: 0,
    });
  }

  // delete = async (id) => {
  //   const { deleteSale } = this.props;
  //   await deleteSale(id);
  //   window.location.reload(false);
  // }

  render() {
    const { match: { params: { userId } } } = this.props;
    const { messagings } = this.props;
    const currentMessagingsData = messagings[userId] || {};
    const { allIds = [], byId = {}, isLoading } = currentMessagingsData;

    // turn the array of ids into an array of objects
    const currentMessagings = allIds.map(id => byId[id].data);

    // if (window.localStorage) {
    //   if (currentSales.length > 0) {
    //     localStorage.removeItem('firstLoad');
    //   } else if (!localStorage.getItem('firstLoad')) {
    //     localStorage.firstLoad = true;
    //     window.location.reload();
    //   }
    // }

    return (
      <React.Fragment>
        <div id="cbSale">
          <h1>
            Your Messages
            <div className="graphic" alt="Small burgandy, rectangle graphic." />
          </h1>

          <div className="cbList">
            <section>
              <article>
                {currentMessagings.length === 0 && !isLoading ? <Empty /> : <Empty /> === null}

                {isLoading && (
                  <React.Fragment>
                    <article>
                      <section className="loadMessageWrap">
                        <img src={logo} alt="HeroLog Logo" />
                      </section>

                      <section className="loadWrap">
                        <p className="loadMessage">Loading</p>
                        <BeatLoader size={10} color="#770422" />
                      </section>
                    </article>
                  </React.Fragment>
                )}

                {!isLoading && currentMessagings.length > 0
                  && currentMessagings.map(fetchMessages => (
                    <article className={styles.viewMessage} key={fetchMessages.id}>
                      <p>
                        From:&nbsp;
                        {fetchMessages.name}
                        <br />
                        Email:&nbsp;
                        {fetchMessages.email}
                        <br />
                        Message:&nbsp;
                        {fetchMessages.message}
                      </p>
                    </article>
                  ))}
              </article>
            </section>
          </div>
        </div>
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
    message: PropTypes.string,
  }),

  messaging: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    message: PropTypes.string,
  }),
  // deleteSale: PropTypes.func.isRequired,
  match: RRPropTypes.match.isRequired,
};

ViewMessages.defaultProps = {
  messagings: {},
  messaging: {},
};

export default container(ViewMessages);
