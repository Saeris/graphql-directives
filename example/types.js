import { gql } from "apollo-server"

const Query = gql`
  type Query {
    getPerson: Person
  }
`

const Person = gql`
  type Person {
    birthDate: String
    ageInYears: Int
    balance: Float @formatNumber
    heightInInches: Float
    minimumHourlyRate: Float
    currentlyActiveProjects: Int
    email: String
    homePage: String
    phoneNumber: String
    homePostalCode: String
  }
`

export const typeDefs = [Query, Person]
