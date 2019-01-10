import { ApolloServer, gql } from 'apollo-server'
import { ReadonlyDataSource } from '@zcong/apollo-datasource-rest-plus'
import { MeDatasource, CommentsDatasource } from './datasource'
import { userLoader } from './dataloader/user'

const endpoint = process.env.BACKEND_ENDPOINT

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User
    created_at: String!
  }

  type PostDetail {
    id: ID!
    title: String!
    content: String!
    author: User!
    created_at: String!
    comments: [Comment]
  }

  type Comment {
    id: ID!
    content: String!
    author: User!
    created_at: String!
  }

  type Token {
    token: String!
  }

  type PostsList {
    totalCount: Int!
    posts: [Post!]!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    avatar: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input PostInput {
    title: String!
    content: String!
  }

  input CommentInput {
    content: String!
    postID: ID!
  }

  type Query {
    me: User!
    posts(limit: Int = 10, offset: Int = 0): PostsList!
    post(id: ID!): PostDetail!
  }

  # type Mutation {
  #   register(registerInput: RegisterInput!): User!
  #   login(loginInput: LoginInput!): Token!
  #   createPost(postInput: PostInput!): Post!
  #   createComment(commentInput: CommentInput!): Comment!
  # }
`

const resolvers = {
  Query: {
    posts: async (
      _source: any,
      { limit, offset }: any,
      { dataSources }: any
    ) => {
      return dataSources.postsApi.list(limit || 10, offset || 0)
    },
    post: async (_source: any, { id }: any, { dataSources }: any) => {
      return dataSources.postsApi.retrieve(id)
    },
    me: async (_source: any, args: any, { dataSources }: any) => {
      return dataSources.meApi.me()
    }
  },
  Post: {
    author: async (_source: any, args: any, { dataSources }: any) => {
      return userLoader.load(_source.author_id)
    }
  },
  PostDetail: {
    author: async (_source: any, args: any, { dataSources }: any) => {
      return userLoader.load(_source.author_id)
    },
    comments: async (_source: any, args: any, { dataSources }: any) => {
      return dataSources.commentsApi.getComments(_source.id)
    }
  },
  Comment: {
    author: async (_source: any, args: any, { dataSources }: any) => {
      return userLoader.load(_source.author_id)
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    postsApi: new ReadonlyDataSource(endpoint, 'posts', 'posts'),
    meApi: new MeDatasource(endpoint),
    commentsApi: new CommentsDatasource(endpoint)
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
