import {combineReducers} from 'redux';
import {routerReducer} from 'react-redux-router';

import common from './reducers/common';

export default combineReducers({
	common,
	router: routerReducer
})