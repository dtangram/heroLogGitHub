import { connect } from 'react-redux';
import { fetchWishLists, deleteWishList } from '../../store/wishlist/actions';

function mapStateToProps(state) {
  const { wishlists = {} } = state;

  return { wishlists };
}

// set the actions we need in this component
const mapDispatchToProps = { fetchWishLists, deleteWishList };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
