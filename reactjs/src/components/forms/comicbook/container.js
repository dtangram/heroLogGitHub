import { connect } from 'react-redux';
import {
  createComicBook, fetchComicBook, updateComicBook, deleteComicBook,
} from '../../../store/comicbooklistissues/actions';

function mapStateToProps(state, props) {
  const {
    match: {
      params: { id },
    },
  } = props;

  const {
    comicbooklistissues: {
      byId: { [id]: { data: comicbook } = {} },
    },
  } = state;

  return { comicbook };
}

// set the actions we need in this component
const mapDispatchToProps = {
  createComicBook, fetchComicBook, updateComicBook, deleteComicBook,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
