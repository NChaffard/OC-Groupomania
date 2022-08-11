// Loading dependancies
import React, { useState } from 'react'
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
    const [deleteImage, setDeleteImage] = useState(false)
    const [image, setImage] = useState('')
    const [label, setLabel] = useState('Ajouter une image')
    const [errorMsg, setErrorMsg] = useState({ text: "" })


    const navigate = useNavigate();

    useEffect(() => {
        if (window.location.href.split('/')[3] === 'update-post' && !post) {
            navigate('/')
        }
        if (image.length < 1) {
            if (post && post.imageUrl) {
                setImage(post.imageUrl)
            }
        }
    }, [image, post, navigate])

    const handleSubmit = async function (e) {
        e.preventDefault()
        let textMsg = validateInput(e.target.text)
        setErrorMsg(prev => ({ ...prev, ...textMsg }))
        if (formValidation(errorMsg)) {
            console.log('form ok')
            const data = new FormData(e.target);
            if (post && post.imageUrl && deleteImage === true) {
                data.append('deleteImage', 'true')
            }
            await onSubmit(data)
        } else {
            alert("Il y'a au moins une erreur de saisie !")
        }
    }

    const handleDeleteImage = function (e) {
        e.preventDefault()
        setDeleteImage(true)
        setImage('')
        document.getElementById('image').value = ''
    }

    const handleAddImage = function (e) {
        console.log(e.target)
        setDeleteImage(false)
        let msg = validateInput(e.target)
        if (msg.image) {
            alert(msg.image)
            document.getElementById('image').value = ''

        } else {

            setImage(URL.createObjectURL(e.target.files[0]))
        }


    }

    const handleInput = function (e) {
        console.log(e.target)
        let msg = validateInput(e.target)

        setErrorMsg(prev => ({
            ...prev,
            ...msg
        })
        )
    }



    return <form className="form-post" onSubmit={handleSubmit} encType="multipart/form-data">
        {/* If it is a post update, get the data from post */}
        {post ? <><input type="hidden" name="id" id="id" value={post.id} />
            <input type="hidden" name="time_stamp" id="time_stamp" value={post.time_stamp} />
            <input type="hidden" name="likes" id="likes" value={post.likes} />
            <input type="hidden" name="dislikes" id="dislikes" value={post.dislikes} />
            <input type="hidden" name="name" id="name" value={post.name} />
            <input type="hidden" name="userId" id="userId" value={post.userId} />

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

        <Field onBlur={handleInput} error={errorMsg.text} type="textarea" name="text" id="text" className="form-text" defaultValue={(post ? post.text : '')} minLength="5" maxLength="3000" required >Contenu du post</Field>

        <Field type="file" accept="image/jpg, image/jpeg, image/png" id="image" name="image" className="form-file" onChange={handleAddImage} ><AddImage />{label}</Field>

        {/* If there is an image, show it */}
        {image.length > 1 && !deleteImage ?
            <>
                < div className="form-image">
                    <img className="form-image__item" src={image} alt="preview" />
                    <button onClick={handleDeleteImage} className="btn form-image__delete"><Trash />Supprimer l'image</button>
                </div>
            </> : null
        }
        <div className="form-submit">
            <button type="submit" className="form__submit form-submit__item">Envoyer</button>
            <button className="form__submit form-submit__item_cancel" onClick={() => navigate('/')}>Annuler</button>
        </div>
    </form>
}