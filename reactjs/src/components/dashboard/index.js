import React from 'react';
import { Link as RRLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { BeatLoader } from 'react-spinners';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Link from '../../link';
import Empty from '../empty/empty';
// import '../../../css/main.css';
import styles from './styles.module.css';
import container from './container';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    window.scrollTo({
      top: 0,
    });

    const { fetchPublishers } = this.props;
    fetchPublishers();
  }

  delete = async (id) => {
    const { deletePublisher } = this.props;
    await deletePublisher(id);
    window.location.reload(false);
  }

  // refreshPage = async () => {
  //   await window.location.reload(false);
  // }

  // delete = async () => {
  //   const { deletePublisher, publishers: { id } } = this.props;
  //   await deletePublisher(id);
  // }

  render() {
    const { publishers, isLoading } = this.props;

    return (
      <React.Fragment>
        <article id="cbDash" className={styles.cbWrap}>
          <h1>
            Your List of Publishers
            <figure className={styles.graphic} alt="Small burgandy, rectangle graphic." />
          </h1>

          <article className={styles.cbList}>
            {publishers.length === 0 && !isLoading ? <Empty /> : <Empty /> === null}

            <section className={styles.wrapper}>
              <article>
                {isLoading && (
                  <section className={styles.loadWrap}>
                    <p className={styles.loadMessage}>Loading</p>
                    <BeatLoader size={10} color="#FFF" />
                  </section>
                )}

                {!isLoading && publishers.length > 0
                  && publishers.map(publisher => (
                    <section key={publisher.id}>
                      <p>
                        <RRLink to={`/dashboard/${publisher.id}/${publisher.publisherName}/comicbooklist`} className={styles.link}>{publisher.publisherName}</RRLink>
                      </p>

                      <section className={styles.editStyle}>
                        <figure><EditIcon /></figure>
                        <p className={styles.link}><Link url={`/forms/createpublisher/edit/${publisher.id}`} title="Edit" /></p>
                      </section>
                      <button className={styles.deleteStyle} type="submit" onClick={() => this.delete(publisher.id)}>
                        <figure><DeleteIcon /></figure>
                        <p>Delete</p>
                      </button>
                    </section>
                  ))}
              </article>
            </section>
          </article>
        </article>
      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  fetchPublishers: PropTypes.func.isRequired,
  publishers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      publisherName: PropTypes.string,
    }),
  ),
  deletePublisher: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

Dashboard.defaultProps = {
  publishers: [],
};

export default container(Dashboard);
