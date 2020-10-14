import { SchemaDirectiveVisitor } from "apollo-server"
import {
  GraphQLNonNull,
  GraphQLScalarType,
  GraphQLInputField,
  GraphQLField
} from "graphql"
import { MaxLength, MinLength, GreaterThan, LessThan } from "./scalars"

export class maxLength extends SchemaDirectiveVisitor {
  visitInputFieldDefinition(field: GraphQLInputField) {
    this.wrapType(field)
  }

  visitFieldDefinition(field: GraphQLField<any, any, any>) {
    this.wrapType(field)
  }

  wrapType(field: GraphQLField<any, any, any> | GraphQLInputField) {
    if (
      field.type instanceof GraphQLNonNull &&
      field.type.ofType instanceof GraphQLScalarType
    ) {
      field.type = new GraphQLNonNull(
        new MaxLength(field.type.ofType, this.args.limit)
      )
    } else if (field.type instanceof GraphQLScalarType) {
      field.type = new MaxLength(field.type, this.args.limit)
    } else {
      throw new Error(`Not a scalar type: ${field.type}`)
    }
  }
}

export class minLength extends SchemaDirectiveVisitor {
  visitInputFieldDefinition(field: GraphQLInputField) {
    this.wrapType(field)
  }

  visitFieldDefinition(field: GraphQLField<any, any, any>) {
    this.wrapType(field)
  }

  wrapType(field: GraphQLField<any, any, any> | GraphQLInputField) {
    if (
      field.type instanceof GraphQLNonNull &&
      field.type.ofType instanceof GraphQLScalarType
    ) {
      field.type = new GraphQLNonNull(
        new MinLength(field.type.ofType, this.args.limit)
      )
    } else if (field.type instanceof GraphQLScalarType) {
      field.type = new MinLength(field.type, this.args.limit)
    } else {
      throw new Error(`Not a scalar type: ${field.type}`)
    }
  }
}

export class greaterThan extends SchemaDirectiveVisitor {
  visitInputFieldDefinition(field: GraphQLInputField) {
    this.wrapType(field)
  }

  visitFieldDefinition(field: GraphQLField<any, any, any>) {
    this.wrapType(field)
  }

  wrapType(field: GraphQLField<any, any, any> | GraphQLInputField) {
    if (
      field.type instanceof GraphQLNonNull &&
      field.type.ofType instanceof GraphQLScalarType
    ) {
      field.type = new GraphQLNonNull(
        new GreaterThan(field.type.ofType, this.args.value)
      )
    } else if (field.type instanceof GraphQLScalarType) {
      field.type = new GreaterThan(field.type, this.args.value)
    } else {
      throw new Error(`Not a scalar type: ${field.type}`)
    }
  }
}

export class lessThan extends SchemaDirectiveVisitor {
  visitInputFieldDefinition(field: GraphQLInputField) {
    this.wrapType(field)
  }

  visitFieldDefinition(field: GraphQLField<any, any, any>) {
    this.wrapType(field)
  }

  wrapType(field: GraphQLField<any, any, any> | GraphQLInputField) {
    if (
      field.type instanceof GraphQLNonNull &&
      field.type.ofType instanceof GraphQLScalarType
    ) {
      field.type = new GraphQLNonNull(
        new LessThan(field.type.ofType, this.args.value)
      )
    } else if (field.type instanceof GraphQLScalarType) {
      field.type = new LessThan(field.type, this.args.value)
    } else {
      throw new Error(`Not a scalar type: ${field.type}`)
    }
  }
}
