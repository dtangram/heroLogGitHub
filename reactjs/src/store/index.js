// get all the functions we need from redux
import {
  combineReducers, createStore, applyMiddleware, compose,
} from 'redux';
// middleware for making actions asynchronous
import thunkMiddleware from 'redux-thunk';
// will log to console all the actions that are run
import { createLogger } from 'redux-logger';
// middleware to help with api calls
import callAPI from './helpers/callAPIMiddleware';

// pull our reducers
import publishers from './dashboard/reducer';
import comicbooklists from './comicbooklist/reducer';
import comicbooklistissues from './comicbooklistissues/reducer';
import messagings from './messagings/reducer';
import sales from './sale/reducer';
import salesALL from './saleALL/reducer';
import signups from './signup/reducer';
import signins from './signin/reducer';
import emailpasswordresets from './emailpasswordreset/reducer';
import passwordresets from './passwordreset/reducer';
import wishlists from './wishlist/reducer';
import user from './user/reducer';

// combine multiple reducers into one
const rootReducer = combineReducers({
  publishers,
  comicbooklists,
  comicbooklistissues,
  messagings,
  sales,
  salesALL,
  signups,
  signins,
  emailpasswordresets,
  passwordresets,
  wishlists,
  user,
});

// set up middleware
const middleware = applyMiddleware(thunkMiddleware, callAPI, createLogger());
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// create a redux store using the combined reducer, middleware functions and redux dev tools
const store = createStore(rootReducer, /* preloadedState, */ composeEnhancers(middleware));
// const store = createStore(rootReducer, middleware);

export default store;
