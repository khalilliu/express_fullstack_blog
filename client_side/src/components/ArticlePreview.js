import React from 'react';
import {Link} from 'react-router-dom';
import agent from '../agent';
import {connect} from 'react-redux';
import {
	ARTICLE_FAVORITED,
	ARTICLE_UNFAVORITED
} from '../constants/actionTypes';

const FAVORITED_CLASS = 'btn btn-sm btn-primary';
const NOT_FAVORITED_CLASS='btn btn-sm btn-outline-primary';

const mapDispatchToProps = dispatch => ({
	favorite: slug => dispatch({
		type: ARTICLE_FAVORITED,
		payload: agent.Articles.favorite(slug)
	}),
	unfavorite: slug => dispatch({
		type: ARTICLE_UNFAVORITED,
		payload: agent.Articles.unfavorite(slug)
	})
});

const ArticlePreview = props => {

};


export default connect(()=>({}),mapDispatchToProps)(ArticlePreview);

