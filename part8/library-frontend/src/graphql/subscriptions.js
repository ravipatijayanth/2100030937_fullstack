import { gql } from '@apollo/client';

const BOOK_DETAILS = gql`
  fragment bookDetails on Book {
    title
    author {
      name
    }
    published
    genres
  }
`;

export const BOOK_ADDED = gql`
subscription {
    bookAdded {
        ...bookDetails
    }
}
${BOOK_DETAILS}
`