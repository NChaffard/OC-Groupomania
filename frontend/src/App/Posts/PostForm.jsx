import React from 'react'

export function CreatePostForm({ onSubmit }) {
    return <PostForm onSubmit={onSubmit} />
}

export function UpdatePostForm({ post, onSubmit }) {
    return <PostForm post={post} onSubmit={onSubmit} />
}


function PostForm({ post = null, onSubmit }) {

    const handleSubmit = async function (e) {
        e.preventDefault()
        const data = new FormData(e.target)
        await onSubmit(Object.fromEntries(data))
    }


    return <form onSubmit={handleSubmit}>
        {post ? <input type="hidden" name="id" id="id" value={post.id} /> : null}
        <div className="form-group">
            <label htmlFor="text">Text</label>
            <input type="text" name="text" id="text" defaultValue={(post ? post.text : '')} required />
        </div>
        <button type="submit">Envoyer</button>
    </form>
}