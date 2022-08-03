import React, { useState } from 'react'
import { useEffect } from 'react'
import '../../scss/form.scss'
import '../../scss/postForm.scss'

export function CreatePostForm({ onSubmit }) {
    return <PostForm onSubmit={onSubmit} />
}

export function UpdatePostForm({ post, onSubmit }) {
    return <PostForm post={post} onSubmit={onSubmit} />
}


function PostForm({ post = null, onSubmit }) {
    const [deleteImage, setDeleteImage] = useState(false)
    const [image, setImage] = useState('');

    useEffect(() => {

        if (image.length < 1) {
            if (post && post.imageUrl) {
                setImage(post.imageUrl)
            }
        }
    }, [image])

    const handleSubmit = async function (e) {
        e.preventDefault()
        const data = new FormData(e.target);
        if (post && post.imageUrl && deleteImage === true) {
            data.append('deleteImage', 'true')
        }
        await onSubmit(data)
    }

    const handleDeleteImage = function (e) {
        e.preventDefault()
        setDeleteImage(true)
        setImage('')
        document.getElementById('image').value = ''
    }

    const handleAddImage = function (e) {
        setDeleteImage(false)
        setImage(URL.createObjectURL(e.target.files[0]))
    }



    return <form className="form-post" onSubmit={handleSubmit} encType="multipart/form-data">
        {/* If it is a post update, get the data from post */}
        {post ? <><input type="hidden" name="id" id="id" value={post.id} />
            <input type="hidden" name="time_stamp" id="time_stamp" value={post.time_stamp} />
            <input type="hidden" name="likes" id="likes" value={post.likes} />
            <input type="hidden" name="dislikes" id="dislikes" value={post.dislikes} />
        </> : null}
        {/* If there is a previous image, get the url */}
        {post && post.imageUrl ?
            <>
                <input type="hidden" name="imageUrl" id="imageUrl" value={post.imageUrl} />
            </> : null}
        {/* If the image must be removed, had deleteImage  */}
        {post && post.deleteImage === true ?
            <>
                <input type="hidden" name="deleteImage" id="deleteImage" value={post.deleteImage} />
            </> : null}

        <div className="text-group">
            <label htmlFor="text">Contenu du post</label>
            <textarea name="text" id="text" className="form__text" defaultValue={(post ? post.text : '')} required />
        </div>
        <div className="form-group">
            <label htmlFor="image">Image</label>
            <input type="file" accept="image/*" id="image" name="image" className="form__file" onChange={handleAddImage} />
        </div>
        {/* If there is an image, show it */}
        {image.length > 1 && !deleteImage ?
            <>
                <img className="form__img" src={image} alt="image" />
                <button onClick={handleDeleteImage} className="form__delImage">Supprimer l'image</button>
            </> : null}
        <div className="form-group">
            <button type="submit" className="form__submit">Envoyer</button>
        </div>
    </form>
}