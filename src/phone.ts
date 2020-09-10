import gql from "graphql-tag"
import { SchemaDirectiveVisitor } from "graphql-tools"
import {
  defaultFieldResolver,
  GraphQLString,
  GraphQLField,
  GraphQLArgument
} from "graphql"
import { parsePhoneNumber, NumberFormat } from "libphonenumber-js"
import { getTypeMap } from "./utils"

const phoneFormats = `
  enum PhoneFormats {
    National
    International
    E164
    RFC3966
  }
`

export class formatPhoneNumber extends SchemaDirectiveVisitor {
  static declaration() {
    return gql`
      directive @formatPhoneNumber(
        defaultFormat: PhoneFormats! = International
      ) on FIELD_DEFINITION

      ${phoneFormats}
    `
  }

  visitFieldDefinition(field: GraphQLField<any, any, any>) {
    const { resolve = defaultFieldResolver } = field
    const { defaultFormat } = this.args
    const getFormat = (raw: string) =>
      raw === `E164` ? `E.164` : raw.toUpperCase()

    field.args.push({
      name: `format`,
      type: getTypeMap(phoneFormats).PhoneFormats
    } as GraphQLArgument)

    field.resolve = async function (
      source,
      { format, ...args },
      context,
      info
    ) {
      const result = await resolve.call(this, source, args, context, info)
      const transform = (input: string) =>
        parsePhoneNumber(input).format(
          getFormat(format || defaultFormat) as NumberFormat
        )
      return Array.isArray(result) ? result.map(transform) : transform(result)
    }

    field.type = GraphQLString
  }
}
