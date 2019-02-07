import { GraphQLScalarType } from "graphql"
import Joi from "joi"

export class MaxLength extends GraphQLScalarType {
  constructor(type, limit) {
    super({
      name: `MaxLength${limit}`,

      serialize(value) {
        value = type.serialize(value)
        Joi.assert(
          value,
          [Joi.string().max(limit), Joi.number().max(limit)],
          new TypeError(`Value exceeds limit: ${limit}`)
        )
        return value
      },

      parseValue(value) {
        return type.parseValue(value)
      },

      parseLiteral(ast) {
        return type.parseLiteral(ast)
      }
    })
  }
}

export class MinLength extends GraphQLScalarType {
  constructor(type, limit) {
    super({
      name: `MinLength${limit}`,

      serialize(value) {
        value = type.serialize(value)
        Joi.assert(
          value,
          [Joi.string().min(limit), Joi.number().min(limit)],
          new TypeError(`Value beneath limit: ${limit}`)
        )
        return value
      },

      parseValue(value) {
        return type.parseValue(value)
      },

      parseLiteral(ast) {
        return type.parseLiteral(ast)
      }
    })
  }
}

export class GreaterThan extends GraphQLScalarType {
  constructor(type, limit) {
    super({
      name: `GreaterThan${limit}`,

      serialize(value) {
        value = type.serialize(value)
        Joi.assert(
          value,
          Joi.number().greater(limit),
          new TypeError(`Value beneath limit: ${limit}`)
        )
        return value
      },

      parseValue(value) {
        return type.parseValue(value)
      },

      parseLiteral(ast) {
        return type.parseLiteral(ast)
      }
    })
  }
}

export class LessThan extends GraphQLScalarType {
  constructor(type, limit) {
    super({
      name: `LessThan${limit}`,

      serialize(value) {
        value = type.serialize(value)
        Joi.assert(
          value,
          Joi.number().less(limit),
          new TypeError(`Value exceeds limit: ${limit}`)
        )
        return value
      },

      parseValue(value) {
        return type.parseValue(value)
      },

      parseLiteral(ast) {
        return type.parseLiteral(ast)
      }
    })
  }
}
