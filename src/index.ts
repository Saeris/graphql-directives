import * as Currencies from "./currencies"
import * as Dates from "./dates"
// import * as Limits from "./limits"
import * as Numbers from "./numbers"
import * as Phone from "./phone"
import * as Strings from "./strings"
import * as Units from "./units"

// Export all durectives as default
export default {
  ...Currencies,
  ...Dates,
  // ...Limits,
  ...Numbers,
  ...Phone,
  ...Strings,
  ...Units
}

// Export namespaced groups of directives
export {
  Currencies,
  Dates,
  // Limits,
  Numbers,
  Phone,
  Strings,
  Units
}

// Export each directive individually
export { formatCurrency } from "./currencies"
export { formatDate } from "./dates"
// export { maxLength, minLength, greaterThan, lessThan } from "./limits"
export { formatNumber } from "./numbers"
export { formatPhoneNumber } from "./phone"
export {
  camelCase,
  capitalize,
  deburr,
  kebabCase,
  lowerCase,
  lowerFirst,
  snakeCase,
  toLower,
  toUpper,
  trim,
  upperCase,
  upperFirst
} from "./strings"
export {
  convertLength,
  convertSurfaceArea,
  convertVolume,
  convertLiquidVolume,
  convertAngle,
  convertTime,
  convertMass,
  convertTemperature,
  convertForce,
  convertEnergy,
  convertPower,
  convertPressure,
  convertElectroMagneticForce,
  convertBinary
} from "./units"
