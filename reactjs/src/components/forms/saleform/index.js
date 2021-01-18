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

class SaleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comicBookTitle: '',
      comicBookVolume: undefined,
      comicBookYear: undefined,
      comicBookPublisher: undefined,
      comicBookCover: undefined,
      type: '',
      successMessage: '',
      formErrors: {
        comicBookTitle: '',
        type: '',
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.numInputChange = this.numInputChange.bind(this);
    this.goBack = this.goBack.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.loadData();
  }

  componentDidMount() {
    window.scrollTo({
      top: 0,
    });

    const { fetchSale, match: { params: { id } } } = this.props;
    if (id) fetchSale(id);

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
        // this.setState({ comicBookCover: `${fileName}.${fileType}` });
        // const { comicBookCover } = this.state;
        axios.put(signedRequest, file, fileType, options)
          .then((result) => {
            this.setState({ comicBookCover: url });
            document.querySelector('form > article > fieldset figure').style.display = 'inline-block';
            console.log('Response from s3');

            // AWS Rekognition to use params to filter out inappropritate images
            aws.config.update({
              region: 'us-east-2',
              accessKeyId: 'AKIAX6ZHFRPEDJCJPDOG',
              secretAccessKey: '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',
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

                    document.querySelector('form > article > fieldset figure').style.filter = 'blur(20px)';

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

                    document.querySelector('form > article > fieldset figure').style.filter = 'blur(20px)';

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
        // axios.get('/');
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
      fetchSale,
    } = this.props;
    // if no id don't load the item
    if (!id) return;
    await fetchSale(id);
    // update the state with the data from the updated item
    const { sale } = this.props;
    this.setState({ ...sale });
  };

  save = (event) => {
    // make sure the form doesn't submit with the browser
    event.preventDefault();
    const {
      createSale,
      updateSale,
      match: {
        params: { id },
      },
      // history,
    } = this.props;
    const {
      comicBookTitle, comicBookVolume, comicBookYear, comicBookPublisher, type,
      comicBookCover,
    } = this.state;

    const isValid = this.validateFields();

    const userId = localStorage.getItem('id');

    if (id && isValid && comicBookTitle.length >= 1 && type) {
      updateSale({
        id,
        comicBookTitle,
        comicBookVolume,
        comicBookYear,
        comicBookPublisher,
        comicBookCover,
        type,
      }).then(() => this.setState({ successMessage: 'success' }));
    } else if (!id && comicBookTitle.length >= 1 && type) {
      createSale({
        comicBookTitle,
        comicBookVolume,
        comicBookYear,
        comicBookPublisher,
        comicBookCover,
        type,
        saleUsersId: userId,
      })
        .then(() => this.setState({ successMessage: 'success' }));
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  handleChange = (event) => {
    this.setState({
      type: event.target.value,
    });
  }

  // handleFileInputChange = (event) => {
  //   this.setState({
  //     // comicBookCover: event.target.files[0],
  //     comicBookCover: event.target.files[0].name,
  //   });
  // }
  //
  // onClickHandler = () => {
  //   const { createSale } = this.props;
  //   createSale();
  // }

  async validateFields(fieldName, value) {
    const {
      comicBookTitle,
      type,
    } = this.state;

    const currentComicBookTitleValid = comicBookTitle.length >= 1;
    const currentTypeValid = type;

    this.setState({
      formErrors: {
        comicBookTitle: currentComicBookTitleValid ? '' : 'Comic Book title is required',
        type: currentTypeValid ? '' : 'Comic Book type is required',
      },
    });

    return currentComicBookTitleValid && currentTypeValid;
  }

  goBack() {
    const { history } = this.props;
    history.goBack();
  }

  render() {
    const userId = localStorage.getItem('id');

    const {
      sale: {
        id,
        comicBookTitle: defaultComicBookTitle = '',
        comicBookVolume: defaultComicBookVolume = '',
        comicBookYear: defaultComicBookYear = '',
        comicBookPublisher: defaultComicBookPublisher = '',
        comicBookCover: defaultSetComicImage = '',
      },
      history,
    } = this.props;

    const {
      comicBookTitle = defaultComicBookTitle,
      comicBookVolume = defaultComicBookVolume,
      comicBookYear = defaultComicBookYear,
      comicBookPublisher = defaultComicBookPublisher,
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
              `Edit ${comicBookTitle}`
            )}

            {!id && (
              'Add Comic Sale'
            )}
            <figure className={styles.graphic} alt="Small burgandy, rectangle graphic." />
          </h1>

          <article className={styles.cbList}>
            {(formErrors.comicBookTitle.length <= 0 || !type) && successMessage === 'success' && <SuccessDisplay />}

            <section className={styles.wrapper}>
              <form method="POST" onSubmit={this.save}>
                <FormErrors formErrors={formErrors} />

                <p id="forbidContent" />

                <article>
                  <fieldset>
                    <figure><img src={comicBookCover} alt={comicBookTitle} /></figure>

                    <label htmlFor="comicBookCover">
                      Comic Book Cover

                      <input
                        id="comicBookCover"
                        className={styles.inputBorder}
                        type="file"
                        name="comicBookCover"
                        // value={this.comicBookCover}
                        onInput={this.handleInputChange}
                        onChange={this.handleFileInputChange}
                        // disabled={comicBookCover}
                      />

                      {
                        // <input
                        //   id="comicBookCover"
                        //   className={styles.inputBorder}
                        //   type="file"
                        //   name="comicBookCover"
                        //   value={comicBookCover}
                        //   ref={(ref) => { this.uploadInput = ref; }}
                        //   onChange={this.handleInputChange}
                        //   onClick={() => this.handleFileInputChange}
                        // />
                      }
                    </label>

                    <label htmlFor="comicBookTitle">
                      Title & Issue Number

                      <input
                        ref={(input) => { this.inputFocus = input; }}
                        id="comicBookTitle"
                        className={styles.inputBorder}
                        placeholder="Example: Amazing Spider-Man #300"
                        type="text"
                        name="comicBookTitle"
                        value={comicBookTitle}
                        onChange={this.handleInputChange}
                      />
                    </label>

                    <label htmlFor="comicBookVolume">
                      Volume

                      <input
                        id="comicBookVolume"
                        className={styles.inputBorder}
                        type="number"
                        name="comicBookVolume"
                        value={comicBookVolume}
                        onChange={event => this.numInputChange(event, 'comicBookVolume')}
                      />
                    </label>

                    <label htmlFor="comicBookYear">
                      Year

                      <input
                        id="comicBookYear"
                        className={styles.inputBorder}
                        type="text"
                        maxLength="4"
                        name="comicBookYear"
                        value={comicBookYear}
                        onChange={event => this.numInputChange(event, 'comicBookYear')}
                      />
                    </label>

                    <label htmlFor="comicBookPublisher">
                      Publisher

                      <input
                        id="comicBookPublisher"
                        className={styles.inputBorder}
                        type="text"
                        name="comicBookPublisher"
                        value={comicBookPublisher}
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
                  <p><Link url={`/sale/${userId}`} title="CANCEL" /></p>

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

SaleForm.propTypes = {
  sale: PropTypes.shape({
    id: PropTypes.string,
    comicBookTitle: PropTypes.string,
    comicBookVolume: PropTypes.number,
    comicBookYear: PropTypes.number,
    comicBookPublisher: PropTypes.string,
    comicBookCover: PropTypes.string,
    type: PropTypes.string,
  }),
  createSale: PropTypes.func.isRequired,
  fetchSale: PropTypes.func.isRequired,
  updateSale: PropTypes.func.isRequired,
  history: RRPropTypes.history.isRequired,
  match: RRPropTypes.match.isRequired,
};

SaleForm.defaultProps = {
  sale: {},
};

export default withRouter(container(SaleForm));
