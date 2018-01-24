import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import common from './reducers/common';
import auth from './reducers/auth';
import home from './reducers/home';


export default combineReducers({
	home,
	common,
	auth,
	router: routerReducer
})