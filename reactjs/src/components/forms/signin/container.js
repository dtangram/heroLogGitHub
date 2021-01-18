import { connect } from 'react-redux';
import {
  loginUser,
} from '../../../store/signin/actions';
import {
  fetchLoginUser,
} from '../../../store/user/actions';

function mapStateToProps(state, props) {
  // const {
  //   match: {
  //     params: { id },
  //   },
  // } = props;

  const {
    signins, user,
  } = state;

  return { signins, user };
}

// set the actions we need in this component
const mapDispatchToProps = {
  loginUser, fetchLoginUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
