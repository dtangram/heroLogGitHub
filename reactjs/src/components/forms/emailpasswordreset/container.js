import { connect } from 'react-redux';
import {
  emailpasswordresetUser,
} from '../../../store/emailpasswordreset/actions';

function mapStateToProps(state) {
  const {
    emailpasswordreset = {},
  } = state;

  return { emailpasswordreset };
}

// set the actions we need in this component
const mapDispatchToProps = {
  emailpasswordresetUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
