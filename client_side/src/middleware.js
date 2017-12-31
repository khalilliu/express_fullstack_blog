import {
	LOGIN,
	LOGINOUT,
	REGISTER
} from './constants/actionTypes';

const localStorageMiddleware = store => next => action => {

}

function isPromise(v){
	return v && typeof v.then === 'function';
}


export {localStorageMiddleware};