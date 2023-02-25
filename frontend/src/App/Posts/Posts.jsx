import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Imports utils
import { dateFormat } from '../../utils/dateFormat';
// Import css
import '../../scss/posts.scss'
// Import icons
import { Loader } from '../../ui/Loader';
import { Trash, Pen } from '../../assets/Icons';

export function Posts({ posts, onDelete, onUpdate }) {
    return <div className="posts" >
        {posts === null ? <Loader /> : <PostsList posts={posts} onDelete={onDelete} onUpdate={onUpdate} />}
    </div>

}

function PostsList({ posts, onDelete, onUpdate }) {
    return < ul className="posts-list">
        {posts.map(post => <Post key={post.id} post={post} onDelete={onDelete} onUpdate={onUpdate} />)}
    </ul >
}

function Post({ post, onDelete, onUpdate }) {
    // States
    // Toggle showing or not update and delete buttons 
    const [showButtons, setShowButtons] = useState(false)

    // Used for navigate to other url
    const navigate = useNavigate()

    // UseEffects



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

    return <li className="posts-list__item">
        <article className="post">
            <header className="post-header">
                <h3 className="post-header__author">{post.user.name}</h3>
                <div className="post-header__date">{dateFormat(post.createdAt)}</div>
            </header>
            <main className="post-main">
                {post.imageUrl ? <img className="post-main__img" src={post.imageUrl} alt="Illustration du post" /> : null}
                <p className="post-main__text">{post.text}</p>

            </main>
            <footer className="post-footer">
                {showButtons ?
                    <div className="post-footer__update">
                        <button
                            aria-label="bouton modifier"
                            className="btn post-footer__btn post-footer__btn-update"
                            onClick={() => { onUpdate(post); navigate('/update-post') }}>
                            <Pen /><span className="post-footer__btn-text">Modifier</span>
                        </button>
                        <button
                            aria-label="bouton supprimer"
                            className="btn post-footer__btn post-footer__btn-delete"
                            onClick={handleDelete}>
                            <Trash /><span className="post-footer__btn-text">Supprimer</span>
                        </button>
                    </div> : null}
            </footer>

        </article>
    </li>
}