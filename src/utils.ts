import { buildSchema, Source } from "graphql"

export const getTypeMap = (input: string | Source) =>
  buildSchema(input).getTypeMap()
