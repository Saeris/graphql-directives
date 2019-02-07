import { SchemaDirectiveVisitor } from "graphql-tools"
import {
  defaultFieldResolver,
  DirectiveLocation,
  GraphQLDirective,
  GraphQLString
} from "graphql"
import lodash from "lodash-es"

const createStringDirective = method =>
  class extends SchemaDirectiveVisitor {
    static getDirectiveDeclaration(directiveName) {
      return new GraphQLDirective({
        name: directiveName,
        locations: DirectiveLocation.FIELD_DEFINITION
      })
    }

    visitFieldDefinition(field) {
      const { resolve = defaultFieldResolver } = field
      field.resolve = async function(...args) {
        const result = await resolve.apply(this, args)
        return typeof result === `string` ? lodash[method](result) : result
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

export const startCase = createStringDirective(`startCase`)

export const toLower = createStringDirective(`toLower`)

export const toUpper = createStringDirective(`toUpper`)

export const trim = createStringDirective(`trim`)

export const upperCase = createStringDirective(`upperCase`)

export const upperFirst = createStringDirective(`upperFirst`)
