import { SchemaDirectiveVisitor } from "graphql-tools"
import {
  defaultFieldResolver,
  DirectiveLocation,
  GraphQLDirective,
  GraphQLString
} from "graphql"
import transform from "date-fns/format"

export class formatDate extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration(directiveName) {
    return new GraphQLDirective({
      name: directiveName,
      locations: DirectiveLocation.FIELD_DEFINITION,
      args: {
        requires: {
          defaultFormat: `MMMM D, YYYY`
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
      return transform(result, format || defaultFormat)
    }

    field.type = GraphQLString
  }
}
