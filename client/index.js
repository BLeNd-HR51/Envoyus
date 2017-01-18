import 'babel-polyfill';

import App from './src/App.jsx';

import Relay from 'react-relay';
import ReactDOM from 'react-dom';
import React from 'react';

import './src/assets/styles/main.scss';

class MainPageRoute extends Relay.Route {
  static routeName = 'MainPageRoute';
  static queries = {
    store: ((Component) => {
      return Relay.QL`
        query root {
          craigslist {
            ${Component.getFragment('store')}
          }
        }
      `
    })
  };
}

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:3000/graphql')
);

ReactDOM.render(
  <Relay.RootContainer
    Component={App}
    route={new MainPageRoute()}
    onReadyStateChange={({ error}) => { if (error) console.error(error) }}
  />,
  document.getElementById('app'),
);
