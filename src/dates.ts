import gql from "graphql-tag"
import { SchemaDirectiveVisitor } from "graphql-tools"
import {
  defaultFieldResolver,
  GraphQLString,
  GraphQLField,
  GraphQLArgument
} from "graphql"
import { default as formatter } from "date-fns/format"

export class formatDate extends SchemaDirectiveVisitor {
  static declaration() {
    return gql`
      directive @formatDate(
        defaultFormat: String! = "mmmm d, yyyy"
      ) on FIELD_DEFINITION
    `
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
