const { UserInputError, AuthenticationError, PubSub } = require('apollo-server')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const pubsub = new PubSub()

const resolvers = {
    Query: {
        bookCount: () => Book.collection.countDocuments(),
        authorCount: () => Author.collection.countDocuments(),
        findUser: (root, args) => User.findOne({ username: args.username }),
        allBooks: async (root, args) => {
            return await Book.find({}).populate('author')
        },
        allAuthors: async (root, args) => {
            return await Author.find({}).populate('books')
        },
        me: (root, args, context) => {
          return context.currentUser
        },
        recommends: async (root, args, context) => {
          const currentUser = context.currentUser
          if(currentUser){
            const booksToShow = await Book.find({
              genres: {
                $in: [currentUser.favoriteGenre]
              }
            }).populate('author')
            return booksToShow
          } else {
            return await Book.find({}).populate('author')
          }
        }
    },
  
    Author: {
        name: (root) => root.name,
        born: (root) => root.born,
    },
  
    Mutation: {
        addBook: async (root, args, context) => {
            let book
            try {
              const author = await Author.findOne({name: args.author})
              const currentUser = context.currentUser
  
              if (!currentUser) {
                throw new AuthenticationError("Not authenticated")
              }
  
                if (author) {
                  book = new Book({ ...args, author: author._id})
                  author.books = author.books.concat(book._id)
  
                  await author.save()
                  await book.save()
                }
  
                if (!author) {
                  const _id = mongoose.Types.ObjectId()
                  book = new Book({ ...args, author: _id });
  
                  const newAuthor = new Author({
                    name: args.author,
                    born: null,
                    _id,
                    books: [book._id]
                  })
  
                  await newAuthor.save()
                  await book.save()
                }
                
            } catch (error) {
              throw new UserInputError(error.message, {
                invalidArgs: args,
              })
            }
  
            pubsub.publish('BOOK_ADDED', { bookAdded: book })
  
            return book
        },
        editAuthor: async (root, args, context) => {
            const author = await Author.findOne({name: args.name})
            const currentUser = context.currentUser
  
            if(!currentUser) {
              throw new AuthenticationError("Not authenticated")
            }
  
            if (!author) {
              return null
            }
            author.born = args.setBornTo 
  
            try {
              await author.save()
            } catch (error) {
              throw new UserInputError(error.message, {
                invalidArgs: args,
              })
            }
  
            return author     
        },
        createUser: (root, args) => {
          const user = new User({ ...args })
      
          return user.save()
            .catch(error => {
              throw new UserInputError(error.message, {
                invalidArgs: args,
              })
            })
        },
        login: async (root, args) => {
          const user = await User.findOne({ username: args.username })
  
          if ( !user || args.password !== 'secret' ) {
            throw new UserInputError("Wrong credentials")
          }
      
          const userForToken = {
            username: user.username,
            id: user._id,
          }
      
          return { value: jwt.sign(userForToken, JWT_SECRET) }
        }
    },
    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
      }
    }
  }

module.exports = resolvers