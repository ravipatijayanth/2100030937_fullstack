require('dotenv').config()
const { ApolloServer, UserInputError, gql, AuthenticationError, PubSub } = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const pubsub = new PubSub()

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

let MONGODB_URI = process.env.MONGODB_URI
let JWT_SECRET = process.env.JWT_SECRET

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})