import React from 'react';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import { Container, Row, Col } from 'reactstrap';
import { Link as RRLink } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import MessageIcon from '@material-ui/icons/Message';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import EmptySalesHomepage from '../emptySalesHomepage/emptySalesHomepage';
// import { BeatLoader } from 'react-spinners';
// import questionanswer from '../../img/question_answer.png';
import '../../css/main.css';
import styles from './styles.module.css';
import logo from '../../img/logo.png';
// import heroBck from '../../img/comicsHeader.jpg';
// import cb1 from '../../img/item1.jpg';
// import cb2 from '../../img/item2.jpg';
// import cb3 from '../../img/item3.jpg';
// import cb4 from '../../img/item4.jpg';
import container from './container';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // isLoading: true,
    };

    props.fetchALLSales();
  }

  componentDidMount() {
    const { fetchALLSales, match: { params: { id } } } = this.props;
    fetchALLSales(id);

    // await API.get('/salelistALL/').then((res) => {
    //   const userMessIds = res.map(userMessId => userMessId.saleUsersId);
    //   this.setState({ userMessIds });
    //   console.log('ID: ', res.map(userMessId => userMessId.saleUsersId));
    // });

    // this simulates an async action, after which the component will render the content
    // const demoAsyncCall = () => new Promise(resolve => setTimeout(() => resolve(), 2500));
    // this.demoAsyncCall().then(() => this.setState({ isLoading: false }));
    // window.addEventListener('load', () => {
    //   this.setState({ isLoading: false });
    // });

    // this.setState({ isLoading: false });

    // document.getElementById('#newLoader').style.display = 'none';


    window.scrollTo({
      top: 0,
    });

    // const demoAsyncCall = async () => {
    //   await (resolve => setTimeout(() => resolve(), 2500));
    // };
    //
    // demoAsyncCall().then(() => this.setState({ isLoading: false }));
  }

  render() {
    const userId = localStorage.getItem('id');
    const { user = {}, salesALL, isLoading } = this.props;

    if (!localStorage.getItem('reloadApp')) {
      localStorage.reloadApp = true;
      window.location.reload();
    }

    // const { isLoading } = this.state;
    //
    // if (isLoading !== false) {
    //   return (
    //     <article className={styles.loader}>
    //       <BeatLoader loading />
    //       Loading...
    //     </article>
    //   );
    // }

    return (
      <React.Fragment>
        <article className={styles.homeSection}>
          <section>
            {user && (
              <h1 key={user.id}>
                Welcome,&nbsp;
                {user.firstname}
                <Col className={styles.graphic} alt="Small burgandy, rectangle graphic." />
              </h1>
            )}

            <figure id="bck" alt="Collage of X-Men Comic Books" />
          </section>

          <section className={styles.comicSaleWrapper}>
            <figure className={styles.logo_graphic}><img src={logo} alt="Logo graphic" /></figure>

            <h2>Comics for Sale</h2>
            <figure className={styles.graphic} alt="Small burgandy, rectangle graphic." />

            <article className={styles.viewMess}>
              <RRLink to={`/viewMessages/${userId}`}>
                <figure><MessageIcon /></figure>
                <p className="link">View Messages</p>
              </RRLink>
            </article>

            <Container fluid className={styles.container}>
              <Row className={styles.row}>
                {
                  salesALL.length === 0
                  && !isLoading ? <EmptySalesHomepage /> : <EmptySalesHomepage /> === null
                }

                {isLoading && (
                  <React.Fragment>
                    <article className={styles.loadMessageWrap}>
                      <section>
                        <img src={logo} alt="HeroLog Logo" />
                      </section>

                      <section className={styles.loadWrap}>
                        <p className={styles.loadMessage}>Loading</p>
                        <BeatLoader size={10} color="#770422" />
                      </section>
                    </article>
                  </React.Fragment>
                )}

                {!isLoading && salesALL.length > 0
                  && salesALL.map(saleHome => (
                    <Col sm="12" md="3" className={styles.issueWrap} key={saleHome.id}>
                      <figure>
                        <img src={saleHome.comicBookCover} alt={saleHome.comicBookTitle} />
                      </figure>

                      {
                        // <h3>{saleHome.comicBookTitle}</h3>
                      }

                      {saleHome.comicIssue ? (
                        <h3>
                          {saleHome.comicBookTitle}
                          &nbsp;
                          #
                          {saleHome.comicIssue}
                        </h3>
                      ) : (
                        <h3>{saleHome.comicBookTitle}</h3>
                      )}

                      {
                        // {user && (
                        //   <p key={user.id}>
                        //     {user.firstname}
                        //     <br />
                        //     {user.email}
                        //   </p>
                        // )}
                      }

                      <article>
                        <RRLink to={`/forms/messaging/${saleHome.saleUsersId}/${saleHome.comicBookTitle}/${saleHome.comicIssue}/${user.id}/${user.username}/${user.email}`}>
                          <figure className="link"><QuestionAnswerIcon /></figure>
                        </RRLink>
                        <p>Send a message to the owner of this comic book.</p>
                      </article>
                    </Col>
                  ))}
              </Row>
            </Container>
          </section>
        </article>
      </React.Fragment>
    );
  }
}

Home.propTypes = {
  fetchALLSales: PropTypes.func.isRequired,
  salesALL: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      // comicBookCover: PropTypes.string,
      comicBookTitle: PropTypes.string,
      comicBookVolume: PropTypes.number,
      comicBookYear: PropTypes.number,
      comicBookPublisher: PropTypes.string,
      type: PropTypes.string,
    }),
  ),

  user: PropTypes.shape({
    id: PropTypes.string,
    firstname: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
  }),
  isLoading: PropTypes.bool.isRequired,
  match: RRPropTypes.match.isRequired,
};

Home.defaultProps = {
  salesALL: {},
  user: {},
};

export default container(Home);
