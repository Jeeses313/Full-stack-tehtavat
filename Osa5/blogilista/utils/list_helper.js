const dummy = (blogs) => {
    return (1)
}

const totalLikes = (blogs) => {
    if (blogs.length === 0) {
        return (0)
    }
    return (blogs.map(blog => blog.likes).reduce((total, likes) => total + likes, 0))
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return ({})
    }
    return (blogs.map(blog => { return ({ title: blog.title, author: blog.author, likes: blog.likes }) }).reduce((best, cur) => (best.likes > cur.likes) ? best : cur, { likes: -1 }))
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return ({})
    }
    let authors = []
    for (blog of blogs) {
        if (!authors.find(author => author.author === blog.author)) {
            authors.push({author: blog.author, blogs: 0})
        }
        authors.find(author => author.author === blog.author).blogs += 1
    }
    return (authors.reduce((best, cur) => (best.blogs > cur.blogs) ? best : cur, { blogs: -1 }))
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return ({})
    }
    let authors = []
    for (blog of blogs) {
        if (!authors.find(author => author.author === blog.author)) {
            authors.push({author: blog.author, likes: 0})
        }
        authors.find(author => author.author === blog.author).likes += blog.likes
    }
    return (authors.reduce((best, cur) => (best.likes> cur.likes) ? best : cur, { likes: -1 }))
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}