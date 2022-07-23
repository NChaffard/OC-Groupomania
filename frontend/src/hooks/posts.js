import { useReducer } from "react"
import { apiFetch } from "../utils/api"


function reducer(state, action) {
    console.log('POSTS REDUCE', action.type, action)
    switch (action.type) {

        case 'FETCHING_POSTS':
            return { ...state, loading: true }
        case 'SET_POSTS':
            return { ...state, posts: action.payload, loading: false }
        case 'DELETE_POST':
            return { ...state, posts: state.posts.filter(p => p !== action.payload) }
        case 'CREATE_POST':
            return { ...state, posts: [action.payload, ...state.posts] }
        case 'UPDATE_POST':
            return { ...state, posts: state.posts.map(p => p.id === action.payload.id ? action.payload : p) }
        default:
            throw new Error('Action inconnue ' + action.type)
    }
}

export function usePosts() {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        posts: null,
    })


    return {
        posts: state.posts,
        fetchPosts: async function () {
            if (state.loading || state.posts !== null) {
                return
            }
            dispatch({ type: 'FETCHING_POSTS' })
            const posts = await apiFetch('/post')
            dispatch({ type: 'SET_POSTS', payload: posts })
        },
        deletePost: async function (post) {
            await apiFetch('/post/' + post.id, {
                method: 'DELETE'
            })
            dispatch({ type: 'DELETE_POST', payload: post })
        },
        createPost: async function (post) {
            const newPost = await apiFetch('/post', {
                method: 'POST',
                body: JSON.stringify({
                    "text": post.text
                })
            })
            dispatch({ type: 'CREATE_POST', payload: newPost })
        },
        updatePost: async function (post) {
            const newPost = await apiFetch('/post/' + post.id, {
                method: 'PUT',
                body: JSON.stringify({
                    "text": post.text
                })
            })
            dispatch({ type: 'UPDATE_POST', payload: newPost })
        }
    }
}