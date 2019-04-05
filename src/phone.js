import gql from "graphql-tag"
import { SchemaDirectiveVisitor } from "graphql-tools"
import { defaultFieldResolver, GraphQLString } from "graphql"
import { parsePhoneNumber } from "libphonenumber-js"
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

  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    const { defaultFormat } = this.args
    const getFormat = raw => (raw === `E164` ? `E.164` : raw.toUpperCase())

    field.args.push({
      name: `format`,
      type: getTypeMap(phoneFormats).PhoneFormats
    })

    field.resolve = async function(source, { format, ...args }, context, info) {
      const result = await resolve.call(this, source, args, context, info)
      const transform = input =>
        parsePhoneNumber(input).format(getFormat(format || defaultFormat))
      return Array.isArray(result) ? result.map(transform) : transform(result)
    }

    field.type = GraphQLString
  }
}
