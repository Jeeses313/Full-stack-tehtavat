import blogService from '../services/blogs'

const reducer = (state = [], action) => {
    switch (action.type) {
    case 'LIKE': {
        return state.map(blog => blog.id !== action.data.blog.id ? blog : action.data.blog)
    }
    case 'COMMENT': {
        return state.map(blog => blog.id !== action.data.blog.id ? blog : action.data.blog)
    }
    case 'CREATE': {
        return state.concat(action.data.blog)
    }
    case 'REMOVE': {
        return state.filter(blog => blog.id !== action.data.blog.id)
    }
    case 'INIT_BLOGS': {
        return action.data
    }
    default: return state
    }
}

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch({
            type: 'INIT_BLOGS',
            data: blogs
        })
    }
}

export const likeBlogs = (blog) => {
    return async dispatch => {
        blog.likes = blog.likes + 1
        await blogService.update(blog)
        dispatch({
            type: 'LIKE',
            data: {
                blog: blog
            }
        })
    }
}

export const commentBlogs = (blog, comment) => {
    return async dispatch => {
        await blogService.comment(blog.id, comment)
        blog.comments.push(comment)
        dispatch({
            type: 'COMMENT',
            data: {
                blog: blog
            }
        })
    }
}

export const removeBlogs = (blog) => {
    return async dispatch => {
        await blogService.remove(blog)
        dispatch({
            type: 'REMOVE',
            data: {
                blog: blog
            }
        })
    }
}

export const createBlogs = (blog, user) => {
    return async dispatch => {
        const newBlog = await blogService.create(blog)
        newBlog.user = { username: user.username }
        dispatch({
            type: 'CREATE',
            data: {
                blog: newBlog
            }
        })
    }
}

export default reducer