import React, { useEffect, useState } from 'react';
import { Loader } from '../../ui/Loader';
import { dateFormat } from '../../utils/dateFormat';

export function Posts({ posts, onDelete, onUpdate }) {
    return <div>
        <h1>Posts</h1>
        {posts === null ? <Loader /> : <PostsList posts={posts} onDelete={onDelete} onUpdate={onUpdate} />}
    </div>

}

function PostsList({ posts, onDelete, onUpdate }) {
    return < ul >
        {posts.map(post => <Post key={post.id} post={post} onDelete={onDelete} onUpdate={onUpdate} />)}
    </ul >
}

function Post({ post, onDelete, onUpdate }) {
    const [showButtons, setShowButtons] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async function (e) {
        e.preventDefault()
        setLoading(true)
        await onDelete(post)
    }


    useEffect(function () {
        const lsUserId = parseInt(localStorage.getItem('userId'))
        if (lsUserId === post.userId) {
            setShowButtons(true)
        }
    }, [post])

    return <div className="card">
        <div className="card-body">
            <p className="card-text">{post.text}</p>
            <p className="card-author">Post de {post.name}</p>
            <div className="card-date">{dateFormat(post.time_stamp)}</div>
            {showButtons ? <><button onClick={handleDelete} disabled={loading}>Supprimer</button>  <button onClick={() => onUpdate(post)}>Modifier</button></> : null}
        </div>
    </div>
}