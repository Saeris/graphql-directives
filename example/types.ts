import { gql } from "apollo-server"

const Query = gql`
  type Query {
    getPerson: Person
  }
`

const Person = gql`
  type Person {
    birthDate: String @formatDate
    age: Int @convertTime(originalUnit: years)
    balance: Float @formatNumber
    height: Float @convertLength(originalUnit: inches)
    weight: Int @convertMass(originalUnit: poundmass)
    trajectory: Float @convertAngle(originalUnit: deg)
    roomDimensions: Float @convertSurfaceArea(originalUnit: sqft)
    bagSize: Float @convertVolume(originalUnit: cuin)
    coffeeConsumed: Float @convertLiquidVolume(originalUnit: fluidounce)
    hourlyRate: Int @formatCurrency
    phoneNumber: String @formatPhoneNumber
    powerSupply: Int @convertElectroMagneticForce(originalUnit: watts)
    diskSpace: Int @convertBinary(originalUnit: bytes)
  }
`

export const typeDefs = [Query, Person]
