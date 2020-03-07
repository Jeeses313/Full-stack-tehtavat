
import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { gql, useQuery, useLazyQuery, useMutation, useSubscription, useApolloClient } from '@apollo/client';

const AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
    
  }
`

const BOOKS = gql`
  query fetchBooks($genre: String, $author: String) {
    allBooks(
      author: $author,
      genre: $genre
    ) {
      title
      author {
        name
      }
      published
      genres
      id
    }
  }
`

const GENRES = gql`
  query {
    genres
  }
`

const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      published
      genres
      id
    }
  }
`

const SET_BIRTHYEAR = gql`
  mutation setBirthyear($name: String!, $setBornTo: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
    ) {
      name
      bookCount
      born
      id
    }
  }
`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      author {
        name
      }
      published
      genres
      id
    }
  }
`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
      user {
        username
        favoriteGenre
      }
    }
  }
`



const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState('')
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [genres, setGenres] = useState([])
  const [genre, setGenre] = useState(null) // eslint-disable-line
  const [loadAuthors, authorResult] = useLazyQuery(AUTHORS)
  const genreResult = useQuery(GENRES)
  const [books, setBooks] = useState([])
  const [authors, setAuthors] = useState([])
  const [loadBooks, bookResult] = useLazyQuery(BOOKS, { variables: { author: null, genre: null } })
  const refetchQueriesAndHandleError = {
    refetchQueries: [{ query: AUTHORS }, { query: BOOKS }, { query: GENRES }],
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
      setTimeout(() => {
        setErrorMessage('')
      }, 10000)
    }
  }
  const [createBook] = useMutation(CREATE_BOOK, refetchQueriesAndHandleError)
  const [setBirthyear] = useMutation(SET_BIRTHYEAR, refetchQueriesAndHandleError)
  const client = useApolloClient()
  useEffect(() => {
    if (!genreResult.loading) {
      setGenres(genreResult.data.genres)
    }
  }, [genreResult])
  useEffect(() => {
    if (bookResult.data) {
      setBooks(bookResult.data.allBooks)
    }
  }, [bookResult.data])
  useEffect(() => {
    if(authorResult.data) {
      setAuthors(authorResult.data.allAuthors)
    }
  }, [authorResult.data])
  useEffect(() => {
    if(authors.length === 0) {
      loadAuthors()
    }
    const loggedToken = localStorage.getItem('user-token')
    const loggedUser = localStorage.getItem('logged-user')
    if (loggedToken) {
      setToken(loggedToken)
    }
    if (loggedUser) {
      setUser(JSON.parse(loggedUser))
    }
  }, []) // eslint-disable-line
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      window.alert(`New book added: ${subscriptionData.data.bookAdded.title}`)
      if(page === 'recommendation') {
        loadBooks({ variables: { genre: user.favoriteGenre } })
      } else {
        loadBooks({ variables: { genre: genre } })
      }
      loadAuthors()
    }
  })


  const logout = () => {
    localStorage.clear()
    client.resetStore()
    setToken(null)
    setUser(null)
    setPage("authors")
  }

  const goToBooks = () => {
    setGenre(null)
    loadBooks({ options: { fetchPolicy: 'network-only' } })
    setPage('books')
  }

  const goToRecommend = async () => {
    setGenre(user.favoriteGenre)
    loadBooks({ variables: { genre: user.favoriteGenre }, options: { fetchPolicy: 'network-only' } })
    setPage('recommendation')
  }

  let resultPage = <div>loading...</div>
  let logButton = <button onClick={() => setPage('login')}>login</button>
  let loggedInButtons = null
  if (token) {
    loggedInButtons = (
      <>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={goToRecommend}>recommend</button>
      </>
    )
    logButton = <button onClick={logout}>logout</button>
  }

  if (!authorResult.loading && authorResult.data) {
    resultPage = <>
      <Authors
        token={token}
        show={page === 'authors'}
        authors={authors}
        setBirthyear={setBirthyear}
        loadAuthors={loadAuthors}
      />
      <Books
        show={page === 'books'}
        books={books}
        genres={genres}
        loadBooks={loadBooks}
        setGenre={setGenre}
      />
      <NewBook
        show={page === 'add'}
        createBook={createBook}
      />
      <Recommendations
        show={page === 'recommendation'}
        books={books}
      />
      <LoginForm show={page === 'login'} setPage={setPage} LOGIN={LOGIN} refetchQueriesAndHandleError={refetchQueriesAndHandleError} setToken={setToken} setUser={setUser} client={client} />
    </>
  }


  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={goToBooks}>books</button>
        {loggedInButtons}
        {logButton}
      </div>
      <div style={{ color: 'red' }}>{errorMessage}</div>
      {resultPage}
    </div>
  )
}

export default App