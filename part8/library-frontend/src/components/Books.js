import React, { useState } from 'react'

const Books = ({books, show}) => {

  const [filter, setFilter] = useState('')

  if (!show) {
    return null
  }

  const onChangeFilter = (event) => {
    setFilter(event.target.value)
  }

  let filterBooks
  if (!filter || filter === 'All') {
    filterBooks = books
  } else {
    filterBooks = books.filter(book => book.genres.includes(filter))
  }
  
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {filterBooks.map(b =>
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>
          <div>
            Filter
            <select onChange={onChangeFilter} defaultValue="All">
              <option value="All">All</option>
              <option value="database">database</option>
              <option value="nosql">nosql</option>
              <option value="classic">classic</option>
              <option value="revolution">revolution</option>
              <option value="refactoring">refactoring</option>
              <option value="design">design</option>
              <option value="Drama">Drama</option>
            </select>
          </div>
    </div>
  )
}

export default Books