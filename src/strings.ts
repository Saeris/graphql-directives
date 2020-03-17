import gql from "graphql-tag"
import { SchemaDirectiveVisitor } from "graphql-tools"
import { defaultFieldResolver, GraphQLString, GraphQLField } from "graphql"
import lodash from "lodash"

type Methods =
  | "camelCase"
  | "capitalize"
  | "deburr"
  | "kebabCase"
  | "lowerCase"
  | "lowerFirst"
  | "snakeCase"
  | "toLower"
  | "toUpper"
  | "trim"
  | "upperCase"
  | "upperFirst"

class CreateStringDirective extends SchemaDirectiveVisitor {
  public static declaration() {
    return gql`
    directive @${this.name} on FIELD_DEFINITION
  `
  }

  visitFieldDefinition(field: GraphQLField<any, any, any>) {
    const { resolve = defaultFieldResolver } = field
    field.resolve = async function(...args) {
      const result = await resolve.apply(this, args)
      const transform = (input: string) =>
        typeof input === `string` ? lodash[this.name as Methods](input) : input
      return Array.isArray(result) ? result.map(transform) : transform(result)
    }

    field.type = GraphQLString
  }
}

export class camelCase extends CreateStringDirective {}
export class capitalize extends CreateStringDirective {}
export class deburr extends CreateStringDirective {}
export class kebabCase extends CreateStringDirective {}
export class lowerCase extends CreateStringDirective {}
export class lowerFirst extends CreateStringDirective {}
export class snakeCase extends CreateStringDirective {}
export class toLower extends CreateStringDirective {}
export class toUpper extends CreateStringDirective {}
export class trim extends CreateStringDirective {}
export class upperCase extends CreateStringDirective {}
export class upperFirst extends CreateStringDirective {}
