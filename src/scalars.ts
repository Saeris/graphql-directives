import { GraphQLScalarType, GraphQLScalarTypeConfig } from "graphql"

export class MaxLength extends GraphQLScalarType {
  constructor(
    type: Readonly<GraphQLScalarTypeConfig<any, any>>,
    limit: number
  ) {
    super({
      name: `MaxLength${limit}`,

      serialize(value) {
        const serialized = type?.serialize?.(value)
        if (typeof value === `string` && value.length <= limit) {
          return serialized
        }
        if (typeof value === `number` && !isNaN(value) && value <= limit) {
          return serialized
        }
        throw new TypeError(`Value exceeds limit: ${limit}`)
      },

      parseValue(value) {
        return type.parseValue?.(value)
      },

      parseLiteral(ast) {
        return type.parseLiteral?.(ast, {})
      }
    })
  }
}

export class MinLength extends GraphQLScalarType {
  constructor(
    type: Readonly<GraphQLScalarTypeConfig<any, any>>,
    limit: number
  ) {
    super({
      name: `MinLength${limit}`,

      serialize(value) {
        const serialized = type?.serialize?.(value)
        if (typeof value === `string` && value.length >= limit) {
          return serialized
        }
        if (typeof value === `number` && !isNaN(value) && value >= limit) {
          return serialized
        }
        throw new TypeError(`Value beneath limit: ${limit}`)
      },

      parseValue(value) {
        return type.parseValue?.(value)
      },

      parseLiteral(ast) {
        return type.parseLiteral?.(ast, {})
      }
    })
  }
}

export class GreaterThan extends GraphQLScalarType {
  constructor(
    type: Readonly<GraphQLScalarTypeConfig<any, any>>,
    limit: number
  ) {
    super({
      name: `GreaterThan${limit}`,

      serialize(value) {
        const serialized = type?.serialize?.(value)
        if (typeof value === `number` && !isNaN(value) && value > limit) {
          return serialized
        }
        throw new TypeError(`Value beneath limit: ${limit}`)
      },

      parseValue(value) {
        return type.parseValue?.(value)
      },

      parseLiteral(ast) {
        return type.parseLiteral?.(ast, {})
      }
    })
  }
}

export class LessThan extends GraphQLScalarType {
  constructor(
    type: Readonly<GraphQLScalarTypeConfig<any, any>>,
    limit: number
  ) {
    super({
      name: `LessThan${limit}`,

      serialize(value) {
        const serialized = type?.serialize?.(value)
        if (typeof value === `number` && !isNaN(value) && value < limit) {
          return serialized
        }
        throw new TypeError(`Value exceeds limit: ${limit}`)
      },

      parseValue(value) {
        return type.parseValue?.(value)
      },

      parseLiteral(ast) {
        return type.parseLiteral?.(ast, {})
      }
    })
  }
}
