import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'
import Notification from './components/Notification'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED, ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [notification, setNotification] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const userToken = window.localStorage.getItem('GraphQL-library-user-token')

    if (userToken) {
      setToken(userToken)
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const newBook = data.data.bookAdded

      setNotification(
        `${newBook.title} by ${newBook.author.name} was added by another user`
      )

      client.cache.updateQuery(
        { query: ALL_BOOKS, variables: { genre: null } },
        ({ allBooks }) => {
          return {
            allBooks: allBooks.concat(newBook),
          }
        }
      )
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      setPage('books')
    },
  })

  const logout = () => {
    setPage('authors')
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>

          <button onClick={() => setPage('login')}>login</button>
        </div>
        <Notification notification={notification} />
        <Authors show={page === 'authors'} />

        <Books show={page === 'books'} />

        <LoginForm
          show={page === 'login'}
          setToken={setToken}
          setPage={setPage}
          setNotification={setNotification}
        />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('recommended')}>recommendations</button>

        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => logout()}>logout</button>
      </div>
      <Notification notification={notification} />
      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} setNotification={setNotification} />

      <Recommended show={page === 'recommended'} />
    </div>
  )
}

export default App
