import gql from "graphql-tag"
import { SchemaDirectiveVisitor } from "graphql-tools"
import { defaultFieldResolver, GraphQLString, GraphQLBoolean } from "graphql"
import * as math from "mathjs"
import { getTypeMap } from "./utils"

const createUnitDirective = (unit, baseEnum) =>
  class extends SchemaDirectiveVisitor {
    static declaration() {
      return gql`
        directive @convert${unit}(
          originalUnit: ${unit}TypesEnum!
          defaultRaw: Boolean! = false
        ) on FIELD_DEFINITION

        ${baseEnum}
        `
    }

    visitFieldDefinition(field) {
      const { resolve = defaultFieldResolver } = field
      const { originalUnit, defaultRaw } = this.args

      field.args.push({
        name: `convertTo`,
        type: getTypeMap(baseEnum)[`${unit}TypesEnum`]
      })
      field.args.push({ name: `raw`, type: GraphQLBoolean })

      field.resolve = async function(
        source,
        { convertTo, raw, ...args },
        context,
        info
      ) {
        const result = await resolve.call(this, source, args, context, info)
        const transform = input => {
          const value = math
            .unit(input, originalUnit)
            .to(convertTo || originalUnit)
          return raw || defaultRaw
            ? value.toNumeric(convertTo || originalUnit)
            : value.toString()
        }
        return Array.isArray(result) ? result.map(transform) : transform(result)
      }

      field.type = GraphQLString
    }
  }

const decimalPrefixes = {
  deca: `da`,
  hecto: `h`,
  kilo: `k`,
  mega: `M`,
  giga: `G`,
  tera: `T`,
  peta: `P`,
  exa: `E`,
  zetta: `Z`,
  yotta: `Y`,
  "": ``,
  deci: `d`,
  centi: `c`,
  milli: `m`,
  miro: `u`,
  nano: `n`,
  pico: `p`,
  femto: `f`,
  atto: `a`,
  zpeto: `z`,
  yocto: `y`
}

const binaryPrefixes = {
  kibi: `Ki`,
  mebi: `Mi`,
  gibi: `Gi`,
  tebi: `Ti`,
  pebi: `Pi`,
  exi: `Ei`,
  zebi: `Zi`,
  yobi: `Yi`,
  "": ``,
  kilo: `k`,
  mega: `M`,
  giga: `G`,
  tera: `T`,
  peta: `P`,
  exa: `E`,
  zetta: `Z`,
  yotta: `Y`
}

const applyPrefixes = (arr, unit) => arr.map(prefix => `${prefix}${unit}`)

const generatePrefixes = (normalPrefixes, abbreviationPrefixes) => (
  singular,
  plural,
  abbreviation
) =>
  [
    ...applyPrefixes(normalPrefixes, singular),
    ...applyPrefixes(normalPrefixes, plural),
    ...applyPrefixes(abbreviationPrefixes, abbreviation)
  ].join(`\n`)

const generateDecimalPrefixes = generatePrefixes(
  Object.keys(decimalPrefixes),
  Object.values(decimalPrefixes)
)

const generateBinaryPrefixes = generatePrefixes(
  Object.keys(binaryPrefixes),
  Object.values(binaryPrefixes)
)

export const convertLength = createUnitDirective(
  `Length`,
  `
  enum LengthTypesEnum {
    ${generateDecimalPrefixes(`meter`, `meters`, `m`)}
    inch
    inches
    in
    foot
    feet
    ft
    yard
    yards
    yd
    mile
    miles
    mi
    link
    links
    li
    rod
    rods
    rd
    chain
    chains
    ch
    angstrom
    angstroms
    mil
    mils
  }
`
)

export const convertSurfaceArea = createUnitDirective(
  `SurfaceArea`,
  `
  enum SurfaceAreaTypesEnum {
    m2
    sqin
    sqft
    sqyd
    sqmi
    sqrd
    sqch
    sqmil
    acre
    acres
    hectare
    hectares
  }
`
)

export const convertVolume = createUnitDirective(
  `Volume`,
  `
  enum VolumeTypesEnum {
    m3
    ${generateDecimalPrefixes(`litre`, `litres`, `L`)}
    cc
    cuin
    cuft
    cuyd
    teaspoon
    teaspoons
    tablespoon
    tablespoons
  }
`
)

