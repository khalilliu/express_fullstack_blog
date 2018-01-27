import React from 'react';
import agent from '../../agent';

const Tags = props => {
	const tags = props.tags;
	if(tags){
		return (
			tags.map(tag => {
				const handleClick = ev => {
					ev.preventDefault();
					props.onClickTag(tag, page => agent.Articles.byTag(tag,page),agent.Articles.byTag(tag));
				};
				return(
					<a 
						href=''
						className='tag-default tag-pill'
						key={tag}
						onClick={handleClick}
					>{tag}</a>
				)
			})
		)
	}else{
		return(<div>Loading tags...</div>)
	}
}

export default Tags;