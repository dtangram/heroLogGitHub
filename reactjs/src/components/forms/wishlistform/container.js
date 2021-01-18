import { connect } from 'react-redux';
import {
  createWishList, fetchWishList, updateWishList,
} from '../../../store/wishlist/actions';

function mapStateToProps(state, props) {
  const {
    match: {
      params: { id },
    },
  } = props;

  const {
    wishlists: {
      byId: { [id]: { data: wishlist } = {} },
    },
  } = state;

  return { wishlist };
}

// set the actions we need in this component
const mapDispatchToProps = {
  createWishList, fetchWishList, updateWishList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
