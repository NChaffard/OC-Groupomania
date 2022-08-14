import React from 'react';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { usePosts } from '../hooks/posts';
import { Posts } from './Posts/Posts';
import { CreatePostForm, UpdatePostForm } from './Posts/PostForm';
import '../scss/site.scss';
import { AddPost } from '../assets/AddPost';
import { Logout } from '../assets/logout';
import { Home } from '../assets/home';

export function Site() {

    const [post, setPost] = useState(null)
    const { pathname } = useLocation()
    const navigate = useNavigate()

    const {
        posts,
        fetchPosts,
        deletePost,
        createPost,
        updatePost,
        likePost
    } = usePosts()

    const handleCreate = async function (data) {
        await createPost(data)
        navigate('/')
    }

    const handleUpdate = async function (data) {
        await updatePost(data)
        setPost(null)
        navigate('/')
    }

    const handleLogout = function () {
        localStorage.clear();
        navigate('/');
    }

    useEffect(function () {
        if (pathname === '/') {
            fetchPosts()
        }
    })


    return (
        <div className="wrapper">
            <header className="header">
                <nav className="nav">
                    <ul className="nav-list">
                        <li className="nav-list__item">
                            <Link to="/" className='nav-list__link' onClick={() => { navigate('/'); window.location.reload() }}><Home className='nav-list__icon' /><span className="nav-list__link-name">Accueil</span></Link>
                        </li>
                        <li className="nav-list__item">
                            <Link to="/add-post" className="nav-list__link" ><AddPost className='nav-list__icon' /><span className="nav-list__link-name">Ajouter un post</span></Link>
                        </li>
                        <li className="nav-list__item">
                            <a href="/" className="nav-list__link" onClick={handleLogout}><Logout className='nav-list__icon' /><span className="nav-list__link-name">Se déconnecter</span></a>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="main">
                <Routes>
                    <Route exact path='/add-post' element={
                        <CreatePostForm onSubmit={handleCreate} />
                    }>
                    </Route>
                    <Route exact path='/update-post' element={
                        <UpdatePostForm post={post} onSubmit={handleUpdate} />
                    }>
                    </Route>
                    <Route exact path='/' element={
                        <Posts posts={posts} onDelete={deletePost} onUpdate={setPost} onLike={likePost} />
                    }>
                    </Route>
                </Routes>
            </main>
        </div >
    )
}
