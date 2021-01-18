import { connect } from 'react-redux';
import { fetchComicBookTitles, deleteComicBookTitle } from '../../../store/comicbooklist/actions';

function mapStateToProps(state) {
  const { comicbooklists = {} } = state;

  return { comicbooklists };

  // const {
  //   comicbooklists: { byId, allIds, isLoading },
  // } = state;
  // // turn the array of ids into an array of objects
  // return { comicbooklists: allIds.map(id => byId[id].data), isLoading };
}

// set the actions we need in this component
const mapDispatchToProps = { fetchComicBookTitles, deleteComicBookTitle };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
