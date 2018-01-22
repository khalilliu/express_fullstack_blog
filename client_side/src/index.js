import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import { ConnectedRouter} from 'react-router-redux'
import {store, history} from './store';

import './index.css';
import App from './components/App';

import registerServiceWorker from './registerServiceWorker';


ReactDOM.render((
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </ConnectedRouter>
  </Provider>

), document.getElementById('root'));



//registerServiceWorker();
