import { connect } from 'react-redux';
import {
  loginUser,
} from '../../store/signin/actions';
import {
  logout, fetchLoginUser,
} from '../../store/user/actions';

function mapStateToProps(state, props) {
  const {
    user,
    signins,
  } = state;

  return { user, signins };
}

// set the actions we need in this component
const mapDispatchToProps = {
  loginUser, fetchLoginUser, logout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
