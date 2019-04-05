import gql from "graphql-tag"
import { SchemaDirectiveVisitor } from "graphql-tools"
import { defaultFieldResolver, GraphQLString } from "graphql"
import lodash from "lodash"

const createStringDirective = method =>
  class extends SchemaDirectiveVisitor {
    static declaration() {
      return gql`
        directive @${method} on FIELD_DEFINITION
      `
    }

    visitFieldDefinition(field) {
      const { resolve = defaultFieldResolver } = field
      field.resolve = async function(...args) {
        const result = await resolve.apply(this, args)
        const transform = input =>
          typeof input === `string` ? lodash[method](input) : input
        return Array.isArray(result) ? result.map(transform) : transform(result)
      }

      field.type = GraphQLString
    }
  }

export const camelCase = createStringDirective(`camelCase`)

export const capitalize = createStringDirective(`capitalize`)

export const deburr = createStringDirective(`deburr`)

export const kebabCase = createStringDirective(`kebabCase`)

export const lowerCase = createStringDirective(`lowerCase`)

export const lowerFirst = createStringDirective(`lowerFirst`)

export const snakeCase = createStringDirective(`snakeCase`)

export const toLower = createStringDirective(`toLower`)

export const toUpper = createStringDirective(`toUpper`)

export const trim = createStringDirective(`trim`)

export const upperCase = createStringDirective(`upperCase`)

export const upperFirst = createStringDirective(`upperFirst`)
