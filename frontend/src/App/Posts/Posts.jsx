import React, { useEffect, useState } from 'react';
import { Loader } from '../../ui/Loader';
import { dateFormat } from '../../utils/dateFormat';
import '../../scss/posts.scss'

export function Posts({ posts, onDelete, onUpdate, onLike }) {
    return <div className="posts" >
        {posts === null ? <Loader /> : <PostsList posts={posts} onDelete={onDelete} onUpdate={onUpdate} onLike={onLike} />}
    </div>

}

function PostsList({ posts, onDelete, onUpdate, onLike }) {
    return < ul className="posts__list">
        {posts.map(post => <Post key={post.id} post={post} onDelete={onDelete} onUpdate={onUpdate} onLike={onLike} />)}
    </ul >
}

function Post({ post, onDelete, onUpdate, onLike }) {
    const [showButtons, setShowButtons] = useState(false)
    const [loading, setLoading] = useState(false)
    const [like, setLike] = useState(null)

    const handleDelete = async function (e) {
        e.preventDefault()
        setLoading(true)
        await onDelete(post)
    }

    const handleLike = function (e) {
        e.preventDefault()
        JSON.parse(post.likes).length !== 0 && JSON.parse(post.likes).map(l => l === localStorage.getItem('userId')) ? setLike(0) : setLike(1)
    }

    const handleDislike = function (e) {
        e.preventDefault()
        JSON.parse(post.dislikes).length !== 0 && JSON.parse(post.dislikes).map(l => l === localStorage.getItem('userId')) ? setLike(0) : setLike(-1)
    }

    useEffect(function () {
        if (like !== null) {
            onLike(post, like)
        }
    }, [like])


    useEffect(function () {
        const lsUserId = parseInt(localStorage.getItem('userId'))
        if (lsUserId === post.userId) {
            setShowButtons(true)
        }
    }, [])

    return <li className="card">
        <div className="card__body">
            <h3 className="card__title">{post.title}</h3>
            <p className="card__text">{post.text}</p>
            {post.imageUrl ? <img className="card__img" src={post.imageUrl} alt="Image du post" /> : null}
            <p className="card__author">Post de {post.name}</p>
            <div className="card__date">{dateFormat(post.time_stamp)}</div>
            <div className="social"><button onClick={handleLike} className="social__like"><i className="fa-solid fa-thumbs-up"></i></button><span className="social__likeQty">{JSON.parse(post.likes).length}</span><button onClick={handleDislike} className="social__dislike"><i className="fa-solid fa-thumbs-down"></i></button><span className="social__dislikeQty">{JSON.parse(post.dislikes).length}</span></div>
            {showButtons ? <><button onClick={handleDelete} disabled={loading}>Supprimer</button>  <button onClick={() => onUpdate(post)}>Modifier</button></> : null}
        </div>
    </li>
}