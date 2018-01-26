import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import common from './reducers/common';
import auth from './reducers/auth';
import home from './reducers/home';
import settings from './reducers/settings';
import profile from './reducers/profile';
import articleList from './reducers/articleList';
import editor from './reducers/editor';

export default combineReducers({
	home,
	common,
	auth,
	settings,
	profile,
	articleList,
	editor,
	router: routerReducer
});