import React from 'react';
import styles from './styles.module.css';

class SuccessDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles.successSection} role="alert">
          <strong>Awesome! </strong>
          Check your email to reset your password.
        </div>

        {
          // <section className={styles.successSection}>
          //   <p>You've Successfully Logged In!</p>
          // </section>
        }
      </React.Fragment>
    );
  }
}

export default (SuccessDisplay);
