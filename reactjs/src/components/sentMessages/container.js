import { connect } from 'react-redux';
import {
  fetchMessagingsSent, fetchMessaging, deleteMessaging,
} from '../../store/messagings/actions';
import {
  fetchUser,
} from '../../store/signup/actions';

function mapStateToProps(state, props) {
  const {
    match: {
      params: { id, userId },
    },
  } = props;

  const {
    messagings: {
      byId: { [id]: { data: messaging } = {} },
    },
    messagings = {},
    signups: { byId, allIds },
  } = state;

  return { messaging, messagings, signups: allIds.map(idUser => byId[userId].data) };
}

// set the actions we need in this component
const mapDispatchToProps = {
  fetchMessagingsSent, fetchMessaging, deleteMessaging, fetchUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
