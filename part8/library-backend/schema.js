const { gql } = require('apollo-server')

const typeDefs = gql`

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Subscription {
    bookAdded: Book!
  }

  type Mutation {
      addBook(
          title: String!
          published: Int!
          author: String!
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

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
      name: String
      born: Int
      books: [Book]
  }

  type Query {
      bookCount: Int!
      authorCount: Int!
      findUser (username: String): User
      allBooks: [Book]
      allAuthors: [Author]
      me: User  
      recommends: [Book]
  }
`

module.exports = typeDefs