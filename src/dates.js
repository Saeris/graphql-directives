import gql from "graphql-tag"
import { SchemaDirectiveVisitor } from "graphql-tools"
import { defaultFieldResolver, GraphQLString } from "graphql"
import { format as formatter } from "date-fns"

export class formatDate extends SchemaDirectiveVisitor {
  static declaration() {
    return gql`
      directive @formatDate(
        defaultFormat: String! = "MMMM D, YYYY"
      ) on FIELD_DEFINITION
    `
  }

  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    const { defaultFormat } = this.args

    field.args.push({ name: `format`, type: GraphQLString })

    field.resolve = async function(source, { format, ...args }, context, info) {
      const result = await resolve.call(this, source, args, context, info)
      const transform = input => formatter(input, format || defaultFormat)
      return Array.isArray(result) ? result.map(transform) : transform(result)
    }

    field.type = GraphQLString
  }
}
