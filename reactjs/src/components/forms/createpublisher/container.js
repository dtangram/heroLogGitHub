import { connect } from 'react-redux';
import {
  createPublisher, fetchPublisher, updatePublisher,
} from '../../../store/dashboard/actions';

function mapStateToProps(state, props) {
  const {
    match: {
      params: { id },
    },
  } = props;

  const {
    publishers: {
      byId: { [id]: { data: publisher } = {} },
    },
  } = state;

  return { publisher };
}

// set the actions we need in this component
const mapDispatchToProps = {
  createPublisher, fetchPublisher, updatePublisher,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
