export const defaultQuery = `
  query getPerson {
    getPerson {
      # birthDate: String @formatDate
      defaultBirthDate: birthDate
      formattedBirthDate:birthDate(format: "H:mm:ssa - MMMM D, YYYY")

      # age: Int @convertTime(originalUnit: years)
      defaultAge: age
      convertedAge: age(convertTo: days)

      # balance: Float @formatNumber
      defaultBalance: balance
      formattedBalance:balance(format: "0.0a")

      # height: Float @convertLength(originalUnit: inches)
      defaultHeight: height
      convertedHeight: height(convertTo: feet)

      # weight: Float @convertMass(originalUnit: poundmass)
      defaultWeight: weight
      convertedWeight: weight(convertTo: gram)

      # trajectory: Float @convertAngle(originalUnit: deg)
      defaultTrajectory: trajectory
      convertedTrajectory: trajectory(convertTo: rad)

      # roomDimensions: Float @convertSurfaceArea(originalUnit: sqft)
      defaultRoomDimensions: roomDimensions
      convertedRoomDimensions: roomDimensions(convertTo: m2)

      # bagSize: Float @convertSurfaceArea(originalUnit: cuin)
      defaultBagSize: bagSize
      convertedBagSize: bagSize(convertTo: litre)

      # coffeeConsumed: Float @convertSurfaceArea(originalUnit: fluidounce)
      defaultCoffeeConsumed: coffeeConsumed
      convertedCoffeeConsumed: coffeeConsumed(convertTo: cup)

      # hourlyRate: Int @formatCurrency
      defaultHourlyRate: hourlyRate
      formattedHourlyRate: hourlyRate(format: "USD0,0.0" currency: "EUR")

      # phoneNumber: String @formatPhoneNumber
      defaultPhoneNumer: phoneNumber
      formattedPhoneNumber: phoneNumber(format: National)

      # powerSupply: Int @convertElectroMagneticForce
      defaultPowerSupply: powerSupply
      formattedPowerSupply: powerSupply(convertTo: volts)

      # diskSpace: Int @converBinary
      defaultDiskSpace: diskSpace
      formattedDiskSpace: diskSpace(convertTo: bits)
    }
  }
`
