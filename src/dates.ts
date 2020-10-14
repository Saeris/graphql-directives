import { SchemaDirectiveVisitor } from "apollo-server"
import {
  defaultFieldResolver,
  GraphQLDirective,
  DirectiveLocation,
  GraphQLString,
  GraphQLField,
  GraphQLArgument
} from "graphql"
import { default as formatter } from "date-fns/format"
import { directiveToString, directiveToDocumentNode } from "./utils"

export class formatDate extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration() {
    return new GraphQLDirective({
      name: `formatDate`,
      locations: [DirectiveLocation.FIELD_DEFINITION],
      args: {
        defaultFormat: {
          type: GraphQLString,
          defaultValue: `mmmm d, yyyy`
        }
      }
    })
  }

  static toString() {
    return directiveToString(this.getDirectiveDeclaration())
  }

  static toDocumentNode() {
    return directiveToDocumentNode(this.getDirectiveDeclaration())
  }

  visitFieldDefinition(field: GraphQLField<any, any, any>) {
    const { resolve = defaultFieldResolver } = field
    const { defaultFormat } = this.args

    field.args.push({ name: `format`, type: GraphQLString } as GraphQLArgument)

    field.resolve = async function (
      source,
      { format, ...args },
      context,
      info
    ) {
      const result = await resolve.call(this, source, args, context, info)
      const transform = (input: number | Date) =>
        formatter(input, format || defaultFormat)
      return Array.isArray(result) ? result.map(transform) : transform(result)
    }

    field.type = GraphQLString
  }
}
