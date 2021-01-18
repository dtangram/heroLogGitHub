import React from 'react';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import Link from '../../link';
import Empty from '../empty/empty';
// import '../../../css/main.css';
import styles from './styles.module.css';
import container from './container';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    props.fetchUser();
  }

  componentDidMount() {
    window.scrollTo({
      top: 0,
    });

    const { fetchUser, match: { params: { id } } } = this.props;
    if (id) fetchUser(id);
  }

  delete = async (id) => {
    const { deleteUser } = this.props;
    await deleteUser(id);
    window.location.reload(false);
  }

  render() {
    const { signups, isLoading } = this.props;

    return (
      <React.Fragment>
        <article id="cbDash" className={styles.cbWrap}>
          <h1>
            Profile
            <figure className={styles.graphic} alt="Small burgandy, rectangle graphic." />
          </h1>

          <article className={styles.cbList}>
            {signups.length === 0 && !isLoading ? <Empty /> : <Empty /> === null}
            <section className={styles.wrapper}>
              <article>
                {isLoading && (<p className={styles.loadMessage}>Loading...</p>)}
                {!isLoading && signups.length > 0
                  && signups.map(profile => (
                    <p key={profile.id}>
                      {profile.firstname}
                      <br />
                      {profile.lastname}
                      <br />
                      {profile.username}
                      <br />
                      {profile.email}
                      <br />
                      {profile.type}
                      <br />
                      <Link url={`/forms/profileform/edit/${profile.id}`} title="Update Profile" />
                      <button type="submit" onClick={() => this.delete(profile.id)}>Delete</button>
                    </p>
                  ))}
              </article>
            </section>
          </article>
        </article>
      </React.Fragment>
    );
  }
}

Profile.propTypes = {
  fetchUser: PropTypes.func.isRequired,
  signups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      firstname: PropTypes.string,
      lastname: PropTypes.string,
      username: PropTypes.string,
      email: PropTypes.string,
      type: PropTypes.string,
    }),
  ),
  deleteUser: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  match: RRPropTypes.match.isRequired,
};

Profile.defaultProps = {
  signups: [],
};

export default container(Profile);
