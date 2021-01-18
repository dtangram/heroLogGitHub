import React from 'react';
import facebook from '../../img/facebook.png';
import twitter from '../../img/twitter.png';
import instagram from '../../img/instagram.png';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <footer>
        <article>
          <p title="" />
          <section>
            <figure><img src={facebook} alt="Hero-Log Facebook" /></figure>
            <figure><img src={twitter} alt="Hero-Log Twitter" /></figure>
            <figure><img src={instagram} alt="Hero-Log Instagram" /></figure>
          </section>
        </article>
        <ul>
          <li title="Help">Help</li>
          <li> | </li>
          <li title="Hero-Log Privacy Policy">Privacy</li>
          <li> | </li>
          <li title="Hero-Log Terms of Use">Terms of Use</li>
        </ul>
      </footer>
    );
  }
}

export default Footer;
