import { connect } from 'react-redux';
import {
  fetchMessagings, fetchMessaging,
} from '../../store/messagings/actions';

function mapStateToProps(state, props) {
  const {
    match: {
      params: { id },
    },
  } = props;

  const { messagings = {} } = state;

  const {
    messagings: {
      byId: { [id]: { data: messaging } = {} },
    },
  } = state;

  return { messaging, messagings };
}

// set the actions we need in this component
const mapDispatchToProps = {
  fetchMessagings, fetchMessaging,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
