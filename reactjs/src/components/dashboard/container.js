import { connect } from 'react-redux';
import { fetchPublishers, deletePublisher } from '../../store/dashboard/actions';

function mapStateToProps(state) {
  // const { publishers = {} } = state;
  //
  // return { publishers };

  const {
    publishers: { byId, allIds, isLoading },
  } = state;
  // turn the array of ids into an array of objects
  return { publishers: allIds.map(id => byId[id].data), isLoading };
}

// set the actions we need in this component
const mapDispatchToProps = { fetchPublishers, deletePublisher };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
