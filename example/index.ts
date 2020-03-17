import { ApolloServer } from "apollo-server"
import { typeDefs } from "./types"
import { resolvers } from "./resolvers"
import { defaultQuery } from "./defaultQuery"
import schemaDirectives from "../pkg"

const host = process.env.HOSTNAME

const endpoint = host
  ? `https://${host.replace(`sse-sandbox-`, ``)}.sse.codesandbox.io`
  : `localhost:9000`

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
        endpoint,
        query: defaultQuery
      }
    ]
  }
})

/* eslint-disable */
server.listen({ host: `localhost`, port: 9000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
