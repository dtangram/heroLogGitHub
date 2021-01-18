import React from 'react';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import FormErrors from '../../../formErrors';
import Link from '../../../link';
import SuccessDisplay from '../success';
// import '../../../css/main.css';
import styles from './styles.module.css';
import container from './container';

class ComicBookListTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cbTitle: '',
      successMessage: '',
      formErrors: {
        cbTitle: '',
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.goBack = this.goBack.bind(this);
    this.loadData();
  }

  componentDidMount() {
    window.scrollTo({
      top: 0,
    });

    const { fetchComicBookTitle, match: { params: { id } } } = this.props;
    if (id) fetchComicBookTitle(id);

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
      fetchComicBookTitle,
    } = this.props;
    // if no id don't load the item
    if (!id) return;
    await fetchComicBookTitle(id);
    // update the state with the data from the updated item
    const { comicbooklist } = this.props;
    this.setState({ ...comicbooklist });
  };

  save = (event) => {
    // make sure the form doesn't submit with the browser
    event.preventDefault();
    const {
      createComicBookTitle,
      updateComicBookTitle,
      match: {
        params: { pubId, id },
      },
      // history,
    } = this.props;
    const { cbTitle } = this.state;

    const isValid = this.validateFields();

    if (id && isValid && cbTitle.length >= 1) {
      updateComicBookTitle({
        id,
        cbTitle,
      }).then(() => this.setState({ successMessage: 'success' }));
    } else if (!id && cbTitle.length >= 1) {
      createComicBookTitle({ cbTitle, collectpubId: pubId })
        .then(() => this.setState({ successMessage: 'success' }));
    }

    // if (id && isValid) {
    //   updateComicBookTitle({
    //     id,
    //     cbTitle,
    //   }).then(() => {
    //     if (cbTitle.length >= 1) {
    //       history.push(`/dashboard/${pubId}/comicbooklist`);
    //     }
    //   });
    // } else if (!id && isValid) {
    //   createComicBookTitle({ cbTitle, collectpubId: pubId })
    //     .then(() => {
    //       if (cbTitle.length >= 1) {
    //         history.push(`/dashboard/${pubId}/comicbooklist`);
    //       }
    //     });
    // }
  };

  async validateFields(fieldName, value) {
    const {
      cbTitle,
    } = this.state;

    const currentCbTitleValid = cbTitle.length >= 1;

    this.setState({
      formErrors: {
        cbTitle: currentCbTitleValid ? '' : 'Comic Book title is required',
      },
    });

    return currentCbTitleValid;
  }

  goBack() {
    const { history } = this.props;
    history.goBack();
  }

  render() {
    const {
      comicbooklist: {
        id,
        cbTitle: defaultCBTitle = '',
      },
      history,
      match: { params: { pubId } },
    } = this.props;

    const {
      cbTitle = defaultCBTitle,
      formErrors,
      successMessage,
    } = this.state;

    return (
      <React.Fragment>
        <article id="cbComicBookListTitle" className={styles.cbWrapper}>
          <button className={styles.backLink} type="button" onClick={() => history.goBack()}>Back</button>

          <h1>
            {id && (
              `Edit ${cbTitle}`
            )}

            {!id && (
              'Add Comic Book Title to Collection'
            )}
            <figure className={styles.graphic} alt="Small burgandy, rectangle graphic." />
          </h1>

          <article className={styles.cbList}>
            {formErrors.cbTitle.length <= 0 && successMessage === 'success' && <SuccessDisplay />}

            <section className={styles.wrapper}>
              <form method="POST" onSubmit={this.save}>
                <FormErrors formErrors={formErrors} />

                <fieldset>
                  <label htmlFor="cbTitle">
                    Comic Book Title

                    <input
                      ref={(input) => { this.inputFocus = input; }}
                      id="cbTitle"
                      className={styles.inputBorder}
                      type="text"
                      name="cbTitle"
                      value={cbTitle}
                      onChange={this.handleInputChange}
                    />
                  </label>
                </fieldset>

                <article>
                  <p><Link url={`/dashboard/${pubId}/comicbooklist`} title="CANCEL" /></p>

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

ComicBookListTitle.propTypes = {
  comicbooklist: PropTypes.shape({
    id: PropTypes.string,
    pubId: PropTypes.string,
    cbTitle: PropTypes.string,
  }),
  createComicBookTitle: PropTypes.func.isRequired,
  fetchComicBookTitle: PropTypes.func.isRequired,
  updateComicBookTitle: PropTypes.func.isRequired,
  history: RRPropTypes.history.isRequired,
  match: RRPropTypes.match.isRequired,
};

ComicBookListTitle.defaultProps = {
  comicbooklist: {},
};

export default withRouter(container(ComicBookListTitle));
