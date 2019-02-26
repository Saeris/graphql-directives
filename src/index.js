import * as currencies from "./currencies"
import * as dates from "./dates"
import * as numbers from "./numbers"
import * as phone from "./phone"
import * as strings from "./strings"
import * as units from "./units"

// Export all durectives as default
export default {
  ...currencies,
  ...dates,
  ...numbers,
  ...phone,
  ...strings,
  ...units
}

// Export namespaced groups of directives
export * as Currencies from "./currencies"
export * as Dates from "./dates"
export * as Numbers from "./numbers"
export * as Phone from "./phone"
export * as Strings from "./strings"
export * as Units from "./units"

// Export each directive individually
export * from "./currencies"
export * from "./dates"
export * from "./numbers"
export * from "./phone"
export * from "./strings"
export * from "./units"
