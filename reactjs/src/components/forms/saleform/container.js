import { connect } from 'react-redux';
import {
  createSale, fetchSale, updateSale,
} from '../../../store/sale/actions';

function mapStateToProps(state, props) {
  const {
    match: {
      params: { id },
    },
  } = props;

  const {
    sales: {
      byId: { [id]: { data: sale } = {} },
    },
  } = state;

  return { sale };
}

// set the actions we need in this component
const mapDispatchToProps = {
  createSale, fetchSale, updateSale,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
