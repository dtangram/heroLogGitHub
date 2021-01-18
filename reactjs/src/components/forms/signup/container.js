import { connect } from 'react-redux';
import {
  createUser, fetchUser,
} from '../../../store/signup/actions';

function mapStateToProps(state, props) {
  // get the id from the route params
  const { match: { params: { id } } } = props;
  const {
    signups: {
      byId: {
        // find the key with the id from the route and pull out the signup
        [id]: signup,
      },
    },
  } = state;

  return { signup };
}

// set the actions we need in this component
const mapDispatchToProps = {
  createUser, fetchUser,
};

export default connect(mapStateToProps, mapDispatchToProps);
