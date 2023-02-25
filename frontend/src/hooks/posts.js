import { useReducer } from "react"
import { apiFetch } from "../utils/api"

// The reducer set the state with its current state and modify it with the payload given by the dispatch
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
        case 'RESET_POSTS':
            return { ...state, posts: action.payload }
        default:
            throw new Error('Action inconnue ' + action.type)
    }
}
// When usePosts is called, it returns posts data and methods to manipulate it

export function usePosts() {
    // It initialize a state containing posts object and loading boolean
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        posts: null,
    })

    // The method first fetch the data to the API and then dispatch it to the reducer
    // For fetchPosts, it dispatch first FETCHING_POSTS, to set loading to true, to prevent having multiple requests called at the same time
    // Then when api return posts data, SET_POSTS dispatch set loading to false
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
        resetPosts: async function () {

            dispatch({ type: 'RESET_POSTS', payload: null })
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
                body: post
            })
            dispatch({ type: 'CREATE_POST', payload: newPost })
        },
        updatePost: async function (post) {
            const newPost = await apiFetch('/post/' + post.get('id'), {
                method: 'PUT',
                body: post
            })
            dispatch({ type: 'UPDATE_POST', payload: newPost })
        }
    }
}