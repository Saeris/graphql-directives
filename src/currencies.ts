import { SchemaDirectiveVisitor } from "apollo-server"
import {
  defaultFieldResolver,
  GraphQLDirective,
  DirectiveLocation,
  GraphQLString,
  GraphQLEnumType,
  GraphQLField,
  GraphQLArgument
} from "graphql"
import dinero from "dinero.js"
import { directiveToString, directiveToDocumentNode } from "./utils"

const RoundingMode = new GraphQLEnumType({
  name: `RoundingMode`,
  values: {
    HALF_ODD: {},
    HALF_EVEN: {},
    HALF_UP: {},
    HALF_DOWN: {},
    HALF_TOWARD_ZERO: {},
    HALF_AWAY_FROM_ZERO: {}
  }
})

export class formatCurrency extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration() {
    return new GraphQLDirective({
      name: `formatCurrency`,
      locations: [DirectiveLocation.FIELD_DEFINITION],
      args: {
        defaultFormat: {
          type: GraphQLString,
          defaultValue: `$0,0.00`
        },
        defaultRoundingMode: {
          type: RoundingMode,
          defaultValue: `HALF_AWAY_FROM_ZERO`
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
    const { defaultFormat, defaultRoundingMode } = this.args

    field.args.push({ name: `format`, type: GraphQLString } as GraphQLArgument)
    field.args.push({
      name: `currency`,
      type: GraphQLString
    } as GraphQLArgument)
    field.args.push({
      name: `roundingMode`,
      type: RoundingMode
    } as GraphQLArgument)

    field.resolve = async function (
      source,
      { format, currency, roundingMode, ...args },
      context,
      info
    ) {
      const result = await resolve.call(this, source, args, context, info)
      const transform = (input: number) => {
        const config: dinero.Options = { amount: input }
        if (currency) config.currency = currency
        return dinero(config).toFormat(
          format || defaultFormat,
          roundingMode || defaultRoundingMode
        )
      }
      return Array.isArray(result) ? result.map(transform) : transform(result)
    }

    field.type = GraphQLString
  }
}
