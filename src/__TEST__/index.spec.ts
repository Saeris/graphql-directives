import { SchemaDirectiveVisitor } from "graphql-tools"
import { default as Directives } from "../"

describe(`bulk export`, () => {
  it(`directives have directive document nodes`, () => {
    for (const directive of Object.values(Directives)) {
      expect(directive.declaration().kind).toBe(`Document`)
      expect(
        directive
          .declaration()
          .definitions.some(({ kind }) => kind === `DirectiveDefinition`)
      ).toBe(true)
    }
  })

  it(`directives are SchemaDirectiveVisitors`, () => {
    for (const directive of Object.values(Directives)) {
      expect(directive.prototype instanceof SchemaDirectiveVisitor).toBe(true)
    }
  })
})
