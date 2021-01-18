import React from 'react';
import { Modal } from '@material-ui/core';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import Link from '../../../link';
import questionanswer from '../../../img/question_answer.png';
import styles from './styles.module.css';
import container from './container';

class ModalMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      message: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.loadData();
  }

  componentDidMount() {
    const { fetchMessaging, match: { params: { id } } } = this.props;
    if (id) fetchMessaging(id);
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
      fetchMessaging,
    } = this.props;
    // if no id don't load the publisher
    if (!id) return;
    await fetchMessaging(id);
    // update the state with the data from the updated publisher
    const { messaging } = this.props;
    this.setState({ ...messaging });
  };

  save = (event) => {
    // make sure the form doesn't submit with the browser
    event.preventDefault();
    const {
      createMessaging,
      updateMessaging,
      match: {
        params: { id },
      },
      history,
    } = this.props;
    const { name, email, message } = this.state;
    if (id) {
      updateMessaging({
        id,
        name,
        email,
        message,
      });
    } else {
      createMessaging({
        name,
        email,
        message,
      })
        .then(() => history.push('/dashboard'));
    }
  };

  render() {
    const { open, setOpen } = React.useState(false);

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const {
      messaging: {
        id,
        name: defaultName = '',
        email: defaultEmail = '',
        message: defaultMessage = '',
      },
    } = this.props;

    const {
      name = defaultName,
      email = defaultEmail,
      message = defaultMessage,
    } = this.state;

    return (
      <div>
        <button type="button" onClick={handleOpen}>
          <img src={questionanswer} alt="" />
        </button>

        <Modal
          open={open}
          onClose={handleClose}
        >

          <div className={styles.cbList}>
            <p>
              {id && (
                `This is the message you sent
                ${name}
                ${email}
                ${message}`
              )}

              {!id && (
                'Send a Message'
              )}
            </p>

            <section className={styles.wrapper}>
              <form method="POST" onSubmit={this.save}>
                <article>
                  <fieldset>
                    <label htmlFor="name">
                      Name

                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={name}
                        onChange={this.handleInputChange}
                      />
                    </label>

                    <label htmlFor="email">
                      Email

                      <input
                        id="email"
                        type="text"
                        name="email"
                        value={email}
                        onChange={this.handleInputChange}
                      />
                    </label>

                    <textarea
                      id="message"
                      type="text"
                      name="message"
                      value={message}
                      onChange={this.handleInputChange}
                      rows="4"
                      placeholder="Message"
                    />
                  </fieldset>
                </article>

                <article>
                  <button type="button" onClick={handleClose}><Link url="/" title="CANCEL" /></button>

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
        </Modal>
      </div>
    );
  }
}

ModalMessage.propTypes = {
  messaging: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    message: PropTypes.string,
  }),

  createMessaging: PropTypes.func.isRequired,
  fetchMessaging: PropTypes.func.isRequired,
  updateMessaging: PropTypes.func.isRequired,
  history: RRPropTypes.history.isRequired,
  match: RRPropTypes.match.isRequired,
};

ModalMessage.defaultProps = {
  messaging: {},
};

export default container(ModalMessage);

// export default function SimpleModal() {
//   const [open, setOpen] = React.useState(false);
//
//   const handleOpen = () => {
//     setOpen(true);
//   };
//
//   const handleClose = () => {
//     setOpen(false);
//   };
//
//   return (
//     <div>
//       <button type="button" onClick={handleOpen}>
//         <img src={questionanswer} alt="" />
//       </button>
//
//       <Modal
//         open={open}
//         onClose={handleClose}
//       >
//
//         <div className={styles.cbList}>
//           <section className={styles.wrapper}>
//             <form method="POST">
//               <article>
//                 <fieldset>
//                   <label htmlFor="name">
//                     Name
//
//                     <input
//                       id="name"
//                       className={styles.inputBorder}
//                       type="text"
//                       name="author"
//                     />
//                   </label>
//
//                   <label htmlFor="email">
//                     Email
//
//                     <input
//                       id="email"
//                       className={styles.inputBorder}
//                       type="text"
//                       name="coverartist"
//                     />
//                   </label>
//
//                   <textarea rows="4" placeholder="Message" />
//                 </fieldset>
//               </article>
//
//               <article>
//                 <button type="button" onClick={handleClose}>
//                  <Link url="/" title="CANCEL" /></button>
//
//                 <input
//                   id="submitQ1"
//                   className={styles.submit}
//                   type="submit"
//                   value="SUBMIT"
//                 />
//               </article>
//             </form>
//           </section>
//         </div>
//       </Modal>
//     </div>
//   );
// }
