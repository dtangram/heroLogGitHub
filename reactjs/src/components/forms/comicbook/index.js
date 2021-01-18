import React from 'react';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import aws from 'aws-sdk';
import FormErrors from '../../../formErrors';
import Link from '../../../link';
import SuccessDisplay from '../success';
// import '../../../css/main.css';
import styles from './styles.module.css';
import container from './container';
import API from '../../../API';

// const validate = require('validate.js');

class ComicBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      author: undefined,
      penciler: undefined,
      coverartist: undefined,
      inker: undefined,
      volume: undefined,
      year: undefined,
      comicBookCover: undefined,
      type: '',
      successMessage: '',
      formErrors: {
        title: '',
        type: '',
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.numInputChange = this.numInputChange.bind(this);
    this.goBack = this.goBack.bind(this);
    this.loadData();
  }

  componentDidMount() {
    window.scrollTo({
      top: 0,
    });

    const { fetchComicBook, match: { params: { coboTitleId } } } = this.props;
    if (coboTitleId) fetchComicBook(coboTitleId);

    this.inputFocus.focus();
  }

  handleFileInputChange = (event) => {
    document.getElementById('comicBookCover').disabled = false;
    const file = event.target.files[0];
    const fileSize = event.target.files[0].size;
    const fileParts = file.name.split('.');
    const fileName = file.name;
    // const fileName = fileParts[0];
    const fileType = fileParts[1];

    console.log('Preparing the upload');

    // get signed URL
    API.post('/sign_s3', {
      fileName,
      fileType,
    }).then((response) => {
      const { returnData } = response.data;
      const { signedRequest, url } = returnData;
      // this.setState({ comicBookCover: url });

      // upload image to s3 using that signed url
      // Put the fileType in the headers for the upload
      const options = {
        headers: {
          'Content-Type': fileType,
          'x-amz-acl': 'public-read',
        },
      };

      if (fileType === 'jpg' || fileType === 'png' || fileType === 'jpeg') {
        document.getElementById('comicBookCover').disabled = true;

        axios.put(signedRequest, file, fileType, options)
          .then((result) => {
            this.setState({ comicBookCover: url });
            document.querySelector('form > figure').style.display = 'inline-block';
            console.log('Response from s3');

            // AWS Rekognition to use params to filter out inappropritate images
            aws.config.update({
              region: 'us-east-2',
              accessKeyId: process.env.REACT_APP_AWSAccessKeyId,
              secretAccessKey: process.env.REACT_APP_AWSSecretKey,
            });

            const S3_BUCKET = 'dothanthorntonbucket';
            const rekognition = new aws.Rekognition();

            const params = {
              Image: {
                S3Object: {
                  Bucket: S3_BUCKET,
                  Name: fileName,
                },
              },

              // MaxLabels: 5,
              MinConfidence: 0,
            };

            // Identifies explicit images
            rekognition.detectModerationLabels(params, (err, data) => {
              if (err) {
                console.log('Error Message: ', err);
              } else {
                console.log('New Mod Label Data: ', data);

                data.ModerationLabels.map((nameModLabel) => {
                  console.log('Name Is: ', nameModLabel.Name);

                  if (nameModLabel.Name === 'Explicit Nudity' || nameModLabel.Name === 'Nudity' || nameModLabel.Name === 'Graphic Female Nudity' || nameModLabel.Name === 'Graphic Male Nudity' || nameModLabel.Name === 'Illustrated Explicit Nudity' || nameModLabel.Name === 'Sexual Activity' || nameModLabel.Name === 'Female Swimwear Or Underwear' || nameModLabel.Name === 'Male Swimwear Or Underwear' || nameModLabel.Name === 'Partial Nudity' || (nameModLabel.Name === 'Suggestive' && nameModLabel.Confidence > 90) || (nameModLabel.Name === 'Revealing Clothes' && nameModLabel.Confidence > 60)) {
                    document.getElementById('forbidContent').innerHTML = 'YOUR IMAGE IS INAPPROPRIATE.';

                    document.querySelector('form > figure').style.filter = 'blur(20px)';

                    window.scrollTo({
                      top: 0,
                    });

                    setTimeout(() => {
                      window.location.reload(false);
                    }, 2000);
                  } else {
                    clearTimeout(setTimeout(() => {
                      window.location.reload(false);
                    }, 2000));
                  }

                  return nameModLabel;
                }).filter(nameModLabel => nameModLabel !== undefined);
              }
            });

            // Identifies properties in images and can be used to fitler inappropritate images
            rekognition.detectLabels(params, (err, data) => {
              if (err) {
                console.log('Error Message: ', err);
              } else {
                console.log('New Label Data: ', data);

                data.Labels.map((nameLabel) => {
                  console.log('Name Is: ', nameLabel.Name);

                  if ((nameLabel.Confidence > 48 && nameLabel.Name === 'Lingerie') || (nameLabel.Confidence > 48 && nameLabel.Name === 'Panties') || (nameLabel.Confidence > 48 && nameLabel.Name === 'Underwear') || (nameLabel.Confidence > 48 && nameLabel.Name === 'Bra') || (nameLabel.Confidence > 48 && nameLabel.Name === 'Thong') || (nameLabel.Confidence > 48 && nameLabel.Name === 'Thigh') || (nameLabel.Confidence > 48 && nameLabel.Name === 'Swimwear')) {
                    document.getElementById('forbidContent').innerHTML = 'YOUR IMAGE IS INAPPROPRIATE.';

                    document.querySelector('form > figure').style.filter = 'blur(20px)';

                    window.scrollTo({
                      top: 0,
                    });

                    setTimeout(() => {
                      window.location.reload(false);
                    }, 2000);
                  } else {
                    clearTimeout(setTimeout(() => {
                      window.location.reload(false);
                    }, 2000));
                  }

                  return nameLabel;
                }).filter(nameLabel => nameLabel !== undefined);
              }
            });
            //
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        document.getElementById('comicBookCover').disabled = false;
        window.location.reload(false);
        console.log('fileType: ', fileType);
        alert('Image needs to have a .jpeg, .jpg  or .png file extension.');
      }

      if (fileSize > 1e6) {
        document.getElementById('comicBookCover').disabled = false;
        window.location.reload(false);
        console.log('fileSize: ', fileSize);
        alert('Image size needs to be smaller than 1MB');
      }
    }).catch((error) => {
      console.log(error);
    });
  };

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  numInputChange = (event, numSelect) => {
    const regex = /^[0-9\b]+$/;
    if (event.target.value === '' || regex.test(event.target.value)) {
      this.setState({ [numSelect]: event.target.value });
    }
  };

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
      // history,
    } = this.props;
    const {
      title, author, penciler, coverartist, inker, volume, year,
      comicBookCover, type,
    } = this.state;

    const isValid = this.validateFields();

    if (id && isValid && title.length >= 1 && type) {
      updateComicBook({
        id,
        title,
        author,
        penciler,
        coverartist,
        inker,
        volume,
        year,
        comicBookCover,
        type,
      }).then(() => this.setState({ successMessage: 'success' }));
    } else if (!id && title.length >= 1 && type) {
      createComicBook({
        title,
        author,
        penciler,
        coverartist,
        inker,
        volume,
        year,
        comicBookCover,
        type,
        comicbooktitlerelId: coboTitleId,
      }).then(() => this.setState({ successMessage: 'success' }));
    }

    // if (id && isValid) {
    //   updateComicBook({
    //     id,
    //     title,
    //     author,
    //     penciler,
    //     coverartist,
    //     inker,
    //     volume,
    //     year,
    //     type,
    //   }).then(() => {
    //     if (title.length >= 1 && type) {
    //       history.push(`/dashboard/${coboTitleId}/comicbooklistissues`);
    //     }
    //   });
    // } else if (!id && isValid) {
    //   createComicBook({
    //     title,
    //     author,
    //     penciler,
    //     coverartist,
    //     inker,
    //     volume,
    //     year,
    //     type,
    //     comicbooktitlerelId: coboTitleId,
    //   }).then(() => {
    //     if (title.length >= 1 && type) {
    //       history.push(`/dashboard/${coboTitleId}/comicbooklistissues`);
    //     }
    //   });
    // }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
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

  goBack() {
    const { history } = this.props;
    history.goBack();
  }

  render() {
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
        comicBookCover: defaultSetComicImage = '',
      },
      history,
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
      comicBookCover = defaultSetComicImage,
      type,
      formErrors,
      successMessage,
    } = this.state;

    return (
      <React.Fragment>
        <article id="cbComicForm" className={styles.cbWrapper}>
          <button className={styles.backLink} type="button" onClick={() => history.goBack()}>Back</button>

          <h1>
            {id && (
              `Edit ${title}`
            )}

            {!id && (
              'Add Comic Book'
            )}
            <figure className={styles.graphic} alt="Small burgandy, rectangle graphic." />
          </h1>

          <article className={styles.cbList}>
            {(formErrors.title.length <= 0 || !type) && successMessage === 'success' && <SuccessDisplay />}

            <section className={styles.wrapper}>
              <form method="POST" onSubmit={this.save}>
                <FormErrors formErrors={formErrors} />

                <p id="forbidContent" />

                <figure><img src={comicBookCover} alt={title} /></figure>

                <article>
                  <fieldset>
                    <label htmlFor="comicBookCover">
                      Comic Book Cover

                      <input
                        id="comicBookCover"
                        className={styles.inputBorder}
                        type="file"
                        name="comicBookCover"
                        onInput={this.handleInputChange}
                        onChange={this.handleFileInputChange}
                      />
                    </label>

                    <label htmlFor="title">
                      Title

                      <input
                        ref={(input) => { this.inputFocus = input; }}
                        id="title"
                        className={styles.inputBorder}
                        placeHolder="Example: Amazing Spider-Man #300"
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
                        type="number"
                        name="volume"
                        value={volume}
                        onChange={event => this.numInputChange(event, 'volume')}
                      />
                    </label>

                    <label htmlFor="year">
                      Year

                      <input
                        id="year"
                        className={styles.inputBorder}
                        type="text"
                        maxLength="4"
                        name="year"
                        value={year}
                        onChange={event => this.numInputChange(event, 'year')}
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
          </article>
        </article>
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
    comicBookCover: PropTypes.string,
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

export default withRouter(container(ComicBook));
