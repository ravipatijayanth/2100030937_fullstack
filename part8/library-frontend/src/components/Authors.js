  
import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'

import { ALL_AUTHORS } from '../graphql/queries'
import { UPDATE_AUTHOR } from '../graphql/mutations'

const Authors = ({show, authors, notify}) => {

  const [ name, setName ] = useState('') 
  const [ born, setBorn ] = useState('')

  const [ changeBorn, result ] = useMutation(UPDATE_AUTHOR, {
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_AUTHORS })
      store.writeQuery({
        query: ALL_AUTHORS,
        data: {
          ...dataInStore,
          allAuthors: [ ...dataInStore.allAuthors.map(author => 
            author.name === response.data.editAuthor.name ? author.born === response.data.editAuthor.born : author.born
          )]
        }
      })
    }
  })

  useEffect(() => {
    if (result.data && !result.data.editAuthor) {
      notify('Author not found')
    }
  }, [result.data])  // eslint-disable-line

  const changeSelected = (event) => {
    setName(event.target.value)
  }

  const submit = (event) => {
    event.preventDefault()

    changeBorn({ variables: { name, born } })

    setName('')
    setBorn('')
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Update Born</h2>
      <form onSubmit={submit}>
        <div>
          Name
          <select onChange={changeSelected} defaultValue="Select">
            <option disabled>Select</option>
            {authors.map(a => 
              <option key={a.name} value={a.name}>{a.name}</option>)}
          </select>
        </div>
        <div>
          Born
          <input 
            type="number"
            value={born}
            onChange={({target}) => setBorn(Number(target.value))}
          />
        </div>
        <button>Update</button>
      </form>

    </div>
  )
}

export default Authors
