import { GraphQLDirective, GraphQLSchema, printSchema } from "graphql"
import gql from "graphql-tag"

export const directiveToString = (
  directive: GraphQLDirective | GraphQLDirective[]
): string =>
  printSchema(
    new GraphQLSchema({
      directives: Array.isArray(directive) ? directive : [directive]
    })
  )

export const directiveToDocumentNode = (
  directive: GraphQLDirective | GraphQLDirective[]
) => gql(directiveToString(directive))