export const convertLiquidVolume = createUnitDirective(
  `LiquidVolume`,
  `
  enum LiquidVolumeTypesEnum {
    minim
    min
    fluiddram
    fldr
    fluidounce
    floz
    gill
    gi
    cup
    cups
    cp
    pint
    pints
    pt
    quart
    quarts
    qt
    gallon
    gallons
    gal
    beerbarrel
    beerbarrels
    bbl
    oilbarrel
    oilbarrels
    obl
    hogshead
    drop
    gtt
  }
`
)

export const convertAngle = createUnitDirective(
  `Angle`,
  `
  enum AngleTypesEnum {
    ${generateDecimalPrefixes(`radian`, `radians`, `rad`)}
    ${generateDecimalPrefixes(`degree`, `degrees`, `deg`)}
    ${generateDecimalPrefixes(`gradian`, `gradians`, `grad`)}
    cycle
    arcsec
    arcsecond
    arcseconds
    arcmin
    arcminute
    arcminutes
  }
`
)

export const convertTime = createUnitDirective(
  `Time`,
  `
  enum TimeTypesEnum {
    s
    sec
    secs
    second
    seconds
    mins
    minute
    minutes
    h
    hr
    hrs
    hour
    hours
    day
    days
    week
    weeks
    month
    months
    year
    years
    decade
    decades
    century
    centuries
    millennium
    millennia
  }
`
)

export const convertMass = createUnitDirective(
  `Mass`,
  `
  enum MassTypesEnum {
    ${generateDecimalPrefixes(`gram`, `grams`, `g`)}
    ${generateDecimalPrefixes(`tonne`, `tonnes`, `t`)}
    ton
    grain
    gr
    dram
    dr
    ounce
    oz
    poundmass
    lbm
    lb
    lbs
    hundredweight
    cwt
    stick
    stone
  }
`
)

export const convertTemperature = createUnitDirective(
  `Temperature`,
  `
  enum TemperatureTypesEnum {
    kelvin
    K
    celsius
    degC
    fahrenheit
    degF
    rankine
    degR
  }
`
)

export const convertForce = createUnitDirective(
  `Force`,
  `
  enum ForceTypesEnum {
    ${generateDecimalPrefixes(`newton`, `newtons`, `N`)}
    ${generateDecimalPrefixes(`dyne`, `dynes`, `dyn`)}
    poundforce
    lbf
    kip
  }
`
)

export const convertEnergy = createUnitDirective(
  `Energy`,
  `
  enum EnergyTypesEnum {
    joule
    J
    erg
    Wh
    BTU
    ${generateDecimalPrefixes(`electronvolt`, `electronvolts`, `eV`)}
  }
`
)

export const convertPower = createUnitDirective(
  `Power`,
  `
  enum PowerTypesEnum {
    ${generateDecimalPrefixes(`watt`, `watts`, `W`)}
    hp
  }
`
)

export const convertPressure = createUnitDirective(
  `Pressure`,
  `
  enum PressureTypesEnum {
    Pa
    psi
    atm
    torr
    bar
    mmHg
    mmH2O
    cmH2O
  }
`
)

export const convertElectroMagneticForce = createUnitDirective(
  `ElectroMagneticForce`,
  `
  enum ElectroMagneticForceTypesEnum {
    ${generateDecimalPrefixes(`coulomb`, `coulombs`, `C`)}
    ${generateDecimalPrefixes(`watt`, `watts`, `W`)}
    ${generateDecimalPrefixes(`farad`, `farads`, `F`)}
    ${generateDecimalPrefixes(`volt`, `volts`, `V`)}
    ${generateDecimalPrefixes(`henry`, `henrys`, `H`)}
    ${generateDecimalPrefixes(`weber`, `webers`, `Wb`)}
    ${generateDecimalPrefixes(`tesla`, `teslas`, `T`)}
    ${generateDecimalPrefixes(`electronvolt`, `electronvolts`, `eV`)}
    ${generateDecimalPrefixes(`ampere`, `amperes`, `A`)}
    ohm
    siemens
  }
`
)

export const convertBinary = createUnitDirective(
  `Binary`,
  `
  enum BinaryTypesEnum {
    ${generateBinaryPrefixes(`bit`, `bits`, `b`)}
    ${generateBinaryPrefixes(`byte`, `bytes`, `B`)}
  }
`
)
