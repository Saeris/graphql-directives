import gql from "graphql-tag"
import { SchemaDirectiveVisitor } from "graphql-tools"
import { defaultFieldResolver, GraphQLString } from "graphql"
import dinero from "dinero.js"
import { getTypeMap } from "./utils"

const roundingModeEnum = `
  enum RoundingMode {
    HALF_ODD
    HALF_EVEN
    HALF_UP
    HALF_DOWN
    HALF_TOWARD_ZERO
    HALF_AWAY_FROM_ZERO
  }
`

export class formatCurrency extends SchemaDirectiveVisitor {
  static declaration() {
    return gql`
      directive @formatCurrency(
        defaultFormat: String! = "$0,0.00"
        defaultRoundingMode: RoundingMode! = HALF_AWAY_FROM_ZERO
      ) on FIELD_DEFINITION

      ${roundingModeEnum}
    `
  }

  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    const { defaultFormat, defaultRoundingMode } = this.args

    field.args.push({ name: `format`, type: GraphQLString })
    field.args.push({ name: `currency`, type: GraphQLString })
    field.args.push({
      name: `roundingMode`,
      type: getTypeMap(roundingModeEnum).RoundingMode
    })

    field.resolve = async function(
      source,
      { format, currency, roundingMode, ...args },
      context,
      info
    ) {
      const result = await resolve.call(this, source, args, context, info)
      const transform = input => {
        const config = { amount: result }
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
