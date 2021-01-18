import { connect } from 'react-redux';
import { passwordresetUser, updatePasswordresetUser } from '../../../store/passwordreset/actions';
import {
  fetchLoginUser,
} from '../../../store/user/actions';

function mapStateToProps(state, props) {
  const {
    passwordreset, user,
  } = state;

  return { passwordreset, user };
}

// set the actions we need in this component
const mapDispatchToProps = { passwordresetUser, updatePasswordresetUser, fetchLoginUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
