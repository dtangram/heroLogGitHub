import React from 'react';
import { Link as RRLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import RRPropTypes from 'react-router-prop-types';
import { BeatLoader } from 'react-spinners';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Link from '../../link';
import Empty from '../empty/empty';
import '../../css/main.css';
// import styles from './styles.module.css';
import container from './container';
import logo from '../../img/logo.png';

class Sale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    // props.fetchSales();
  }

  componentDidMount() {
    const { fetchSales, match: { params: { userId } } } = this.props;
    fetchSales(userId);

    window.scrollTo({
      top: 0,
    });
  }

  delete = async (id) => {
    const { deleteSale } = this.props;
    await deleteSale(id);
    window.location.reload(false);
  }

  render() {
    const userId = localStorage.getItem('id');
    const { sales } = this.props;

    const currentSalesData = sales[userId] || {};
    const { allIds = [], byId = {}, isLoading } = currentSalesData;

    // turn the array of ids into an array of objects
    const currentSales = allIds.map(id => byId[id].data);

    // if (window.localStorage) {
    //   if (currentSales.length > 0) {
    //     localStorage.removeItem('firstLoad');
    //   } else if (!localStorage.getItem('firstLoad')) {
    //     localStorage.firstLoad = true;
    //     window.location.reload();
    //   }
    // }

    return (
      <React.Fragment>
        <div id="cbSale">
          <h1>
            Your Comics for Sale
            <div className="graphic" alt="Small burgandy, rectangle graphic." />
          </h1>

          <h2>
            <section>
              <RRLink to={`/forms/saleform/new/${userId}`}>
                <figure><LibraryAddIcon /></figure>
                <p className="link">Add Comic to Sale</p>
              </RRLink>
            </section>
          </h2>

          <div className="cbList">
            <section>
              <article>
                {currentSales.length === 0 && !isLoading ? <Empty /> : <Empty /> === null}

                {isLoading && (
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

                {!isLoading && currentSales.length > 0
                  && currentSales.map(sale => (
                    <section className="comicSec" key={sale.id}>
                      <article className="comicWrap">
                        <section className="comicImgWrap">
                          <img src={sale.comicBookCover} alt={sale.comicBookTitle} />
                        </section>

                        <section className="paraWrap">
                          <p>
                            <span>Title:</span>
                            &nbsp;
                            {sale.comicBookTitle}
                          </p>

                          <p>
                            <span>Volume:</span>
                            &nbsp;
                            {sale.comicBookVolume}
                          </p>

                          <p>
                            <span>Year:</span>
                            &nbsp;
                            {sale.comicBookYear}
                          </p>

                          <p>
                            <span>Publisher:</span>
                            &nbsp;
                            {sale.comicBookPublisher}
                          </p>

                          <p>
                            <span>Cover:</span>
                            &nbsp;
                            {sale.type}
                          </p>

                          <section>
                            <section className="editStyle">
                              <figure><EditIcon /></figure>
                              <p className="link"><Link className="link" url={`/forms/saleform/edit/${sale.id}`} title="Edit" /></p>
                            </section>
                            <button className="deleteStyle" type="submit" onClick={() => this.delete(sale.id)}>
                              <figure><DeleteIcon /></figure>
                              <p>Delete</p>
                            </button>
                          </section>
                        </section>
                      </article>
                    </section>
                  ))}
              </article>
            </section>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Sale.propTypes = {
  fetchSales: PropTypes.func.isRequired,
  sales: PropTypes.shape({
    id: PropTypes.string,
    comicBookTitle: PropTypes.string,
    comicBookVolume: PropTypes.number,
    comicBookYear: PropTypes.number,
    comicBookPublisher: PropTypes.string,
    type: PropTypes.string,
  }),
  deleteSale: PropTypes.func.isRequired,
  match: RRPropTypes.match.isRequired,
};

Sale.defaultProps = {
  sales: {},
};

export default container(Sale);
