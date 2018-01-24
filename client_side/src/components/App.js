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
			dispatch({type: REDIRECT})
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
		this.props.onLoad(token ? agent.Auth.current():null, token);
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
						<Route exec path='/home' component={Home} /> 
						<Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
          </Switch>
					
				</div>
			)
		};
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