import React from 'react';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { usePosts } from '../hooks/posts';
import { Posts } from './Posts/Posts';
import { CreatePostForm, UpdatePostForm } from './Posts/PostForm';
import logo from '../assets/icon-left-font-monochrome-white.svg';
import '../scss/site.scss';

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
    }, [pathname, fetchPosts])


    return (
        <div className="wrapper">
            <header className="header">
                <nav className="nav">
                    <img className="nav__logo" src={logo} alt="Logo Groupomania" onClick={() => navigate('/')} />
                    <ul className="nav-list">
                        <li className="nav-list__item">
                            <Link to="/addPost" className="nav-list__link" >Ajouter</Link>
                        </li>
                        <li className="nav-list__item">
                            <a href="/" className="nav-list__link" onClick={handleLogout}>Se déconnecter</a>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="main">
                <Routes>
                    <Route exact path='/addPost' element={
                        <CreatePostForm onSubmit={handleCreate} />
                    }>
                    </Route>
                    <Route exact path='/updatePost' element={
                        <UpdatePostForm post={post} onSubmit={handleUpdate} />
                    }>
                    </Route>
                    <Route path='/' element={
                        <Posts posts={posts} onDelete={deletePost} onUpdate={setPost} onLike={likePost} />
                    }>
                    </Route>
                </Routes>
            </main>
        </div>
    )
}
