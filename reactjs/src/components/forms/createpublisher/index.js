import React from 'react';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import FormErrors from '../../../formErrors';
import Link from '../../../link';
import SuccessDisplay from '../success';
// import '../../../css/main.css';
import styles from './styles.module.css';
import container from './container';

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      publisherName: '',
      successMessage: '',
      formErrors: {
        publisherName: '',
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.loadData();
  }

  componentDidMount() {
    window.scrollTo({
      top: 0,
    });

    const { fetchPublisher, match: { params: { id } } } = this.props;
    if (id) fetchPublisher(id);

    this.inputFocus.focus();
  }

  handleInputChange = (event) => {
    // console.log("event.target.value", event.target.value);
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  loadData = async () => {
    const {
      match: {
        params: { id },
      },
      fetchPublisher,
    } = this.props;
    // if no id don't load the publisher
    if (!id) return;
    await fetchPublisher(id);
    // update the state with the data from the updated publisher
    const { publisher } = this.props;
    this.setState({ ...publisher });
  };

  save = async (event) => {
    // make sure the form doesn't submit with the browser
    event.preventDefault();
    const {
      createPublisher,
      updatePublisher,
      match: {
        params: { id },
      },
      // history,
    } = this.props;
    const { publisherName } = this.state;

    const isValid = this.validateFields();

    const userId = localStorage.getItem('id');

    if (id && isValid && publisherName.length >= 1) {
      await updatePublisher({
        id,
        publisherName,
      }).then(() => this.setState({ successMessage: 'success' }));
    } else if (!id && publisherName.length >= 1) {
      await createPublisher({ publisherName, collectpubUsersId: userId })
        .then(() => this.setState({ successMessage: 'success' }));
    }

    // if (id && isValid) {
    //   await updatePublisher({
    //     id,
    //     publisherName,
    //   }).then(() => {
    //     if (publisherName.length >= 2) {
    //       history.push('/dashboard');
    //     }
    //   });
    // } else if (!id && isValid) {
    //   await createPublisher({ publisherName })
    //     .then(() => {
    //       if (publisherName.length >= 2) {
    //         history.push('/dashboard');
    //       }
    //     });
    // }
  };

  async validateFields(fieldName, value) {
    const {
      publisherName,
    } = this.state;

    const currentPublisherValid = publisherName.length >= 1;

    this.setState({
      formErrors: {
        publisherName: currentPublisherValid ? '' : 'Publisher name is required',
      },
    });

    return currentPublisherValid;
  }

  render() {
    const userId = localStorage.getItem('id');

    const {
      publisher: {
        id,
        publisherName: defaultPublisherName = '',
      },
    } = this.props;

    const {
      publisherName = defaultPublisherName,
      formErrors,
      successMessage,
    } = this.state;

    return (
      <React.Fragment>
        <article id="cbCreate" className={styles.cbWrapper}>
          <h1>
            {id && (
              `Edit ${publisherName}`
            )}

            {!id && (
              'Create Collection'
            )}
            <figure className={styles.graphic} alt="Small burgandy, rectangle graphic." />
          </h1>

          <article className={styles.cbList}>
            {formErrors.publisherName.length <= 0 && successMessage === 'success' && <SuccessDisplay />}

            <section className={styles.wrapper}>
              <form method="POST" onSubmit={this.save}>
                <FormErrors formErrors={formErrors} />

                <fieldset>
                  <label htmlFor="publisherName">
                    Publisher Name

                    <input
                      ref={(input) => { this.inputFocus = input; }}
                      id="publisherName"
                      className={styles.inputBorder}
                      type="text"
                      name="publisherName"
                      value={publisherName}
                      onChange={this.handleInputChange}
                    />
                  </label>
                </fieldset>

                <article>
                  <p><Link url={`/dashboard/${userId}`} title="CANCEL" /></p>

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

Create.propTypes = {
  publisher: PropTypes.shape({
    id: PropTypes.string,
    publisherName: PropTypes.string,
  }),
  createPublisher: PropTypes.func.isRequired,
  fetchPublisher: PropTypes.func.isRequired,
  updatePublisher: PropTypes.func.isRequired,
  // history: RRPropTypes.history.isRequired,
  match: RRPropTypes.match.isRequired,
};

Create.defaultProps = {
  publisher: {},
};

export default container(Create);
