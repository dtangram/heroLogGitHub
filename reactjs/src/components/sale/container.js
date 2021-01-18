import { connect } from 'react-redux';
import { fetchSales, deleteSale } from '../../store/sale/actions';

function mapStateToProps(state) {
  const { sales = {} } = state;

  return { sales };
}

// set the actions we need in this component
const mapDispatchToProps = { fetchSales, deleteSale };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
