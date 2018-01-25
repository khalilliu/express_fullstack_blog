import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import common from './reducers/common';
import auth from './reducers/auth';
import home from './reducers/home';
import settings from './reducers/settings';
import profile from './reducers/profile';


export default combineReducers({
	home,
	common,
	auth,
	settings,
	profile,
	router: routerReducer
});