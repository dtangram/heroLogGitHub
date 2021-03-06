import React from 'react';
import styles from './styles.module.css';
import logo from '../../img/logo.png';

class Empty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <React.Fragment>
        <article className={styles.loadMessageWrap}>
          <section>
            <img src={logo} alt="HeroLog Logo" />
          </section>

          <p className={styles.loadMessage}>Your List is Empty</p>
        </article>
      </React.Fragment>
    );
  }
}

export default (Empty);
