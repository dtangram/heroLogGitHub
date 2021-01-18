import React from 'react';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import FormErrors from '../../../formErrors';
import Link from '../../../link';
// import '../../../css/main.css';
import styles from './styles.module.css';
import container from './container';

// const validate = require('validate.js');

class ComicBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      author: '',
      penciler: '',
      coverartist: '',
      inker: '',
      volume: '',
      year: '',
      type: '',
      formErrors: {
        title: '',
        type: '',
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.loadData();
  }

  componentDidMount() {
    const { fetchComicBook, match: { params: { coboTitleId } } } = this.props;
    if (coboTitleId) fetchComicBook(coboTitleId);
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
      fetchComicBook,
    } = this.props;
    // if no id don't load the item
    if (!id) return;
    await fetchComicBook(id);
    // update the state with the data from the updated item
    const { comicbook } = this.props;
    this.setState({ ...comicbook });
  };

  save = (event) => {
    // make sure the form doesn't submit with the browser
    event.preventDefault();
    const {
      createComicBook,
      updateComicBook,
      match: {
        params: { coboTitleId, id },
      },
      history,
    } = this.props;
    const {
      title, author, penciler, coverartist, inker, volume, year, type,
    } = this.state;

    const isValid = this.validateFields();

    if (id) {
      updateComicBook({
        id,
        title,
        author,
        penciler,
        coverartist,
        inker,
        volume,
        year,
        type,
      }).then(() => history.push(`/dashboard/${coboTitleId}/comicbooklistissues`));
    }

    if (!id && isValid) {
      createComicBook({
        title,
        author,
        penciler,
        coverartist,
        inker,
        volume,
        year,
        type,
        comicbooktitlerelId: coboTitleId,
      }).then(() => {
        if (title.length >= 1 && type) {
          history.push(`/dashboard/${coboTitleId}/comicbooklistissues`);
        }
      });
    }
  };

  async validateFields(fieldName, value) {
    const {
      title,
      type,
    } = this.state;

    const currentTitleValid = title.length >= 1;
    const currentTypeValid = type;

    this.setState({
      formErrors: {
        title: currentTitleValid ? '' : 'Comic Book issue title is required',
        type: currentTypeValid ? '' : 'Please select regular or variant',
      },
    });

    return currentTitleValid && currentTypeValid;
  }

  handleChange(event) {
    this.setState({
      type: event.target.value,
    });
  }

  render() {
    const { type } = this.state;

    const {
      comicbook: {
        id,
        title: defaultTitle = '',
        author: defaultAuthor = '',
        penciler: defaultPenciler = '',
        coverartist: defaultCoverArtist = '',
        inker: defaultInker = '',
        volume: defaultVolume = '',
        year: defaultYear = '',
      },
      match: { params: { coboTitleId } },
    } = this.props;

    const {
      title = defaultTitle,
      author = defaultAuthor,
      penciler = defaultPenciler,
      coverartist = defaultCoverArtist,
      inker = defaultInker,
      volume = defaultVolume,
      year = defaultYear,
      formErrors,
    } = this.state;

    return (
      <React.Fragment>
        <div id="cbComicForm" className={styles.cbWrapper}>
          <h1>
            {id && (
              `Edit ${title}`
            )}

            {!id && (
              'Add Comic Book'
            )}
            <div className={styles.graphic} alt="Small burgandy, rectangle graphic." />
          </h1>

          <div className={styles.cbList}>
            <section className={styles.wrapper}>
              <form method="POST" onSubmit={this.save}>
                <FormErrors formErrors={formErrors} />

                <article>
                  <fieldset>
                    <label htmlFor="title">
                      Title

                      <input
                        id="title"
                        className={styles.inputBorder}
                        type="text"
                        name="title"
                        value={title}
                        onChange={this.handleInputChange}
                      />
                    </label>

                    <label htmlFor="author">
                      Author/Writer

                      <input
                        id="author"
                        className={styles.inputBorder}
                        type="text"
                        name="author"
                        value={author}
                        onChange={this.handleInputChange}
                      />
                    </label>

                    <label htmlFor="penciler">
                      Penciler

                      <input
                        id="penciler"
                        className={styles.inputBorder}
                        type="text"
                        name="penciler"
                        value={penciler}
                        onChange={this.handleInputChange}
                      />
                    </label>

                    <label htmlFor="coverartist">
                      Cover Artist

                      <input
                        id="coverartist"
                        className={styles.inputBorder}
                        type="text"
                        name="coverartist"
                        value={coverartist}
                        onChange={this.handleInputChange}
                      />
                    </label>
                  </fieldset>

                  <fieldset>
                    <label htmlFor="inker">
                      Inker

                      <input
                        id="inker"
                        className={styles.inputBorder}
                        type="text"
                        name="inker"
                        value={inker}
                        onChange={this.handleInputChange}
                      />
                    </label>

                    <label htmlFor="volume">
                      Volume

                      <input
                        id="volume"
                        className={styles.inputBorder}
                        type="text"
                        name="volume"
                        value={volume}
                        onChange={this.handleInputChange}
                      />
                    </label>

                    <label htmlFor="year">
                      Year

                      <input
                        id="year"
                        className={styles.inputBorder}
                        type="text"
                        name="year"
                        value={year}
                        onChange={this.handleInputChange}
                      />
                    </label>
                  </fieldset>
                </article>

                <article>
                  <label className={styles.labelRadio} htmlFor="regularcover">
                    <input
                      id="regularcover"
                      type="radio"
                      value="regular"
                      checked={type === 'regular'}
                      onChange={this.handleChange}
                    />

                    Regular Cover
                  </label>

                  <label className={styles.labelRadio} htmlFor="variantcover">
                    <input
                      id="variantcover"
                      type="radio"
                      value="variant"
                      checked={type === 'variant'}
                      onChange={this.handleChange}
                    />

                    Variant Cover
                  </label>
                </article>

                <article>
                  <p><Link url={`/dashboard/${coboTitleId}/comicbooklistissues`} title="CANCEL" /></p>

                  <input
                    id="submitQ1"
                    className={styles.submit}
                    type="submit"
                    value="SUBMIT"
                  />
                </article>
              </form>
            </section>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

ComicBook.propTypes = {
  comicbook: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    penciler: PropTypes.string,
    coverartist: PropTypes.string,
    inker: PropTypes.string,
    volume: PropTypes.number,
    year: PropTypes.number,
    type: PropTypes.string,
  }),
  createComicBook: PropTypes.func.isRequired,
  fetchComicBook: PropTypes.func.isRequired,
  updateComicBook: PropTypes.func.isRequired,
  history: RRPropTypes.history.isRequired,
  match: RRPropTypes.match.isRequired,
};

ComicBook.defaultProps = {
  comicbook: {},
};

export default container(ComicBook);
