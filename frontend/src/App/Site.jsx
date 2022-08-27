import React from 'react';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { usePosts } from '../hooks/posts';
import { Posts } from './Posts/Posts';
import { CreatePostForm, UpdatePostForm } from './Posts/PostForm';

// css
import '../scss/site.scss';

// Icons
import { AddPost, Logout, Home } from '../assets/Icons';

// Images
import logo from '../assets/icon-left-font-monochrome-white.svg';

export function Site() {


    // Contain post to modify
    const [post, setPost] = useState(null)

    // Used to refresh posts
    const [refresh, setRefresh] = useState(false)

    // Contain current url
    const { pathname } = useLocation()

    // Used for navigate to other url
    const navigate = useNavigate()

    // Import object and method from posts hook
    const {
        posts,
        fetchPosts,
        resetPosts,
        deletePost,
        createPost,
        updatePost,
        likePost
    } = usePosts()

    // UseEffects

    useEffect(function () {
        // If refresh is true, reset the posts 
        if (pathname === '/' && posts !== null && refresh === true) {
            resetPosts()
            setRefresh(false)
        }

    }, [pathname, posts, refresh, resetPosts])

    useEffect(function () {
        // fetchposts works if posts is null
        fetchPosts().catch(() => { localStorage.clear(); window.location.reload() })

    })

    // Handles
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



    return (
        <div className="wrapper">
            <header className="header">
                <nav className="nav">
                    <img className="nav__mobile-logo" src={logo} alt="Logo Groupomania" />
                    <ul className="nav-list">
                        <li className="nav-list__item">
                            <Link to="/" className='nav-list__link' aria-label='Accueil' onClick={() => setRefresh(true)} ><Home className='nav-list__icon' /><span className="nav-list__link-name">Accueil</span></Link>
                        </li>
                        <li className="nav-list__item">
                            <Link to="/add-post" className="nav-list__link" aria-label='Ajouter un post'><AddPost className='nav-list__icon' /><span className="nav-list__link-name">Ajouter un post</span></Link>
                        </li>
                        <li className="nav-list__item">
                            <a href="/" className="nav-list__link" aria-label='Se déconnecter' onClick={handleLogout}><Logout className='nav-list__icon' /><span className="nav-list__link-name">Se déconnecter</span></a>
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
