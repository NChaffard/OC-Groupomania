import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Imports utils
import { dateFormat } from '../../utils/dateFormat';
// Import css
import '../../scss/posts.scss'
// Import icons
import { Loader } from '../../ui/Loader';
import { Trash } from '../../assets/Trash';
import { Pen } from '../../assets/Pen';
import { Like } from '../../assets/Like';

export function Posts({ posts, onDelete, onUpdate, onLike }) {
    return <div className="posts" >
        {posts === null ? <Loader /> : <PostsList posts={posts} onDelete={onDelete} onUpdate={onUpdate} onLike={onLike} />}
    </div>

}

function PostsList({ posts, onDelete, onUpdate, onLike }) {
    return < ul className="posts-list">
        {posts.map(post => <Post key={post.id} post={post} onDelete={onDelete} onUpdate={onUpdate} onLike={onLike} />)}
    </ul >
}

function Post({ post, onDelete, onUpdate, onLike }) {
    // States
    // Toggle showing or not update and delete buttons 
    const [showButtons, setShowButtons] = useState(false)
    // Set like state (0 or 1) for send to the API
    const [like, setLike] = useState(null)
    // Tell if the post is liked or not by the user
    const [isLiked, setIsLiked] = useState(false)

    // Used for navigate to other url
    const navigate = useNavigate()

    // UseEffects

    // Check like state
    useEffect(function () {
        if (like !== null) {
            // If like is not null, send it, if it return an error, clear the localStorage and reload the page
            onLike(post, like).catch(() => { localStorage.clear(); window.location.reload() })
            // then set it to null
            setLike(null)
        }
    }, [like, onLike, post])

    // Check if likes from post change 
    useEffect(function () {
        // If likes is not empty
        if (JSON.parse(post.likes).length !== 0) {
            // If the userId is in the likes object, set isLiked to true, else false
            JSON.parse(post.likes).map(likeUserId => likeUserId === parseInt(localStorage.getItem('userId')) ? (setIsLiked(true)) : (setIsLiked(false)))
        } else {
            setIsLiked(false)
        }

    }, [post.likes])

    // Check userId from post
    useEffect(function () {
        const isUserId = parseInt(localStorage.getItem('userId'))
        const isAdmin = parseInt(localStorage.getItem('isAdmin'))
        // If it's equal to the userId of the user or the user is an admin, set showButtons to true
        if (isUserId === post.userId || isAdmin === 1) {
            setShowButtons(true)
        }
    }, [post.userId])

    // Handles
    const handleDelete = async function (e) {
        e.preventDefault()
        // delete the post,  if it return an error, clear the localStorage and reload the page
        await onDelete(post).catch(() => { localStorage.clear(); window.location.reload() })
    }

    const handleLike = function (e) {
        e.preventDefault()
        // if there is a click on like button, check if the userId is already in the likes array, if so, setLike to 0, else set it to 1
        if (JSON.parse(post.likes).length !== 0) {
            JSON.parse(post.likes).map(l => l === parseInt(localStorage.getItem('userId')) ? (setLike(0)) : (setLike(1)))
        } else {
            setLike(1)
        }
    }


    return <li className="posts-list__item">
        <article className="post">
            <header className="post-header">
                <h3 className="post-header__author">{post.name}</h3>
                <div className="post-header__date">{dateFormat(post.created_at)}</div>
            </header>
            <main className="post-main">
                {post.imageUrl ? <img className="post-main__img" src={post.imageUrl} alt="Illustration du post" /> : null}
                <p className="post-main__text">{post.text}</p>

            </main>
            <footer className="post-footer">
                <div className="post-footer-social">
                    <button aria-label="bouton like" onClick={handleLike} className={isLiked ? "post-footer-social__like post-footer-social__like_liked" : "post-footer-social__like"}>
                        <Like stroke='green' className='post-footer-social__like-icon' />
                    </button>
                    <span className="post-footer-social__like-qty">{JSON.parse(post.likes).length}</span>
                    {isLiked ? <span className='post-footer-social__liked'>Vous aimez ce post</span> : null}
                </div>
                {showButtons ?
                    <div className="post-footer__update">
                        <button aria-label="bouton modifier" className="btn post-footer__btn post-footer__btn-update" onClick={() => { onUpdate(post); navigate('/update-post') }}><Pen /><span className="post-footer__btn-text">Modifier</span></button>
                        <button aria-label="bouton supprimer" className="btn post-footer__btn post-footer__btn-delete" onClick={handleDelete}><Trash /><span className="post-footer__btn-text">Supprimer</span></button>
                    </div> : null}
            </footer>

        </article>
    </li>
}