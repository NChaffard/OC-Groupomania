import React from 'react'
import '../../scss/form.scss'

export function CreatePostForm({ onSubmit }) {
    return <PostForm onSubmit={onSubmit} />
}

export function UpdatePostForm({ post, onSubmit }) {
    return <PostForm post={post} onSubmit={onSubmit} />
}


function PostForm({ post = null, onSubmit }) {

    const handleSubmit = async function (e) {
        e.preventDefault()
        const data = new FormData(e.target);
        await onSubmit(data)
    }


    return <form className="form" onSubmit={handleSubmit} encType="multipart/form-data">
        {post ? <input type="hidden" name="id" id="id" value={post.id} /> : null}
        <div className="form-group">
            <label htmlFor="title">Titre: </label>
            <input type="text" name="title" id="title" className="form__title" defaultValue={(post ? post.title : '')} required />
        </div>
        <div className="form-group">
            <label htmlFor="text">Text</label>
            <input type="textarea" name="text" id="text" className="form__text" defaultValue={(post ? post.text : '')} required />
        </div>
        <div className="form-group">
            <label htmlFor="image">Image</label>
            <input type="file" name="image" className="form__file" />
        </div>
        {post && post.imageUrl ? <><input type="hidden" name="imageUrl" id="imageUrl" value={post.imageUrl} />, <img className="form__img" src={post.imageUrl} alt="image" /></> : null}
        <div className="form-group">
            <button type="submit" className="form__submit">Envoyer</button>
        </div>
    </form>
}