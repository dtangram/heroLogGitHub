import { connect } from 'react-redux';
import { fetchComicBooks, deleteComicBook } from '../../../store/comicbooklistissues/actions';

function mapStateToProps(state) {
  const { comicbooklistissues = {} } = state;

  return { comicbooklistissues };
}

// set the actions we need in this component
const mapDispatchToProps = { fetchComicBooks, deleteComicBook };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
