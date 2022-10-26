import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
  }
}
`

export const ALL_BOOKS = gql`
query {
  allBooks {
    title
    published
    author {
      name
      born
    }
    genres
  }
}
`

export const CURRENT_USER = gql`
query {
  me {
    username
    favoriteGenre
  }
}
`

export const BOOKS_BY_GENRE = gql`
query {
  recommends {
    title
    published
    author {
      name
      born
    }
    genres
  }
}
`