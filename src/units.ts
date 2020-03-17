import gql from "graphql-tag"
import { SchemaDirectiveVisitor } from "graphql-tools"
import {
  defaultFieldResolver,
  GraphQLString,
  GraphQLBoolean,
  GraphQLField,
  GraphQLArgument
} from "graphql"
import * as math from "mathjs"
import { getTypeMap } from "./utils"

class createUnitDirective extends SchemaDirectiveVisitor {
  unit: string = ``
  static _unit: string = ``
  baseEnum: string = ``
  static _baseEnum: string = ``

  static declaration() {
    return gql`
      directive @convert${this._unit}(
        originalUnit: ${this._unit}TypesEnum!
        defaultRaw: Boolean! = false
      ) on FIELD_DEFINITION

      ${this._baseEnum}
      `
  }

  visitFieldDefinition(field: GraphQLField<any, any, any>) {
    const { resolve = defaultFieldResolver } = field
    const { originalUnit, defaultRaw } = this.args

    field.args.push({
      name: `convertTo`,
      type: getTypeMap(this.baseEnum)[`${this.unit}TypesEnum`]
    } as GraphQLArgument)
    field.args.push({ name: `raw`, type: GraphQLBoolean } as GraphQLArgument)

    field.resolve = async function(
      source,
      { convertTo, raw, ...args },
      context,
      info
    ) {
      const result = await resolve.call(this, source, args, context, info)
      const transform = (input: number) => {
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

const applyPrefixes = (arr: string[], unit: string) =>
  arr.map(prefix => `${prefix}${unit}`)

const generatePrefixes = (
  normalPrefixes: string[],
  abbreviationPrefixes: string[]
) => (singular: string, plural: string, abbreviation: string) =>
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

const LengthTypesEnum = `enum LengthTypesEnum {
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
}`

export class convertLength extends createUnitDirective {
  unit = `Length`
  static _unit = `Length`
  baseEnum = LengthTypesEnum
  static _baseEnum = LengthTypesEnum
}

const SurfaceAreaTypesEnum = `enum SurfaceAreaTypesEnum {
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
}`

export class convertSurfaceArea extends createUnitDirective {
  unit = `SurfaceArea`
  static _unit = `SurfaceArea`
  baseEnum = SurfaceAreaTypesEnum
  static _baseEnum = SurfaceAreaTypesEnum
}

const VolumeTypesEnum = `enum VolumeTypesEnum {
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
}`

export class convertVolume extends createUnitDirective {
  unit = `Volume`
  static _unit = `Volume`
  baseEnum = VolumeTypesEnum
  static _baseEnum = VolumeTypesEnum
}

const LiquidVolumeTypesEnum = `enum LiquidVolumeTypesEnum {
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
}`

export class convertLiquidVolume extends createUnitDirective {
  unit = `LiquidVolume`
  static _unit = `LiquidVolume`
  baseEnum = LiquidVolumeTypesEnum
  static _baseEnum = LiquidVolumeTypesEnum
}

const AngleTypesEnum = `enum AngleTypesEnum {
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
}`

export class convertAngle extends createUnitDirective {
  unit = `Angle`
  static _unit = `Angle`
  baseEnum = AngleTypesEnum
  static _baseEnum = AngleTypesEnum
}

const TimeTypesEnum = `enum TimeTypesEnum {
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
}`

export class convertTime extends createUnitDirective {
  unit = `Time`
  static _unit = `Time`
  baseEnum = TimeTypesEnum
  static _baseEnum = TimeTypesEnum
}

const MassTypesEnum = `enum MassTypesEnum {
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
}`

export class convertMass extends createUnitDirective {
  unit = `Mass`
  static _unit = `Mass`
  baseEnum = MassTypesEnum
  static _baseEnum = MassTypesEnum
}

const TemperatureTypesEnum = `enum TemperatureTypesEnum {
  kelvin
  K
  celsius
  degC
  fahrenheit
  degF
  rankine
  degR
}`

export class convertTemperature extends createUnitDirective {
  unit = `Temperature`
  static _unit = `Temperature`
  baseEnum = TemperatureTypesEnum
  static _baseEnum = TemperatureTypesEnum
}

const ForceTypesEnum = `enum ForceTypesEnum {
  ${generateDecimalPrefixes(`newton`, `newtons`, `N`)}
  ${generateDecimalPrefixes(`dyne`, `dynes`, `dyn`)}
  poundforce
  lbf
  kip
}`

export class convertForce extends createUnitDirective {
  unit = `Force`
  static _unit = `Force`
  baseEnum = ForceTypesEnum
  static _baseEnum = ForceTypesEnum
}

const EnergyTypesEnum = `enum EnergyTypesEnum {
  joule
  J
  erg
  Wh
  BTU
  ${generateDecimalPrefixes(`electronvolt`, `electronvolts`, `eV`)}
}`

export class convertEnergy extends createUnitDirective {
  unit = `Energy`
  static _unit = `Energy`
  baseEnum = EnergyTypesEnum
  static _baseEnum = EnergyTypesEnum
}

const PowerTypesEnum = `enum PowerTypesEnum {
  ${generateDecimalPrefixes(`watt`, `watts`, `W`)}
  hp
}`

export class convertPower extends createUnitDirective {
  unit = `Power`
  static _unit = `Power`
  baseEnum = PowerTypesEnum
  static _baseEnum = PowerTypesEnum
}

const PressureTypesEnum = `enum PressureTypesEnum {
  Pa
  psi
  atm
  torr
  bar
  mmHg
  mmH2O
  cmH2O
}`

export class convertPressure extends createUnitDirective {
  unit = `Pressure`
  static _unit = `Pressure`
  baseEnum = PressureTypesEnum
  static _baseEnum = PressureTypesEnum
}

const ElectroMagneticForceTypesEnum = `enum ElectroMagneticForceTypesEnum {
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
}`

export class convertElectroMagneticForce extends createUnitDirective {
  unit = `ElectroMagneticForce`
  static _unit = `ElectroMagneticForce`
  baseEnum = ElectroMagneticForceTypesEnum
  static _baseEnum = ElectroMagneticForceTypesEnum
}

const BinaryTypesEnum = `enum BinaryTypesEnum {
  ${generateBinaryPrefixes(`bit`, `bits`, `b`)}
  ${generateBinaryPrefixes(`byte`, `bytes`, `B`)}
}`

export class convertBinary extends createUnitDirective {
  unit = `Binary`
  static _unit = `Binary`
  baseEnum = BinaryTypesEnum
  static _baseEnum = BinaryTypesEnum
}
