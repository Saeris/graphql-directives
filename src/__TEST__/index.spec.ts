import { SchemaDirectiveVisitor } from "apollo-server"
import { GraphQLDirective } from "graphql"
import { default as Directives } from "../"

describe(`directive exports`, () => {
  it(`each have directive declarations`, () => {
    for (const directive of Object.values(Directives)) {
      expect(directive.getDirectiveDeclaration()).toBeInstanceOf(
        GraphQLDirective
      )
    }
  })

  it(`each converts directive declarations to strings`, () => {
    for (const directive of Object.values(Directives)) {
      expect(typeof directive.toString()).toBe(`string`)
    }
  })

  it(`each converts directive declarations to Document Nodes`, () => {
    for (const directive of Object.values(Directives)) {
      expect(directive.toDocumentNode().kind).toBe(`Document`)
    }
  })

  it(`each are instances of SchemaDirectiveVisitor`, () => {
    for (const directive of Object.values(Directives)) {
      expect(directive.prototype instanceof SchemaDirectiveVisitor).toBe(true)
    }
  })
})
