import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Loader } from '../../ui/Loader';
import { dateFormat } from '../../utils/dateFormat';
import '../../scss/posts.scss'
import { Trash } from '../../assets/Trash';
import { Pen } from '../../assets/Pen';
import { Like } from '../../assets/Like';
import { Dislike } from '../../assets/Dislike';

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
    const [showButtons, setShowButtons] = useState(false)
    const [loading, setLoading] = useState(false)
    const [like, setLike] = useState(null)
    const [likeButton, setLikeButton] = useState(null)
    const navigate = useNavigate()

    const handleDelete = async function (e) {
        e.preventDefault()
        setLoading(true)
        await onDelete(post)
    }

    const handleLike = function (e) {
        e.preventDefault()
        // if there is a click on like button, check if the userId is already in the likes array, if so, setLike to 0, else set it to 1
        if (JSON.parse(post.likes).length !== 0) {
            JSON.parse(post.likes).map(l => l === parseInt(localStorage.getItem('userId')) ? (setLike(0), setLikeButton(0)) : (setLike(1), setLikeButton(1)))
        } else {
            setLike(1)
            setLikeButton(1)
        }
    }

    const handleDislike = function (e) {
        e.preventDefault()
        // if there is a click on dislike button, check if the userId is already in the dislikes array, if so, setLike to 0, else set it to -1
        if (JSON.parse(post.dislikes).length !== 0) {
            JSON.parse(post.dislikes).map(l => l === parseInt(localStorage.getItem('userId')) ? (setLike(0), setLikeButton(0)) : (setLike(-1), setLikeButton(-1)))
        } else {
            setLike(-1)
            setLikeButton(-1)
        }

    }

    useEffect(function () {
        if (like !== null) {
            // If like is not null, send it
            onLike(post, like)
            // setLike(null)

        }
    }, [like, onLike])

    useEffect(function () {
        if (like === null) {
            // On page loading, like is null so we check the likes and dislikes arrays to set likeButton
            JSON.parse(post.likes).map(l => l === parseInt(localStorage.getItem('userId')) ?
                setLikeButton(1) : JSON.parse(post.dislikes).map(l => l === parseInt(localStorage.getItem('userId')) ? setLikeButton(-1) : setLikeButton(0)))
        }
    })


    useEffect(function () {
        const isUserId = parseInt(localStorage.getItem('userId'))
        const isAdmin = parseInt(localStorage.getItem('isAdmin'))
        if (isUserId === post.userId || isAdmin === 1) {
            setShowButtons(true)
        }
    }, [post.userId])

    return <li className="posts-list__item">
        <article className="card">
            <header className="card-header">
                <h3 className="card__author">{post.name}</h3>
                <div className="card__date">{dateFormat(post.time_stamp)}</div>
            </header>
            <main className="card-main">
                {post.imageUrl ? <img className="card__img" src={post.imageUrl} alt="Illustration du post" /> : null}
                <p className="card__text">{post.text}</p>

            </main>
            <footer className="card-footer">
                <span className="social">
                    <button onClick={handleLike} disabled={likeButton === -1 ? true : false} className="social__like">
                        <Like className='social__like-icon' />
                    </button>
                    <span className="social__like-qty">{JSON.parse(post.likes).length}</span>
                    <button onClick={handleDislike} disabled={likeButton === 1 ? true : false} className="social__dislike">
                        <Dislike className='social__dislike-icon' />
                    </button>
                    <span className="social__dislike-qty">{JSON.parse(post.dislikes).length}</span>
                </span>
                {showButtons ? <div className="card-footer__update">
                    <button className="btn card-footer__btn card-footer__btn-update" onClick={() => { onUpdate(post); navigate('/update-post') }}><Pen />Modifier</button>
                    <button className="btn card-footer__btn card-footer__btn-delete" onClick={handleDelete} disabled={loading}><Trash />Supprimer</button>
                </div> : null}
            </footer>

        </article>
    </li>
}