import { connect } from 'react-redux';
import { fetchUser, updateUser } from '../../../store/signup/actions';

function mapStateToProps(state, props) {
  const {
    match: {
      params: { id },
    },
  } = props;

  const {
    signups: {
      byId: { [id]: { data: signup } = {} },
    },
  } = state;

  return { signup };
}

// set the actions we need in this component
const mapDispatchToProps = { fetchUser, updateUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
