export const resolvers = {
  Query: {
    getPerson: () => ({
      birthDate: new Date(),
      age: 21,
      balance: 11075.25,
      height: 70.5,
      weight: 165,
      trajectory: 75,
      roomDimensions: 25.75,
      bagSize: 2772,
      coffeeConsumed: 21.125,
      hourlyRate: 1150,
      phoneNumber: `+17895551234`,
      powerSupply: 800,
      diskSpace: 1024
    })
  }
}
