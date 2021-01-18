import { connect } from 'react-redux';
import {
  createComicBookTitle, fetchComicBookTitle, updateComicBookTitle,
} from '../../../store/comicbooklist/actions';

function mapStateToProps(state, props) {
  const {
    match: {
      params: { id },
    },
  } = props;

  const {
    comicbooklists: {
      byId: { [id]: { data: comicbooklist } = {} },
    },
  } = state;

  return { comicbooklist };
}

// set the actions we need in this component
const mapDispatchToProps = {
  createComicBookTitle, fetchComicBookTitle, updateComicBookTitle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
