import { connect } from 'react-redux';
import {
  fetchUser, deleteUser,
} from '../../store/signup/actions';

function mapStateToProps(state) {
  const {
    signups: { byId, allIds, isLoading },
  } = state;
  // turn the array of ids into an array of objects
  return { signups: allIds.map(id => byId[id].data), isLoading };
}

// set the actions we need in this component
const mapDispatchToProps = {
  fetchUser, deleteUser,
};

export default connect(mapStateToProps, mapDispatchToProps);
