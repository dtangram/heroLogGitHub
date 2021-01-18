import React from 'react';
import { Link as RRLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import { BeatLoader } from 'react-spinners';
import Link from '../../link';
import Empty from '../empty/empty';
import '../../css/main.css';
// import styles from './styles.module.css';
import container from './container';
import logo from '../../img/logo.png';

class WishList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    // props.fetchWishLists();
  }

  componentDidMount() {
    window.scrollTo({
      top: 0,
    });

    const { fetchWishLists, match: { params: { userId } } } = this.props;
    fetchWishLists(userId);

    // const { fetchWishLists, match: { params: { id } } } = this.props;
    // if (id) fetchWishLists(id);
  }

  delete = async (id) => {
    const { deleteWishList } = this.props;
    await deleteWishList(id);
    window.location.reload(false);
  }

  render() {
    const { wishlists, match: { params: { userId } } } = this.props;

    const currentWishlistsData = wishlists[userId] || {};
    const { allIds = [], byId = {}, isLoading } = currentWishlistsData;

    // turn the array of ids into an array of objects
    const currentWishlists = allIds.map(id => byId[id].data);

    // if (currentWishlists.length > 0) {
    //   localStorage.removeItem('firstLoad');
    // } else if (!localStorage.getItem('firstLoad')) {
    //   localStorage.firstLoad = true;
    //   window.location.reload();
    // }
    //
    // if (window.localStorage) {
    //   if (currentWishlists.length > 0) {
    //     localStorage.removeItem('firstLoad');
    //   } else if (!localStorage.getItem('firstLoad')) {
    //     localStorage.firstLoad = true;
    //     window.location.reload();
    //   }
    // }
    //
    // if (window.localStorage) {
    //   if (!localStorage.getItem('firstLoad')) {
    //     localStorage.firstLoad = true;
    //     window.location.reload();
    //   } else if (currentWishlists.length > 0) {
    //     localStorage.removeItem('firstLoad');
    //   }
    // }

    return (
      <React.Fragment>
        <article id="cbWishList">
          <h1>
            Your Comics for Wish List
            <figure className="graphic" alt="Small burgandy, rectangle graphic." />
          </h1>

          <article className="cbList">
            <section>
              <h2><RRLink to={`/forms/wishListform/new/${userId}`} className="link">Add Comic to Wish List</RRLink></h2>
              <article>
                {currentWishlists.length === 0 && !isLoading ? <Empty /> : <Empty /> === null}
                {isLoading
                  && (
                    <React.Fragment>
                      <article className="loadMessageWrap">
                        <section>
                          <img src={logo} alt="HeroLog Logo" />
                        </section>

                        <section className="loadWrap">
                          <p className="loadMessage">Loading</p>
                          <BeatLoader size={10} color="#770422" />
                        </section>
                      </article>
                    </React.Fragment>
                  )}
                {!isLoading && currentWishlists.length > 0
                  && currentWishlists.map(wishList => (
                    <section className="comicSec" key={wishList.id}>
                      <article className="comicWrap">
                        <section className="comicImgWrap">
                          <img src={wishList.comicBookCover} alt="" />
                        </section>

                        <section className="paraWrap">
                          <p>
                            <span>Title:</span>
                            &nbsp;
                            {wishList.comicBookTitle}
                          </p>

                          <p>
                            <span>Volume:</span>
                            &nbsp;
                            {wishList.comicBookVolume}
                          </p>

                          <p>
                            <span>Year:</span>
                            &nbsp;
                            {wishList.comicBookYear}
                          </p>

                          <p>
                            <span>Publisher:</span>
                            &nbsp;
                            {wishList.comicBookPublisher}
                          </p>

                          <p>
                            <span>Cover:</span>
                            &nbsp;
                            {wishList.type}
                          </p>

                          <p>
                            <Link className="link" url={`/forms/wishListform/edit/${wishList.id}`} title="Edit" />
                            <button type="submit" onClick={() => this.delete(wishList.id)}>Delete</button>
                          </p>
                        </section>
                      </article>
                    </section>
                  ))}
              </article>
            </section>
          </article>
        </article>
      </React.Fragment>
    );
  }
}

WishList.propTypes = {
  fetchWishLists: PropTypes.func.isRequired,
  wishlists: PropTypes.shape({
    id: PropTypes.string,
    comicBookTitle: PropTypes.string,
    comicBookVolume: PropTypes.number,
    comicBookYear: PropTypes.number,
    comicBookPublisher: PropTypes.string,
    type: PropTypes.string,
  }),
  deleteWishList: PropTypes.func.isRequired,
  match: RRPropTypes.match.isRequired,
};

WishList.defaultProps = {
  wishlists: {},
};

export default container(WishList);
