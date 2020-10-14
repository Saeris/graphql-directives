import { SchemaDirectiveVisitor } from "apollo-server"
import {
  defaultFieldResolver,
  GraphQLDirective,
  DirectiveLocation,
  GraphQLEnumType,
  GraphQLString,
  GraphQLField,
  GraphQLArgument
} from "graphql"
import { parsePhoneNumber, NumberFormat } from "libphonenumber-js"
import { directiveToString, directiveToDocumentNode } from "./utils"

const PhoneFormats = new GraphQLEnumType({
  name: `PhoneFormats`,
  values: {
    National: {},
    International: {},
    E164: {},
    RFC3966: {}
  }
})

export class formatPhoneNumber extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration() {
    return new GraphQLDirective({
      name: `formatPhoneNumber`,
      locations: [DirectiveLocation.FIELD_DEFINITION],
      args: {
        defaultFormat: {
          type: PhoneFormats,
          defaultValue: `International`
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
    const getFormat = (raw: string) =>
      raw === `E164` ? `E.164` : raw.toUpperCase()

    field.args.push({
      name: `format`,
      type: PhoneFormats
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
