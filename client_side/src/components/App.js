import agent from '../agent';
import React from 'react';
import { connect } from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import { push } from 'react-router-redux';
import {store} from '../store';

//action types
import {APP_LOAD, REDIRECT} from '../constants/actionTypes';

//component
import Header from './Header';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Settings from './Settings';
import Profile from './Profile';
import ProfileFavorites from './ProfileFavorites';
import Editor from './Editor';
import Article from './Article';


const mapStateToProps = (state) => {
	return {
		appLoaded: state.common.appLoaded ,
		appName: state.common.appName ,
		currentUser: state.common.currentUser ,
		redirectTo: state.common.redirectTo 
	}
};

const mapDispatchToProps = (dispatch) => ({
		onLoad: (payload, token) => 
			dispatch({type: APP_LOAD, payload, token, skipTracking: true}),
		onRedirect: () => {
			dispatch({type: REDIRECT});
		}
})

class App extends React.Component {
	componentWillReceiveProps(nextProps){
		if(nextProps.redirectTo){
			store.dispatch(push(nextProps.redirectTo));
			this.props.onRedirect();
		}
	}

	componentWillMount(){
		const token = window.localStorage.getItem('jwt');
		if(token){
			agent.setToken(token);
		}
		//dispatch({APP_Loaded,token,payload:Auth.current()})
		this.props.onLoad(token ? agent.Auth.current() : null, token);
	}

	render(){
		if(this.props.appLoaded){
			return (
				<div>
					<Header 
						appName={this.props.appName}
						currentUser={this.props.currentUser}
					/>
					
					<Switch>
						<Route exact path='/' component={Home} /> 
						<Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/settings" component={Settings} />
            <Route path='/@:username/favorites' component={ProfileFavorites}/>
            <Route path='/@:username' component={Profile} />
            <Route path='/editor/:slug' component={Editor} />
            <Route exact path='/editor' component={Editor} />
            <Route path='/article/:id' component={Article} />
          </Switch>
					
				</div>
			)
		}

		return (
			<div>
				<Header 
					appName={this.props.appName}
					currentUser={this.props.currentUser}
				/>
				
			</div>
		)
	}
}



export default connect(mapStateToProps, mapDispatchToProps)(App);