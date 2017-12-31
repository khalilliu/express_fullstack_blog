import {applyMiddleware, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import {composeWithDevTools} from 'redux-devtools';
import createHistory from 'history/createBrowserHistory'

import { localStorageMiddleware} from './middleware';
import reducer from './reducer';


export const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const myRouterMiddleware = routerMiddleware(history);


const getMiddleware = () => {
	if(process.env.NODE_ENV == 'production'){
		return applyMiddleware(myRouterMiddleware,promiseMiddleware,localStorageMiddleware);
	}else{
		// Enable additional logging in non-production environments.
		return applyMiddleware(myRouterMiddleware,localStorageMiddleware,createLogger());
	}
}


export const store = createStore(reducer, composeWithDevTools(getMiddleware()))