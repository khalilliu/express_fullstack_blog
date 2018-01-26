import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import {connect} from 'react-redux';
import {
	ADD_TAG,
	EDITOR_PAGE_LOADED,
	REMOVE_TAG,
	ARTICLE_SUBMITTED,
	EDITOR_PAGE_UNLOAD,
	UPDATE_FIELD_EDITOR
} from '../constants/actionTypes';

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

class Editor extends React.Component{
	render(){
		return(
			<div>Editor</div>
		)
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Editor);