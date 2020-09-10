import gql from "graphql-tag"
import { SchemaDirectiveVisitor } from "graphql-tools"
import { defaultFieldResolver, GraphQLString, GraphQLField } from "graphql"
import _camelCase from "lodash-es/camelCase"
import _capitalize from "lodash-es/capitalize"
import _deburr from "lodash-es/deburr"
import _kebabCase from "lodash-es/kebabCase"
import _lowerCase from "lodash-es/lowerCase"
import _lowerFirst from "lodash-es/lowerFirst"
import _snakeCase from "lodash-es/snakeCase"
import _toLower from "lodash-es/toLower"
import _toUpper from "lodash-es/toUpper"
import _trim from "lodash-es/trim"
import _upperCase from "lodash-es/upperCase"
import _upperFirst from "lodash-es/upperFirst"

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
