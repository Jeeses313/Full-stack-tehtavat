const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
require('dotenv').config();
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
let MONGODB_URI = process.env.MONGODB_URI
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET
console.log('connecting to', MONGODB_URI)
const { PubSub } = require('apollo-server')
const pubsub = new PubSub()

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })

const typeDefs = gql`
    type Author {
        name: String!
        born: Int
        id: ID!
        bookCount: Int!
    }

    type Book {
        title: String!
        published: Int!
        author: Author!
        genres: [String!]!
        id: ID!
    }

    type User {
        username: String!
        favoriteGenre: String!
        id: ID!
    }
      
    type Token {
        value: String!
        user: User!
    }

    type Query {
        authorCount: Int!
        bookCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
        genres: [String!]!
        me: User
    }

    type Mutation {
        addBook(
            title: String!
            author: String!
            published: Int!
            genres: [String!]!
        ): Book
        editAuthor(
            name: String!
            setBornTo: Int!
        ): Author
        createUser(
            username: String!
            favoriteGenre: String!
        ): User
        login(
            username: String!
            password: String!
        ): Token
    }

    type Subscription {
        bookAdded: Book!
    }
`

const resolvers = {
    Query: {
        authorCount: () => Author.collection.countDocuments(),
        bookCount: () => Book.collection.countDocuments(),
        allBooks: async (root, args) => {
            const params = {}
            if (args.author) {
                const author = await Author.findOne({ name: args.author })
                params.author = author.id
            }
            if (args.genre) {
                params.genres = args.genre
            }
            return await Book.find(params).populate('author', { name: 1, born: 1 })
        },
        allAuthors: () => Author.find({}),
        me: (root, args, context) => {
            return context.currentUser
        },
        genres: async () => {
            const books = await Book.find({})
            let genres = []
            books.forEach(book => {
                book.genres.forEach(genre => {
                    if (!genres.includes(genre)) {
                        genres.push(genre)
                    }
                })
            })
            return genres
        }
    },
    Mutation: {
        addBook: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new AuthenticationError("Not authenticated")
            }
            const book = new Book({ ...args })
            let newAuthor = false
            let author = await Author.findOne({ name: args.author })
            if (!author) {
                newAuthor = true
                author = await new Author({ name: args.author, bookCount: 0 })
                author = await author.save().catch(error => {
                    throw new UserInputError('Name of the author must be at least 4 characters long')
                })
            }
            await Author.findOneAndUpdate({ name: args.author }, { bookCount: author.bookCount + 1 }, { new: true })
            book.author = author.id
            return await book.save()
                .then(response => {
                    const book = response
                    book.author = author
                    pubsub.publish('BOOK_ADDED', { bookAdded: book })
                    return response
                })
                .catch(async error => {
                    if (newAuthor) {
                        await Author.deleteOne({ name: args.author })
                    }
                    throw new UserInputError('Title of the book must be at least 2 characters long')
                })
        },
        editAuthor: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new AuthenticationError("Not authenticated")
            }
            const author = await Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo }, { new: true })
            return author
        },
        createUser: async (root, args) => {
            const user = new User({ ...args })
            return user.save().catch(error => {
                throw new UserInputError('Username must be at least 3 characters long and unique')
            })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if (!user || args.password !== 'secret') {
                throw new UserInputError("wrong credentials")
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, SECRET), user: { username: user.username, favoriteGenre: user.favoriteGenre } }
        }
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
            const decodedToken = jwt.verify(auth.substring(7), SECRET)
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
        }
    }
})

server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`Server ready at ${url}`)
    console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})