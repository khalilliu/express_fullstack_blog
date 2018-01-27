import Comment from './Comment';
import React from 'react';

const CommentList  = props => {
	return(
		<div>
			{
				props.comments.map(comment => {
					return(
						<Comment 
							key={comment.id}
							currentUser={props.currentUser}
							slug={props.slug}
							comment={comment}
						/>
					)
				})
			}
		</div>
	)
}

export default CommentList;