import { ApolloServer } from "apollo-server"
import { typeDefs } from "./types"
import { resolvers } from "./resolvers"
import { defaultQuery } from "./defaultQuery"
import schemaDirectives from "../pkg"

const endpoint = {
  host: `localhost`,
  port: 4000
}

const directives = Object.values(schemaDirectives).map(directive =>
  directive.declaration()
)

const server = new ApolloServer({
  typeDefs: [...typeDefs, ...directives],
  resolvers,
  schemaDirectives,
  playground: {
    tabs: [
      {
        endpoint: `${endpoint.host}:${endpoint.port}`,
        query: defaultQuery
      }
    ]
  }
})

/* eslint-disable */
server.listen(endpoint).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
