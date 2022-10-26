import React from 'react'
import { useQuery } from '@apollo/client'
import { CURRENT_USER, BOOKS_BY_GENRE } from '../graphql/queries'

const Recommend = ({ books, show }) => {
    const booksByGenre = useQuery(BOOKS_BY_GENRE)
    const user = useQuery(CURRENT_USER)

    if (!show || user === null || !booksByGenre.data) {
        return null
    }

    const booksToShow = booksByGenre.data.recommends

    return(
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
            {booksToShow.map(b =>
                <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
                </tr>
            )}
            </tbody>
        </table>
    ) 
}

export default Recommend