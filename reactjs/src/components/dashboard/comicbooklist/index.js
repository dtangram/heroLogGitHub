import React from 'react';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import { Link as RRLink } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Link from '../../../link';
import Empty from '../../empty/empty';
// import '../../../css/main.css';
import styles from './styles.module.css';
import container from './container';

class ComicBookList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    // props.fetchComicBookTitles();
  }

  componentDidMount() {
    window.scrollTo({
      top: 0,
    });

    const { fetchComicBookTitles, match: { params: { pubId } } } = this.props;
    if (pubId) fetchComicBookTitles(pubId);
  }

  delete = async (id) => {
    const { deleteComicBookTitle } = this.props;
    await deleteComicBookTitle(id);
    window.location.reload(false);
  }

  // delete = async () => {
  //   const { deleteComicBookTitle, comicbooklists: { id } } = this.props;
  //   await deleteComicBookTitle(id);
  // }

  render() {
    const { comicbooklists, match: { params: { pubId, publisherName } } } = this.props;

    const currentComicbookData = comicbooklists[pubId] || {};
    const { allIds = [], byId = {}, isLoading } = currentComicbookData;

    // turn the array of ids into an array of objects
    const currentComicbooklists = allIds.map(id => byId[id].data);

    return (
      <React.Fragment>
        <article id="cbComBookList" className={styles.cbWrap}>
          <h1>
            Your List of&nbsp;
            {publisherName}
            &nbsp;Titles
            <figure className={styles.graphic} alt="Small burgandy, rectangle graphic." />
          </h1>

          <h2>
            <section>
              <RRLink to={`/forms/${pubId}/comicbooklisttitle/new`}>
                <figure><LibraryAddIcon /></figure>
                <p className={styles.link}>Add Comic Book Title</p>
              </RRLink>
            </section>
          </h2>

          <article className={styles.cbList}>
            {currentComicbooklists.length === 0 && !isLoading ? <Empty /> : <Empty /> === null}

            <section className={styles.wrapper}>
              <article>
                {isLoading && (
                  <section className={styles.loadWrap}>
                    <p className={styles.loadMessage}>Loading</p>
                    <BeatLoader size={10} color="#FFF" />
                  </section>
                )}

                {!isLoading && currentComicbooklists.length > 0
                  && currentComicbooklists.map(comicbookListProp => (
                    <section key={comicbookListProp.id}>
                      <p>
                        <RRLink to={`/dashboard/${comicbookListProp.id}/${comicbookListProp.cbTitle}/comicbooklistissues`} className={styles.link}>{comicbookListProp.cbTitle}</RRLink>
                      </p>

                      <section className={styles.editStyle}>
                        <figure><EditIcon /></figure>
                        <p className={styles.link}><Link url={`/forms/${pubId}/comicbooklisttitle/edit/${comicbookListProp.id}`} title="Edit" /></p>
                      </section>
                      <button className={styles.deleteStyle} type="submit" onClick={() => this.delete(comicbookListProp.id)}>
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

ComicBookList.propTypes = {
  fetchComicBookTitles: PropTypes.func.isRequired,
  comicbooklists: PropTypes.shape({
    id: PropTypes.string,
    cbTitle: PropTypes.string,
  }),
  deleteComicBookTitle: PropTypes.func.isRequired,
  match: RRPropTypes.match.isRequired,
};

ComicBookList.defaultProps = {
  comicbooklists: {},
};

export default container(ComicBookList);
