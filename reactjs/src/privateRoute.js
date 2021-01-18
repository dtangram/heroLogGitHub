import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  fetchLoginUser,
} from './store/user/actions';

const PrivateRouteHandler = ({
  component, user, fetchUser, signins, component: Component, path, ...rest
}) => {
  const [loading, setLoading] = React.useState(true);
  const ComponentToRender = component;

  React.useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetchUser();
    }

    setLoading(false);
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    if (signins.id) {
      setLoading(true);
      // fetchUser();
    }

    setLoading(false);
  }, [signins]);
  // [signins, fetchUser]

  if (user.isLoading || loading) {
    return <div>Loading</div>;
  }

  return (
    <Route
      {...rest}
      render={props => (user.data ? (
        <ComponentToRender {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/landing',
            state: { from: path },
          }}
        />
      ))
      }
    />
  );
};

//   if (!user.data) {
//     return (
//       <Redirect
//         to={{
//           pathname: '/landing',
//           state: { from: path },
//         }}
//       />
//     );
//   }
//
//   return (
//     <Route
//       path={path}
//       render={props => <Component />}
//     />
//   );
// };

PrivateRouteHandler.propTypes = {
  // location: RRPropTypes.location.isRequired,
  path: PropTypes.string.isRequired,
  component: PropTypes.elementType.isRequired,
  user: PropTypes.shape({
    data: PropTypes.shape({
      id: PropTypes.string,
    }),
    isLoading: PropTypes.bool.isRequired,
  }).isRequired,
  signins: PropTypes.shape({
    id: PropTypes.string,
    // isLoading: PropTypes.bool.isRequired
  }).isRequired,
  fetchUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  // component: state.component,
  location: state.location,
  user: state.user,
  signins: state.signins,
});

const mapDispatchToProps = {
  fetchUser: fetchLoginUser,
};

export const PrivateRoute = withRouter(connect(
  mapStateToProps, mapDispatchToProps,
)(PrivateRouteHandler));

export default PrivateRoute;
