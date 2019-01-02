import { ApolloServer, gql } from 'apollo-server'
import { RedisCache } from 'apollo-server-cache-redis'
import { ReadonlyDataSource } from '@zcong/apollo-datasource-rest-plus'
import { UserDatasource, MeDatasource } from './datasource'

const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: User
  }

  type User {
    username: String
    email: String
  }

  type BookList {
    totalCount: Int!
    data: [Book]!
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books(limit: Int!, offset: Int!): BookList!
    getBook(id: Int!): Book!
    me: User!
  }
`

const resolvers = {
  Query: {
    books: async (
      _source: any,
      { limit, offset }: any,
      { dataSources }: any
    ) => {
      return dataSources.booksApi.list(limit, offset)
    },
    getBook: async (_source: any, { id }: any, { dataSources }: any) => {
      return dataSources.booksApi.retrieve(id)
    },
    me: async (_source: any, args: any, { dataSources }: any) => {
      return dataSources.meApi.me()
    }
  },
  Book: {
    author: async (_source: any, args: any, { dataSources }: any) => {
      return dataSources.usersApi.getUser(_source.author_id)
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: new RedisCache({
    host: 'localhost'
  }),
  dataSources: () => ({
    booksApi: new ReadonlyDataSource('http://localhost:8080/v1/', 'books'),
    usersApi: new UserDatasource(),
    meApi: new MeDatasource()
  }),
  context: ({ req }: any) => {
    return {
      token: req.headers.authorization
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
