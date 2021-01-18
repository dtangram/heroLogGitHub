import React from 'react';
// import PropTypes from 'prop-types';
// import '../../../css/main.css';
import styles from './styles.module.css';

class Fixer extends React.Component {
  constructor(props) {
    const fixerData = localStorage.getItem('data');
    // fixerData.replace(/['"]+/g, '');
    super(props);
    this.state = {
      fixerData,
    };

    // props.fetchSales();
  }

  render() {
    const { fixerData } = this.state;

    return (
      <React.Fragment>
        <article id="cbFixer" className={styles.cbWrap}>
          <h1>
            Currency Conversion
            <figure className={styles.graphic} alt="Small burgandy, rectangle graphic." />
          </h1>

          <article className={styles.cbList}>
            <section>
              <p>
                Below are a number of common world currencies, all relative to the
                 currency EUR and time stamped at the exact time they were
                 collected.
              </p>
              <article>
                <textarea
                  id="message"
                  type="text"
                  name="message"
                  defaultValue={fixerData}
                />
              </article>
            </section>
          </article>
        </article>
      </React.Fragment>
    );
  }
}

export default Fixer;
