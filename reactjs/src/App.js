/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import PrivateRouteHandler from './privateRoute';
import store from './store';
import './css/main.css';
import './css/reset.css';
import './js/index';

// import logo from './logo.svg';
import Header from './components/header';
import Landing from './components/landing';
import Signup from './components/forms/signup';
import Signin from './components/forms/signin';
import Home from './components/home';
import Dashboard from './components/dashboard';
import ModalMessage from './components/forms/messaging';
import ViewMessages from './components/viewMessages';
import ComicBookList from './components/dashboard/comicbooklist';
import ComicBookListIssues from './components/dashboard/comicbooklistissues';
import CreatePublisher from './components/forms/createpublisher';
import ComicBookListTitle from './components/forms/comicbooklisttitle';
import ComicBook from './components/forms/comicbook';
import Fixer from './components/fixer';
import Sale from './components/sale';
import SaleForm from './components/forms/saleform';
import WishList from './components/wishlist';
import WishListForm from './components/forms/wishlistform';
import EmailPasswordReset from './components/forms/emailpasswordreset';
import PasswordReset from './components/forms/passwordreset';
import Profile from './components/profile';
import ProfileForm from './components/forms/profileform';
import Footer from './components/footer';

class App extends Component {
  render() {
    return (
      <Router>
        <Provider store={store} id="main">
          <Route path="/" component={Header} />
          <Route path="/landing" exact component={Landing} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/signin" exact component={Signin} />
          <Route path="/forms/emailpasswordreset" exact component={EmailPasswordReset} />
          <Route path="/forms/passwordreset/:token" exact component={PasswordReset} />
          <Switch>
            <PrivateRouteHandler path="/" exact component={Home} />
            <PrivateRouteHandler path="/dashboard/:userId" exact component={Dashboard} />
            <PrivateRouteHandler path="/forms/messaging/:userId/:comicBookTitle/:username/:userEmail" exact component={ModalMessage} />
            <PrivateRouteHandler path="/viewMessages/:userId" exact component={ViewMessages} />
            <PrivateRouteHandler path="/forms/createpublisher/new/:userId" exact component={CreatePublisher} />
            <PrivateRouteHandler path="/forms/createpublisher/edit/:id" exact component={CreatePublisher} />
            <PrivateRouteHandler path="/dashboard/:pubId/:publisherName/comicbooklist" exact component={ComicBookList} />
            <PrivateRouteHandler path="/forms/:pubId/comicbooklisttitle/new" exact component={ComicBookListTitle} />
            <PrivateRouteHandler path="/forms/:pubId/comicbooklisttitle/edit/:id" exact component={ComicBookListTitle} />
            <PrivateRouteHandler path="/dashboard/:coboTitleId/:cbTitle/comicbooklistissues" exact component={ComicBookListIssues} />
            <PrivateRouteHandler path="/forms/:coboTitleId/comicbook/new" exact component={ComicBook} />
            <PrivateRouteHandler path="/forms/:coboTitleId/comicbook/edit/:id" exact component={ComicBook} />
            <PrivateRouteHandler path="/fixer/:userId" exact component={Fixer} />
            <PrivateRouteHandler path="/sale/:userId" exact component={Sale} />
            <PrivateRouteHandler path="/forms/saleform/new/:userId" exact component={SaleForm} />
            <PrivateRouteHandler path="/forms/saleform/edit/:id" exact component={SaleForm} />
            <PrivateRouteHandler path="/wishlist/:userId" exact component={WishList} />
            <PrivateRouteHandler path="/forms/wishlistform/new/:userId" exact component={WishListForm} />
            <PrivateRouteHandler path="/forms/wishlistform/edit/:id" exact component={WishListForm} />
            <PrivateRouteHandler path="/profile/:userId" exact component={Profile} />
            <PrivateRouteHandler path="/forms/profileform/edit/:id" exact component={ProfileForm} />
          </Switch>
          <Footer />
        </Provider>
      </Router>
    );
  }
}

export default App;
