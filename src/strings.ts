import gql from "graphql-tag"
import { SchemaDirectiveVisitor } from "graphql-tools"
import { defaultFieldResolver, GraphQLString, GraphQLField } from "graphql"
import _camelCase from "lodash/camelCase"
import _capitalize from "lodash/capitalize"
import _deburr from "lodash/deburr"
import _kebabCase from "lodash/kebabCase"
import _lowerCase from "lodash/lowerCase"
import _lowerFirst from "lodash/lowerFirst"
import _snakeCase from "lodash/snakeCase"
import _toLower from "lodash/toLower"
import _toUpper from "lodash/toUpper"
import _trim from "lodash/trim"
import _upperCase from "lodash/upperCase"
import _upperFirst from "lodash/upperFirst"

const methods = {
  camelCase: _camelCase,
  capitalize: _capitalize,
  deburr: _deburr,
  kebabCase: _kebabCase,
  lowerCase: _lowerCase,
  lowerFirst: _lowerFirst,
  snakeCase: _snakeCase,
  toLower: _toLower,
  toUpper: _toUpper,
  trim: _trim,
  upperCase: _upperCase,
  upperFirst: _upperFirst
}

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
        typeof input === `string`
          ? methods[this.name as keyof typeof methods](input)
          : input
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
