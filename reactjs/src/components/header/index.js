import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Container,
} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
// import '../../css/main.css';
import styles from './styles.module.css';
import logo from '../../img/logo.png';
import container from './container';

const HeaderTemp = ({
  user,
  signins,
  history,
  logout,
  fetchLoginUser,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const screenwidth = window.innerWidth <= 991;

  React.useEffect(() => {
    fetchLoginUser();
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    if (signins.id) {
      fetchLoginUser();
    }
    // eslint-disable-next-line
  }, [signins])

  const toggle = () => {
    setIsOpen(prevIsOpen => !prevIsOpen);
    // const { isOpen } = this.state;
    //  this.setState({
    //   isOpen: !isOpen,
    // });
  };

  const toggleMenuItem = () => {
    if (screenwidth) {
      setIsOpen(prevIsOpen => !prevIsOpen);
    }
  };

  const logUserOut = () => {
    // const { history, logout } = this.props;
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('data');
    localStorage.removeItem('reloadApp');
    // create action to reset store (set store to initialState);
    logout().then(() => history.push('/landing'));
  };
  // const { user } = this.props;
  // const { isOpen } = this.state;

  const userId = localStorage.getItem('id');

  return (
    <header className="fixed-top">
      {!user.data && (
        <React.Fragment>
          <article className="logoWrap">
            <RRNavLink to="/landing">
              <section className="logo">
                <figure>
                  <img src={logo} title="Hero-Log Home" alt="Hero-Log Logo" />
                </figure>
                <h1>Hero-Log</h1>
              </section>
            </RRNavLink>
          </article>

          <Navbar dark expand="lg" className={styles.nav}>
            <Container>
              <NavbarToggler onClick={toggle} />
              <Collapse id="navbarResponsive" isOpen={isOpen} navbar>
                <Nav className="mr-auto" navbar>
                  <NavItem className={styles.slideUnder}>
                    <NavLink
                      tag={RRNavLink}
                      exact
                      activeClassName={styles.active}
                      className={styles.link}
                      to="/landing"
                      onClick={toggleMenuItem}
                    >
                      HOME
                    </NavLink>
                  </NavItem>

                  <NavItem className={styles.slideUnder}>
                    <NavLink
                      tag={RRNavLink}
                      activeClassName={styles.active}
                      className={styles.link}
                      to="/signup"
                      onClick={toggleMenuItem}
                    >
                      SIGNUP
                    </NavLink>
                  </NavItem>

                  <NavItem className={styles.slideUnder}>
                    <NavLink
                      tag={RRNavLink}
                      activeClassName={styles.active}
                      className={styles.link}
                      to="/signin"
                      onClick={toggleMenuItem}
                    >
                      SIGNIN
                    </NavLink>
                  </NavItem>
                </Nav>
              </Collapse>
            </Container>
          </Navbar>
        </React.Fragment>
      )}

      {user.data && (
        <React.Fragment>
          <article className="logoWrap">
            <RRNavLink to="/">
              <section className="logo">
                <figure>
                  <img src={logo} title="Hero-Log Home" alt="Hero-Log Logo" />
                </figure>
                <h1>Hero-Log</h1>
              </section>
            </RRNavLink>
          </article>

          <Navbar dark expand="lg" className={styles.nav}>
            <Container>
              <NavbarToggler onClick={toggle} />
              <Collapse id="navbarResponsive" isOpen={isOpen} navbar>
                <Nav className="mr-auto" navbar>
                  <NavItem className={styles.slideUnder}>
                    <NavLink
                      tag={RRNavLink}
                      exact
                      activeClassName={styles.active}
                      className={styles.link}
                      to="/"
                      onClick={toggleMenuItem}
                    >
                      HOME
                    </NavLink>
                  </NavItem>

                  <NavItem className={styles.slideUnder}>
                    <NavLink
                      tag={RRNavLink}
                      activeClassName={styles.active}
                      className={styles.link}
                      to={`/dashboard/${userId}`}
                      onClick={toggleMenuItem}
                    >
                      DASHBOARD
                    </NavLink>
                  </NavItem>

                  <NavItem className={styles.slideUnder}>
                    <NavLink
                      tag={RRNavLink}
                      activeClassName={styles.active}
                      className={styles.link}
                      to={`/forms/createpublisher/new/${userId}`}
                      onClick={toggleMenuItem}
                    >
                      CREATE
                    </NavLink>
                  </NavItem>

                  <NavItem className={styles.slideUnder}>
                    <NavLink
                      tag={RRNavLink}
                      activeClassName={styles.active}
                      className={styles.link}
                      to={`/fixer/${userId}`}
                      onClick={toggleMenuItem}
                    >
                      Fixer
                    </NavLink>
                  </NavItem>

                  <NavItem className={styles.slideUnder}>
                    <NavLink
                      tag={RRNavLink}
                      activeClassName={styles.active}
                      className={styles.link}
                      to={`/sale/${userId}`}
                      onClick={toggleMenuItem}
                    >
                      SALE
                    </NavLink>
                  </NavItem>

                  <NavItem className={styles.slideUnder}>
                    <NavLink
                      tag={RRNavLink}
                      activeClassName={styles.active}
                      className={styles.link}
                      to={`/wishlist/${userId}`}
                      onClick={toggleMenuItem}
                    >
                      WISH
                    </NavLink>
                  </NavItem>

                  <NavItem className={styles.slideUnder}>
                    <NavLink
                      tag={RRNavLink}
                      activeClassName={styles.active}
                      className={styles.link}
                      to={`/profile/${userId}`}
                      onClick={toggleMenuItem}
                    >
                      PROFILE
                    </NavLink>
                  </NavItem>

                  <NavItem className={styles.slideUnder}>
                    <NavLink
                      to=""
                      tag={RRNavLink}
                      activeClassName={styles.active}
                      className={styles.link}
                      onClick={() => { logUserOut(); toggleMenuItem(); }}
                    >
                      SIGNOUT
                    </NavLink>
                  </NavItem>
                </Nav>
              </Collapse>
            </Container>
          </Navbar>
        </React.Fragment>
      )}
    </header>
  );
};

HeaderTemp.propTypes = {
  fetchLoginUser: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  history: RRPropTypes.history.isRequired,
  user: PropTypes.shape({
    data: PropTypes.shape({
      id: PropTypes.string,
    }),
    // isLoading: PropTypes.bool.isRequired
  }).isRequired,
  signins: PropTypes.shape({
    id: PropTypes.string,
    // isLoading: PropTypes.bool.isRequired
  }).isRequired,
};

export default container(HeaderTemp);
