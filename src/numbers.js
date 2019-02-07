import { SchemaDirectiveVisitor } from "graphql-tools"
import {
  defaultFieldResolver,
  DirectiveLocation,
  GraphQLDirective,
  GraphQLString
} from "graphql"
import numeral from "numeral"

export class formatNumber extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration(directiveName) {
    return new GraphQLDirective({
      name: directiveName,
      locations: DirectiveLocation.FIELD_DEFINITION,
      args: {
        requires: {
          defaultFormat: `0,0.0000`
        }
      }
    })
  }

  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    const { defaultFormat } = this.args

    field.args.push({ name: `format`, type: GraphQLString })

    field.resolve = async function(source, { format, ...args }, context, info) {
      const result = await resolve.call(this, source, args, context, info)
      return numeral(result).format(format || defaultFormat)
    }

    field.type = GraphQLString
  }
}
