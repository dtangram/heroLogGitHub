import React from 'react';
// import {
//   Collapse,
//   Navbar,
//   NavbarToggler,
//   Nav,
//   NavItem,
//   NavLink,
//   Container,
// } from 'reactstrap';
// import { NavLink as RRNavLink } from 'react-router-dom';
import '../../css/main.css';
// import { BeatLoader } from 'react-spinners';
// import styles from './styles.module.css';
// import styles from './styles.module.css';
import logo from '../../img/logo.png';
// import heroBck from '../../img/comicsHeader.jpg';
import numberOne from '../../img/numberOne.png';
import numberTwo from '../../img/numberTwo.png';
import numberThree from '../../img/numberThree.png';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // isOpen: false,
      // isLoading: true,
    };

    // this.demoAsyncCall();
    // this.demoAsyncCall = () => new Promise(resolve => setTimeout(() => resolve(), 2500));
  }

  componentDidMount() {
    window.scrollTo({
      top: 0,
    });

    // this simulates an async action, after which the component will render the content
    // const demoAsyncCall = () => new Promise(resolve => setTimeout(() => resolve(), 2500));
    // this.demoAsyncCall().then(() => this.setState({ isLoading: false }));
    // window.addEventListener('load', () => {
    //   this.setState({ isLoading: false });
    // });
    // const demoAsyncCall = async () => {
    //   await (resolve => setTimeout(() => resolve(), 2500));
    // };
    //
    // demoAsyncCall().then(() => this.setState({ isLoading: false }));
  }

  // demoAsyncCall = () => new Promise(resolve => setTimeout(() => resolve(), 2500));

  // toggle = () => {
  //   const { isOpen } = this.state;
  //   this.setState({
  //     isOpen: !isOpen,
  //   });
  // };

  // demoAsyncCall = () => new Promise(resolve => setTimeout(() => resolve(), 2500));

  render() {
    // const { isOpen } = this.state;

    // const { isLoading } = this.state;
    //
    // if (isLoading) {
    //   return (
    //     <article className={styles.loader}>
    //       <BeatLoader loading />
    //       Loading...
    //     </article>
    //   );
    //   // return null; // render null when app is not ready
    // }

    return (
      <React.Fragment>
        {
          // <header className="fixed-top">
          //   <article className="logoWrap">
          //     <RRNavLink to="/landing">
          //       <section className="logo">
          //         <figure>
          //           <img src={logo} title="Hero-Log Home" alt="Hero-Log Logo" />
          //         </figure>
          //         <h1>Hero-Log</h1>
          //       </section>
          //     </RRNavLink>
          //   </article>
          //
          //   <Navbar dark expand="lg" className={styles.nav}>
          //     <Container>
          //       <NavbarToggler onClick={this.toggle} />
          //       <Collapse id="navbarResponsive" isOpen={isOpen} navbar>
          //         <Nav className="mr-auto" navbar>
          //           <NavItem className={styles.slideUnder}>
          //             <NavLink
          //               tag={RRNavLink}
          //               exact
          //               activeClassName={styles.active}
          //               className={styles.link}
          //               to="/landing"
          //             >
          //               HOME
          //             </NavLink>
          //           </NavItem>
          //
          //           <NavItem className={styles.slideUnder}>
          //             <NavLink
          //               tag={RRNavLink}
          //               activeClassName={styles.active}
          //               className={styles.link}
          //               to="/signup"
          //             >
          //               SIGNUP
          //             </NavLink>
          //           </NavItem>
          //
          //           <NavItem className={styles.slideUnder}>
          //             <NavLink
          //               tag={RRNavLink}
          //               activeClassName={styles.active}
          //               className={styles.link}
          //               to="/signin"
          //             >
          //               SIGNIN
          //             </NavLink>
          //           </NavItem>
          //         </Nav>
          //       </Collapse>
          //     </Container>
          //   </Navbar>
          //
          //   <figure className="bckColor" />
          // </header>
        }

        <section>
          <h1>
            Digitize Your
            <br />
            Comic Book Collection
            <figure className="graphic" alt="Small burgandy, rectangle graphic." />
          </h1>

          <figure id="bck" alt="Collage of X-Men Comic Books" />
        </section>

        <section>
          <figure className="logo_graphic"><img src={logo} alt="Hero-Log logo" /></figure>

          <h2>Subscription Options</h2>
          <figure className="graphic" alt="Small burgandy, rectangle graphic." />

          <article className="container">
            <section className="row">
              <article className="cardWrap col-sm-12 col-md-12 col-lg-4">

                <section className="card">
                  <figure className="logo_graphic"><img src={numberOne} alt="" /></figure>

                  <article className="card-body">
                    <h3>Free</h3>
                    <h4>With Limited Storage Capacity</h4>
                    <p>
                      Storage is 30 GB. Collectors are not able to buy, sell or trade comics.
                    </p>
                    <button type="button" name="button">Sign Up</button>
                  </article>
                </section>
              </article>

              <article className="cardWrap col-sm-12 col-md-12 col-lg-4">
                <section className="card">
                  <figure className="logo_graphic"><img src={numberTwo} alt="" /></figure>

                  <article className="card-body">
                    <h3>5.99/Month - 60 Day Trial</h3>
                    <h4>Storage of 60 GB</h4>
                    <p>
                      Collectors are only able to buy and trade comics with this
                      option, and are able to send and receive messages to other
                      collectors on the Website.
                    </p>
                    <button type="button" name="button">Start Free Trial</button>
                  </article>
                </section>
              </article>

              <article className="cardWrap col-sm-12 col-md-12 col-lg-4">
                <section className="card">
                  <figure className="logo_graphic"><img src={numberThree} alt="" /></figure>

                  <article className="card-body">
                    <h3>8.99/Month - 70 Day Trial</h3>
                    <h4>Unlimited Storage</h4>
                    <p>
                      With this option, collectors can buy, sell or trade comics,
                      and are able to send and receive messages to other collectors
                      on the Website.
                    </p>
                    <button type="button" name="button">Start Free Trial</button>
                  </article>
                </section>
              </article>
            </section>
          </article>
        </section>

        <section>
          <div className="logo_graphic"><img src={logo} alt="" /></div>

          <h2>What We Offer</h2>
          <figure className="graphic" alt="Small burgandy, rectangle graphic." />

          <article className="container">
            <section className="row">
              <article className="cardWrap col-sm-12 col-md-12 col-lg-4">
                <section className="card">
                  <figure />
                  <p>Easily Catalouge Your Comic Books</p>
                </section>
              </article>

              <article className="cardWrap col-sm-12 col-md-12 col-lg-4">
                <section className="card">
                  <figure />
                  <p>No purchasing duplicate comics</p>
                </section>
              </article>

              <article className="cardWrap col-sm-12 col-md-12 col-lg-4">
                <section className="card">
                  <figure />
                  <p>Buy, sale and trade comic books</p>
                </section>
              </article>
            </section>
          </article>
        </section>

        <section className="comicSaleWrapper">
          <div className="logo_graphic"><img src={logo} alt="" /></div>

          <h2>Comics for Sale</h2>
          <figure className="graphic" alt="Small burgandy, rectangle graphic." />

          <article className="container">
            <section className="row">
              <article className="cardWrap col-sm-12 col-md-12 col-lg-3">
                <section className="card" />
              </article>
              <article className="cardWrap col-sm-12 col-md-12 col-lg-3">
                <section className="card" />
              </article>
              <article className="cardWrap col-sm-12 col-md-12 col-lg-3">
                <section className="card" />
              </article>
              <article className="cardWrap col-sm-12 col-md-12 col-lg-3">
                <section className="card" />
              </article>
            </section>
          </article>
        </section>
      </React.Fragment>
    );
  }
}

export default Landing;
