import { connect } from 'react-redux';
import {
  createMessaging, fetchMessaging, updateMessaging,
} from '../../../store/messagings/actions';

function mapStateToProps(state, props) {
  const {
    match: {
      params: { id },
    },
  } = props;

  const {
    messagings: {
      byId: { [id]: { data: messaging } = {} },
    },
  } = state;

  return { messaging };
}

// set the actions we need in this component
const mapDispatchToProps = {
  createMessaging, fetchMessaging, updateMessaging,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
