import React from 'react';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import { Link as RRLink, withRouter } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Link from '../../../link';
import Empty from '../../empty/empty';
import '../../../css/main.css';
import styles from './styles.module.css';
import container from './container';
import logo from '../../../img/logo.png';

class ComicBookListIssues extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    window.scrollTo({
      top: 0,
    });

    // window.scrollTop = 0;

    const { fetchComicBooks, match: { params: { coboTitleId } } } = this.props;
    if (coboTitleId) fetchComicBooks(coboTitleId);
  }

  delete = async (id) => {
    const { deleteComicBook } = this.props;
    await deleteComicBook(id);
    window.location.reload(false);
  }

  goBack() {
    const { history } = this.props;
    history.goBack();
  }

  render() {
    const {
      comicbooklistissues,
      match: { params: { coboTitleId, cbTitle } },
    } = this.props;

    const currentComicbooklistissueData = comicbooklistissues[coboTitleId] || {};
    const { allIds = [], byId = {}, isLoading } = currentComicbooklistissueData;

    // turn the array of ids into an array of objects
    const currentComicbooklistissues = allIds.map(id => byId[id].data);

    return (
      <React.Fragment>
        <article id="cbComBookListIssues">
          <button className={styles.backLink} type="button" onClick={() => this.goBack()}>Back</button>

          <h1>
            Your List of&nbsp;
            {cbTitle}
            &nbsp;Comics
            <figure className="graphic" alt="Small burgandy, rectangle graphic." />
          </h1>

          <h2>
            <section>
              <RRLink to={`/forms/${coboTitleId}/comicbook/new`}>
                <figure><LibraryAddIcon /></figure>
                <p className="link">Add Comic Book</p>
              </RRLink>
            </section>
          </h2>

          <article className="cbList">
            {
              currentComicbooklistissues.length === 0 && !isLoading
                ? <Empty /> : <Empty /> === null
            }
            <section className="wrapper">
              <article>
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

                {!isLoading && currentComicbooklistissues.length > 0
                  && currentComicbooklistissues.map(comicbookListProp => (
                    <section className="comicSec" key={comicbookListProp.id}>
                      <article className="comicWrap">
                        <section className="comicImgWrap">
                          <img src={comicbookListProp.comicBookCover} alt="" />
                        </section>

                        <section className="paraWrap">
                          <p>
                            <span>Title:</span>
                            &nbsp;
                            {comicbookListProp.title}
                          </p>

                          <p>
                            <span>Issue:</span>
                            &nbsp;
                            {comicbookListProp.comicIssue}
                          </p>

                          <p>
                            <span>Author:</span>
                            &nbsp;
                            {comicbookListProp.author}
                          </p>

                          <p>
                            <span>Penciler:</span>
                            &nbsp;
                            {comicbookListProp.penciler}
                          </p>

                          <p>
                            <span>Cover Artist:</span>
                            &nbsp;
                            {comicbookListProp.coverartist}
                          </p>

                          <p>
                            <span>Inker:</span>
                            &nbsp;
                            {comicbookListProp.inker}
                          </p>

                          <p>
                            <span>Volume:</span>
                            &nbsp;
                            {comicbookListProp.volume}
                          </p>

                          <p>
                            <span>Year:</span>
                            &nbsp;
                            {comicbookListProp.year}
                          </p>

                          <p>
                            <span>Cover:</span>
                            &nbsp;
                            {comicbookListProp.type}
                          </p>

                          <section>
                            <section className="editStyle">
                              <figure><EditIcon /></figure>
                              <p className="link"><Link className="link" url={`/forms/${coboTitleId}/comicbook/edit/${comicbookListProp.id}`} title="Edit" /></p>
                            </section>
                            <button className="deleteStyle" type="submit" onClick={() => this.delete(comicbookListProp.id)}>
                              <figure><DeleteIcon /></figure>
                              <p>Delete</p>
                            </button>
                          </section>
                        </section>
                      </article>
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

ComicBookListIssues.propTypes = {
  fetchComicBooks: PropTypes.func.isRequired,
  comicbooklistissues: PropTypes.shape({
    // id: PropTypes.string,
    title: PropTypes.string,
    comicIssue: PropTypes.number,
    author: PropTypes.string,
    penciler: PropTypes.string,
    coverartist: PropTypes.string,
    inker: PropTypes.string,
    volume: PropTypes.number,
    year: PropTypes.number,
    type: PropTypes.string,
  }),
  deleteComicBook: PropTypes.func.isRequired,
  history: PropTypes.func.isRequired,
  match: RRPropTypes.match.isRequired,
};

ComicBookListIssues.defaultProps = {
  comicbooklistissues: {},
};

export default withRouter(container(ComicBookListIssues));
