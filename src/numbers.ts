import gql from "graphql-tag"
import { SchemaDirectiveVisitor } from "graphql-tools"
import {
  defaultFieldResolver,
  GraphQLString,
  GraphQLField,
  GraphQLArgument
} from "graphql"
import numeral from "numeral"

export class formatNumber extends SchemaDirectiveVisitor {
  static declaration() {
    return gql`
      directive @formatNumber(
        defaultFormat: String! = "0,0.0000"
      ) on FIELD_DEFINITION
    `
  }

  visitFieldDefinition(field: GraphQLField<any, any, any>) {
    const { resolve = defaultFieldResolver } = field
    const { defaultFormat } = this.args

    field.args.push({ name: `format`, type: GraphQLString } as GraphQLArgument)

    field.resolve = async function(source, { format, ...args }, context, info) {
      const result = await resolve.call(this, source, args, context, info)
      const transform = (input: any) =>
        numeral(input).format(format || defaultFormat)
      return Array.isArray(result) ? result.map(transform) : transform(result)
    }

    field.type = GraphQLString
  }
}
