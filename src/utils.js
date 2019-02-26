import { buildSchema } from "graphql"

export const getTypeMap = input => buildSchema(input)._typeMap
