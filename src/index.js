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
export { currencies as Currencies }
export { dates as Dates }
export { numbers as Numbers }
export { phone as Phone }
export { strings as Strings }
export { units as Units }

// Export each directive individually
export * from "./currencies"
export * from "./dates"
export * from "./numbers"
export * from "./phone"
export * from "./strings"
export * from "./units"
