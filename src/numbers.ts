import { SchemaDirectiveVisitor } from "apollo-server"
import {
  defaultFieldResolver,
  GraphQLDirective,
  DirectiveLocation,
  GraphQLString,
  GraphQLField,
  GraphQLArgument
} from "graphql"
import numeral from "numeral"
import { directiveToString, directiveToDocumentNode } from "./utils"

export class formatNumber extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration() {
    return new GraphQLDirective({
      name: `formatNumber`,
      locations: [DirectiveLocation.FIELD_DEFINITION],
      args: {
        defaultFormat: {
          type: GraphQLString,
          defaultValue: `0,0.0000`
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
      const transform = (input: any) =>
        numeral(input).format(format || defaultFormat)
      return Array.isArray(result) ? result.map(transform) : transform(result)
    }

    field.type = GraphQLString
  }
}
