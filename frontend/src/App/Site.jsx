import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { usePosts } from '../hooks/posts';
import { Posts } from './Posts/Posts';
import { CreatePostForm, UpdatePostForm } from './Posts/PostForm'

export function Site() {

    const [page, setPage] = useState('posts')
    const [post, setPost] = useState(null)

    const {
        posts,
        fetchPosts,
        deletePost,
        createPost,
        updatePost,
    } = usePosts()
    const handleCreate = async function (data) {
        await createPost(data)
        setPage('posts')
    }
    const handleUpdate = async function (data) {
        await updatePost(data)
        setPost(null)
    }

    let content = null
    if (page === 'posts') {
        content = <Posts posts={posts} onDelete={deletePost} onUpdate={setPost} />
    }
    else if (page === 'addPost') {
        content = <CreatePostForm onSubmit={handleCreate} />
    }
    else if (page === 'logout') {
        localStorage.clear()
        window.location.reload()
    }
    else if (page === 'updatePost') {
        post ? content = <UpdatePostForm post={post} onSubmit={handleUpdate} /> : setPage('posts')
    }



    useEffect(function () {
        if (page === 'posts') {
            fetchPosts()
        }
    }, [page, fetchPosts])

    useEffect(function () {
        if (post) {
            setPage('updatePost')
        } else {
            setPage('posts')
        }
    }, [post])


    return <>
        <NavBar currentPage={page} onClick={setPage} />
        {content}
    </>
}

function NavBar({ currentPage, onClick }) {

    const navClass = function (page) {
        let className = 'nav-item'
        if (page === currentPage) {
            className = 'nav-item active'
        }
        return className;
    }
    return <nav className="navbar">
        <a href="#home" className='navbar-brand'>Groupomania</a>
        <ul className="nav-list">
            <li className={navClass('posts')}>
                <a href="#posts" className="nav-link" onClick={() => onClick('posts')}>Posts</a>
            </li>
            <li className={navClass('addPost')}>
                <a href="#addPost" className="nav-link" onClick={() => onClick('addPost')}>Ajouter</a>
            </li>
            <li className={navClass('logout')}>
                <a href="#logout" className="nav-link" onClick={() => onClick('logout')}>Se déconnecter</a>
            </li>

        </ul>
    </nav>
}