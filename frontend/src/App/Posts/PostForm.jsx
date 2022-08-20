// Loading dependancies
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react'
// Loading ui elements
import { Field } from '../../ui/Field';
// Loading css
import '../../scss/form.scss'
import '../../scss/postForm.scss'
// Loding assets
import { Trash } from '../../assets/Trash';
import { AddImage } from '../../assets/AddImage';
import { formValidation, validateInput } from '../../utils/validateInput';


export function CreatePostForm({ onSubmit }) {
    return <PostForm onSubmit={onSubmit} />
}

export function UpdatePostForm({ post, onSubmit }) {
    return <PostForm post={post} onSubmit={onSubmit} />
}


function PostForm({ post = null, onSubmit }) {
    // States
    // Tell to the server that it must delete the current image and not add another one
    const [deleteImage, setDeleteImage] = useState(false)
    // Contain the url of the previewed image
    const [image, setImage] = useState('')
    // Contain the label for the file input, Change if there is or not an image in the input
    const [label, setLabel] = useState('Ajouter une image')
    // Contain an object with errors from inputs
    const [errorMsg, setErrorMsg] = useState({ text: "" })

    // Used for navigate to other url
    const navigate = useNavigate();



    // UseEffects

    useEffect(() => {
        // If the endpoint is update post and there no post data, return to home
        if (window.location.href.split('/')[3] === 'update-post' && !post) {
            navigate('/')
        }
        // If image state is empty
        if (image.length < 1) {
            // If there is an existing image from post to update
            if (post && post.imageUrl) {
                // Set image state with imageUrl
                setImage(post.imageUrl)
            }
        }
        // Set label to update message if there is an image
        if (image.length > 1 && deleteImage === false && label === 'Ajouter une image') {
            setLabel("Modifier l'image")
        }
    }, [image, post, navigate, deleteImage, label])


    // Handles

    const handleInput = function (e) {
        // Test input
        let msg = validateInput(e.target)
        // Then set errorMsg with the result
        setErrorMsg(prev => ({
            ...prev,
            ...msg
        })
        )
    }

    const handleAddImage = function (e) {
        // We want to upload an image, so deleteImage state must be to false
        setDeleteImage(false)

        // Test file input
        let msg = validateInput(e.target)
        // If there is an error
        if (msg.image) {
            // Alert the user
            alert(msg.image)
            // Set image state and file input value to '', so if there is an imageUrl in post, it will show it
            setImage('')
            document.getElementById('image').value = ''

        } else {
            // Else set Image state with a temporary url to preview it
            setImage(URL.createObjectURL(e.target.files[0]))
        }
    }

    const handleDeleteImage = function (e) {
        e.preventDefault()
        // We want to delete the image, so set deleteImage state to true
        setDeleteImage(true)
        // There is no image to preview, so image state must be empty
        setImage('')
        // There is no image, so set label to add image
        setLabel('Ajouter une image')
        // Clean the input file value
        document.getElementById('image').value = ''
    }

    const handleSubmit = async function (e) {
        e.preventDefault()
        // Check if text input is valid
        let textMsg = validateInput(e.target.text)
        setErrorMsg(prev => ({ ...prev, ...textMsg }))
        // Then check if there is an error message, if there is not, it returns true
        if (formValidation(errorMsg)) {
            // Prepare data to send
            const data = new FormData(e.target);
            // If there is an image to send, add it to form data
            if (post && post.imageUrl && deleteImage === true) {
                data.append('deleteImage', 'true')
            }
            await onSubmit(data).catch(() => { localStorage.clear(); window.location.reload() })
        }
        // If there is an error, Alert the user
        else {
            alert("Il y'a au moins une erreur de saisie !")
        }
    }




    return <form className="form form-post" onSubmit={handleSubmit} encType="multipart/form-data">
        {/* If it is a post update, get the data from post */}
        {post ? <>
            <input type="hidden" name="id" id="id" value={post.id} />
            <input type="hidden" name="created_at" id="created_at" value={post.created_at} />
            <input type="hidden" name="likes" id="likes" value={post.likes} />
            <input type="hidden" name="name" id="name" value={post.name} />
            <input type="hidden" name="userId" id="userId" value={post.userId} />
        </> : null}
        {/* If there is a previous image, get the url */}
        {post && post.imageUrl ?
            <>
                <input type="hidden" name="imageUrl" id="imageUrl" value={post.imageUrl} />
            </> : null}
        {/* If the image must be removed, add deleteImage  */}
        {post && post.deleteImage === true ?
            <>
                <input type="hidden" name="deleteImage" id="deleteImage" value={post.deleteImage} />
            </> : null}

        {/* Text input */}
        <Field
            onBlur={handleInput}
            error={errorMsg.text}
            type="textarea"
            name="text"
            id="text"
            className="form-text"
            defaultValue={(post ? post.text : '')}
            minLength="5"
            maxLength="3000"
            required
        >Contenu du post</Field>

        {/* File input */}
        <Field
            type="file"
            accept="image/jpg, image/jpeg, image/png"
            id="image"
            name="image"
            className="form-file"
            onChange={handleAddImage}
        ><AddImage />{label}</Field>

        {/* If there is an image, show it */}
        {image.length > 1 && !deleteImage ?
            <>
                <div className="form-image">
                    <img className="form-image__item" src={image} alt="preview" />
                    <button onClick={handleDeleteImage} className="btn form-image__delete"><Trash />Supprimer l'image</button>
                </div>
            </> : null
        }
        <div className="form-submit">
            <button type="submit" className="submit form-submit__item">Envoyer</button>
            <button className="submit form-submit__item form-submit__item_cancel" onClick={() => navigate('/')}>Annuler</button>
        </div>
    </form>
}

PostForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
}
