import { ApolloServer, gql } from 'apollo-server'
import { RedisCache } from 'apollo-server-cache-redis'
import { ReadonlyDataSource } from '@zcong/apollo-datasource-rest-plus'
import { UserDatasource, MeDatasource } from './datasource'
import { userLoader } from './dataloader/user'

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

  type BookList implements PagedData {
    totalCount: Int!
    data: [Book]!
  }

  interface PagedData {
    totalCount: Int!
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books(limit: Int!, offset: Int!): PagedData!
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
      // return dataSources.usersApi.getUser(_source.author_id)
      return userLoader.load(_source.author_id)
    }
  },
  PagedData: {
    __resolveType(data: any, context: any, info: any) {
      if (data.data[0].title) {
        // console.log(info.schema)
        return info.schema.getType('BookList')
      }
      return null
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
