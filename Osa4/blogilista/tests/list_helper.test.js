const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')
const blogs = helper.initialBlogs
describe('dummy', () => {
    test('dummy returns one', () => {
        const blogs = []

        const result = listHelper.dummy(blogs)
        expect(result).toBe(1)
    })
})

describe('totalLikes', () => {
    test('totalLikes is correct with multiple blogs', () => {

        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })

    test('totalLikes is correct with no blogs', () => {
        const blogs = []

        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(0)
    })

    test('totalLikes is correct with one blog', () => {
        const blogs = [{ likes: 10 }]

        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(10)
    })
})

describe('favoriteBlog', () => {
    test('totalLikes is correct with multiple blogs', () => {
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual({ title: "Canonical string reduction", author: "Edsger W. Dijkstra", likes: 12 })
    })

    test('totalLikes is correct with no blogs', () => {
        const blogs = []
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual({})
    })

    test('totalLikes is correct with one blog', () => {
        const blogs = [{ _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0 }]
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual({ title: "Type wars", author: "Robert C. Martin", likes: 2 })
    })
})

describe('mostBlogs', () => {
    test('totalLikes is correct with multiple blogs', () => {
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual({ author: "Robert C. Martin", blogs: 3})
    })

    test('totalLikes is correct with no blogs', () => {
        const blogs = []
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual({})
    })

    test('totalLikes is correct with one blog', () => {
        const blogs = [{ _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0 }]
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual({ author: "Robert C. Martin", blogs: 1 })
    })
})

describe('mostLikes', () => {
    test('totalLikes is correct with multiple blogs', () => {
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual({ author: "Edsger W. Dijkstra", likes: 17})
    })

    test('totalLikes is correct with no blogs', () => {
        const blogs = []
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual({})
    })

    test('totalLikes is correct with one blog', () => {
        const blogs = [{ _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0 }]
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual({ author: "Robert C. Martin", likes: 2 })
    })
})