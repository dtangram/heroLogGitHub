import { connect } from 'react-redux';
import { fetchALLSales } from '../../store/saleALL/actions';

function mapStateToProps(state) {
  const {
    salesALL: { byId, allIds, isLoading },
  } = state;
  // turn the array of ids into an array of objects
  return {
    salesALL: allIds.map(id => byId[id].data),
    isLoading,
    user: state.user ? state.user.data : {},
  };
}

// set the actions we need in this component
const mapDispatchToProps = { fetchALLSales };

export default connect(mapStateToProps, mapDispatchToProps);
