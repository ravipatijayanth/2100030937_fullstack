
import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'

import { useQuery, useApolloClient, useSubscription } from '@apollo/client'

import { ALL_AUTHORS, ALL_BOOKS } from './graphql/queries'
import { BOOK_ADDED } from './graphql/subscriptions'

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }

  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  useEffect(() => {
    const tokenSaved = localStorage.getItem('userToken')
    if (tokenSaved){
      setToken(tokenSaved)
    }
  }, [])

  const updateCacheWith = (addedBook) => {
    const includeIn = (set, object) => 
      set.map(b => b.id).includes(object.id)

      const dataInStore = client.readQuery({ query: ALL_BOOKS })
      if(!includeIn(dataInStore.allBooks, addedBook)) {
        client.writeQuery({
          query: ALL_BOOKS,
          data: { allBooks: dataInStore.allBooks.concat(addedBook) }
        })
      }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      console.log(addedBook)
      notify(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    }
  })

  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const client =  useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }
  
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (authors.loading || books.loading) {
    return <div>loading...</div>
  } else {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          {token === null
            ? <button onClick={() => setPage('login')}>Login</button>
            : <>
                <button onClick={() => setPage('add')}>add book</button>
                <button onClick={() => setPage('recommend')}>recommend</button>
                <button onClick={logout}>logout</button>
              </>
          }
        </div>

        <Notify errorMessage={errorMessage} />
  
        <Authors
          show={page === 'authors'} authors={authors.data.allAuthors} notify={notify}
        />
  
        <Books
          show={page === 'books'} books={books.data.allBooks}
        />
  
        <NewBook
          show={page === 'add'} setError={notify}
        />

        <Login 
          show={page === 'login'}
          setToken={setToken}
          setError={notify}
          setPage={setPage}
        />

        <Recommend
          show={page === 'recommend'}
          books={books.data.allBooks}
        />
  
      </div>
    )
  }
}

export default App