import{
	ADD_TAG,
	EDITOR_PAGE_LOADED,
	REMOVE_TAG,
	ASYNC_START,
	ARTICLE_SUBMITTED,
	EDITOR_PAGE_UNLOAD,
	UPDATE_FIELD_EDITOR
} from '../constants/actionTypes';

export default (state={}, action) => {
	switch (action.type) {
		case EDITOR_PAGE_LOADED:
			return {
				...state,
				articleSlug: action.payload?action.payload.article.slug:'',
				title:  action.payload?action.payload.article.title:'',
				description:  action.payload?action.payload.article.description:'',
				body:  action.payload?action.payload.article.body:'',
				tagList: action.payload?action.payload.article.tagList:[],
				tagInput:''
			};
		case EDITOR_PAGE_UNLOAD:
			return {};
		case ARTICLE_SUBMITTED:
			return {

			};
		case UPDATE_FIELD_EDITOR:
			return{...state, [action.key]:action.value};
		case ADD_TAG:
			return{
				...state,
				tagList: state.tagList.concat([state.tagInput]),
				tagInput:''
			};
		case REMOVE_TAG:
			return{
				...state,
				tagList: state.tagList.filter(tag => tag!== action.tag)
			};
		default:
			return {...state};
	}
}