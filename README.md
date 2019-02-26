<h1 align="center" style="text-align: center;">GraphQL Directives</h1>
<p align="center">
  <a href="https://www.npmjs.org/package/@saeris/graphql-directives">
    <img src="https://img.shields.io/npm/v/@saeris/graphql-directives.svg?style=flat" alt="npm">
  </a>
  <a href="https://travis-ci.org/Saeris/graphql-directives">
    <img src="https://travis-ci.org/Saeris/graphql-directives.svg?branch=master" alt="travis">
  </a>
  <a href="https://codecov.io/gh/Saeris/graphql-directives">
    <img src="https://codecov.io/gh/Saeris/graphql-directives/branch/master/graph/badge.svg" alt="codecov"/>
  </a>
  <a href="https://snyk.io/test/github/Saeris/graphql-directives?targetFile=package.json">
    <img src="https://snyk.io/test/github/Saeris/graphql-directives/badge.svg?targetFile=package.json" alt="Known Vulnerabilities">
  </a>
  <a href="https://greenkeeper.io/">
    <img src="https://badges.greenkeeper.io/Saeris/graphql-directives.svg" alt="Known Vulnerabilities" alt="greenkeeper">
  </a>
</p>
<p align="center">A library of custom <a href="https://graphql.org/learn/queries/#directives">GraphQL directives</a> to give your schema super powers!</p>

---

## 🚧 Under Construction

> Warning: This library is still under construction! This message will be removed once it's published and available for use!

## Table of Contents

  - [Installation](#installation)
  - [Usage](#usage)
  - [Example](#example)
  - [Directives](#directives)
    - [Currencies](#currencies)
      - [\@formatCurrency](#formatcurrency)
    - [Dates](#dates)
      - [\@formatdate](#formatdate)
    - [Numbers](#numbers)
      - [\@formatNumber](#formatnumber)
    - [Phone Numbers](#phone-numbers)
      - [\@formatPhoneNumber](#formatphonenumber)
    - [Strings](#strings)
      - [\@camelCase](#camelcase)
      - [\@capitalize](#capitalize)
      - [\@deburr](#deburr)
      - [\@kebabCase](#kebabcase)
      - [\@lowerCase](#lowercase)
      - [\@lowerFirst](#lowerfirst)
      - [\@snakeCase](#snakecase)
      - [\@toLower](#tolower)
      - [\@toUpper](#toupper)
      - [\@trim](#trim)
      - [\@upperCase](#uppercase)
      - [\@upperFirst](#upperfirst)
    - [Measurements](#measurements)
      - [\@converLength](#converlength)
      - [\@convertSurfaceArea](#convertsurfacearea)
      - [\@convertVolume](#convertvolume)
      - [\@convertLiquidVolume](#convertliquidvolume)
      - [\@convertAngle](#convertangle)
      - [\@convertTime](#convertime)
      - [\@convertMass](#convertmass)
      - [\@convertTemperature](#converttemperature)
      - [\@convertForce](#convertforce)
      - [\@convertEnergy](#convertenergy)
      - [\@convertPower](#convertpower)
      - [\@convertPressure](#convertpressure)
      - [\@convertBinary](#convertbinary)
  - [Acknowledgements](#acknowledgements)
  - [License](#license)

## 📦 Installation

```bash
npm install --save graphql @saeris/graphql-directives
# or
yarn add graphql @saeris/graphql-directives
```

## 🔧 Usage

To use these directives add them to your Schema Directives when you initialize your Apollo Server:

```js
import { ApolloServer } from "apollo-server"
// Import all directives at once
import Directives from "@saeris/graphql-directives"
// Optionally, you can import individual directives or namespaced groups
// import { formatDate, Strings } from "@saeris/graphql-directives"
import { typeDefs } from "./types"
import { resolvers } from "./resolvers"

const server = new ApolloServer({
  typeDefs: [
    ...typeDefs,
    // Map over each directive and get it's type declaration to add them to your schema
    ...Object.values(Directives).map(directive => directive.declaration())
    // Follow the same pattern to get type declarations for groups
    // ...Object.values(Strings).map(directive = directive.declaration())
    // Or for individual directives, just call the getter directly
    // formatDate.declaration()
  ],
  resolvers,
  // Add the directives to your schemaDirectives map
  schemaDirectives: {
    ...Directives
    // Do the same for namespaced groups
    // ...Strings
    // For individual directives just use object property shorthand
    // formatDate
    // Don't rename directives! The following will throw an error:
    // customName: formatDate
  }
})

/* eslint-disable */
server.listen(endpoint).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
```

Now you can use them in your schema just like you would any other Directive:

```graphql
type Person {
  # ...
  birthDate: String @formatDate(defaultFormat: "MMMM D, YYYY")
  # ...
}
```

## 🏖️ Example

You can quickly take this library for a spin by running the example either locally under the `example` directory (just run `yarn && yarn start` and open your browser to http://localhost:4000) or live inside of CodeSandbox [here](https://codesandbox.io/s/github/Saeris/graphql-directives/).

## 🗺 Directives

Below is a list of each available directive and it's individual usage. GraphQL schema examples include all of the available arguments for the directive and their default values. Query examples include all of the arguments the directive adds to the field on which it was applied in the schema, along with any default values for those arguments. Many of the directives included in this library will change the return type of the field they are applied to, most commonly that will be a `String`. The return type for each directive is noted in it's description. Additionally, example inputs and outputs are provided for each.

### 💵 Currencies

#### \@formatCurrency

Allows clients to apply custom formatting to currency values. Uses [`dinero.js`](https://github.com/sarahdayan/dinero.js) under the hood.

```js
import { formatCurrency } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # Int | Float => String
  hourlyRate: Int @formatCurrency(
    defaultFormat = "$0,0.00" # String!
    defaultRoundingMode = HALF_AWAY_FROM_ZERO # RoundingMode!
  )
}

# Included Automatically when using @formatCurrncy
enum RoundingMode {
  HALF_ODD
  HALF_EVEN
  HALF_UP
  HALF_DOWN
  HALF_TOWARD_ZERO
  HALF_AWAY_FROM_ZERO
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getPerson {
      # Raw => Default Format => Requested Format
      # 1150 => $11.50 => EUR 11.5
      hourlyRate(format: "USD0,0.0" currency: "EUR") # => EUR 11.5
    }
  }
```

<!-- prettier-ignore-start -->
<details>
<summary>Additional Formatting Options:</summary>

> Taken from [dinero.js documentation](https://sarahdayan.github.io/dinero.js/module-Dinero.html#~toFormat)

| Format         | Result Example  |
|----------------|-----------------|
| `$0,0.00`      | $5,000.50       |
| `$0,0`         | $5,001          |
| `$0`           | $5001           |
| `$0.0`         | $5000.5         |
| `USD0,0.0`     | USD 5,000.5     |
| `0,0.0 dollar` | 5,000.5 dollars |

> Note: `$`, `USD`, and `dollar` are all symbols. They will automatically be localized to fit the currency you specify. For example `currency: EUR` will transform `$ => €`, `USD => EUR`, and `dollars => euros`. The formats listed above are not tokens, but instead are pre-defined by dinero.js. Custom formatting is not currently available.

</details>
<!-- prettier-ignore-end -->

### 📆 Dates

#### \@formatDate

Allows clients to apply custom formatting to date values. Uses [`date-fns`](https://github.com/date-fns/date-fns) under the hood.

```js
import { formatDate } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # Int | String => String
  date: String @formatDate(
    defaultFormat = "MMMM D, YYYY" # String!
  )
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getPerson {
      # Raw => Default Format => Requested Format
      # 1549766240251 => February 9, 2019 => 18:37:20pm - February 9, 2019
      birthDate(format: "H:mm:ssa - MMMM D, YYYY") # => 18:37:20pm - February 9, 2019
    }
  }
```

<!-- prettier-ignore-start -->
<details>
<summary>Additional Formatting Options:</summary>

> Table taken from [date-fns documentation](https://date-fns.org/v1.30.1/docs/format)

| Unit                    | Token   | Result Examples                  |
|-------------------------|---------|----------------------------------|
| Month                   | `M`     | 1, 2, ..., 12                    |
|                         | `Mo`    | 1st, 2nd, ..., 12th              |
|                         | `MM`    | 01, 02, ..., 12                  |
|                         | `MMM`   | Jan, Feb, ..., Dec               |
|                         | `MMMM`  | January, February, ..., December |
| Quarter                 | `Q`     | 1, 2, 3, 4                       |
|                         | `Qo`    | 1st, 2nd, 3rd, 4th               |
| Day of month            | `D`     | 1, 2, ..., 31                    |
|                         | `Do`    | 1st, 2nd, ..., 31st              |
|                         | `DD`    | 01, 02, ..., 31                  |
| Day of year             | `DDD`   | 1, 2, ..., 366                   |
|                         | `DDDo`  | 1st, 2nd, ..., 366th             |
|                         | `DDDD`  | 001, 002, ..., 366               |
| Day of week             | `d`     | 0, 1, ..., 6                     |
|                         | `do`    | 0th, 1st, ..., 6th               |
|                         | `dd`    | Su, Mo, ..., Sa                  |
|                         | `ddd`   | Sun, Mon, ..., Sat               |
|                         | `dddd`  | Sunday, Monday, ..., Saturday    |
| Day of ISO week         | `E`     | 1, 2, ..., 7                     |
| ISO week                | `W`     | 1, 2, ..., 53                    |
|                         | `Wo`    | 1st, 2nd, ..., 53rd              |
|                         | `WW`    | 01, 02, ..., 53                  |
| Year                    | `YY`    | 00, 01, ..., 99                  |
|                         | `YYYY`  | 1900, 1901, ..., 2099            |
| ISO week-numbering year | `GG`    | 00, 01, ..., 99                  |
|                         | `GGGG`  | 1900, 1901, ..., 2099            |
| AM/PM                   | `A`     | AM, PM                           |
|                         | `a`     | am, pm                           |
|                         | `aa`    | a.m., p.m.                       |
| Hour                    | `H`     | 0, 1, ... 23                     |
|                         | `HH`    | 00, 01, ... 23                   |
|                         | `h`     | 1, 2, ..., 12                    |
|                         | `hh`    | 01, 02, ..., 12                  |
| Minute                  | `m`     | 0, 1, ..., 59                    |
|                         | `mm`    | 00, 01, ..., 59                  |
| Second                  | `s`     | 0, 1, ..., 59                    |
|                         | `ss`    | 00, 01, ..., 59                  |
| 1/10 of second          | `S`     | 0, 1, ..., 9                     |
| 1/100 of second         | `SS`    | 00, 01, ..., 99                  |
| Millisecond             | `SSS`   | 000, 001, ..., 999               |
| Timezone                | `Z`     | -01:00, +00:00, ... +12:00       |
|                         | `ZZ`    | -0100, +0000, ..., +1200         |
| Seconds timestamp       | `X`     | 512969520                        |
| Milliseconds timestamp  | `x`     | 512969520900                     |

</details>
<!-- prettier-ignore-end -->

### 🧮 Numbers

#### \@formatNumber

Allows clients to apply custom formatting to numerical values. Uses [`numeral`](https://github.com/adamwdraper/Numeral-js) under the hood.

```js
import { formatNumber } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # Int | Float => String
  balance: Float @formatNumber(
    defaultFormat = "0,0.0000" # String!
  )
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getPerson {
      # Raw => Default Format => Requested Format
      # 11075.25 => 11,075.2500 => 11.1k
      balance(format: "0.0a") # => 11.1k
    }
  }
```

<!-- prettier-ignore-start -->
<details>
<summary>Additional Formatting Options:</summary>

> Tables taken from [numeral documentation](http://numeraljs.com/#format)

**Numbers**
| Number	    | Format	     | String        |
|-------------|--------------|---------------|
| 10000       | `0,0.0000`   | 10,000.0000   |
| 10000.23    | `0,0`        | 10,000        |
| 10000.23    | `+0,0`       | +10,000       |
| -10000      | `0,0.0`      | -10,000.0     |
| 10000.1234  |	`0.000 `     | 10000.123     |
| 100.1234	  | `00000`      | 00100         |
| 1000.1234	  | `000000,0`   | 001,000       |
| 10	        | `000.00`     | 010.00        |
| 10000.1234	| `0[.]00000`  | 10000.12340   |
| -10000	    | `(0,0.0000)` | (10,000.0000) |
| -0.23	      | `.00 `       | -.23          |
| -0.23	      | `(.00) `     | (.23)         |
| 0.23	      | `0.00000`    | 0.23000       |
| 0.23	      | `0.0[0000]`  | 0.23          |
| 1230974	    | `0.0a`       | 1.2m          |
| 1460	      | `0 a`        | 1 k           |
| -104000	    | `0a`         | -104k         |
| 1	          | `0o`         | 1st           |
| 100	        | `0o` 	       | 100th         |

**Currency**
| Number	  | Format	     | String      |
|-----------|--------------|-------------|
| 1000.234	| `$0,0.00`	   | $1,000.23   |
| 1000.2	  | `0,0[.]00 $` | 1,000.20 $  |
| 1001	    | `$ 0,0[.]00` | $ 1,001     |
| -1000.234	| `($0,0)`	   | ($1,000)    |
| -1000.234 |	`$0.00`	     | -$1000.23   |
| 1230974	  | `($ 0.00 a)` | $ 1.23 m    |

**Bytes**
| Number	      | Format	   | String     |
|---------------|------------|------------|
| 100	          | `0b`	     | 100B       |
| 1024	        | `0b`	     | 1KB        |
| 2048	        | `0 ib`	   | 2 KiB      |
| 3072	        | `0.0 b`	   | 3.1 KB     |
| 7884486213	  | `0.00b`	   | 7.88GB     |
| 3467479682787 |	`0.000 ib` | 3.154 TiB  |

**Percentages**
| Number	      | Format	     | String    |
|---------------|--------------|-----------|
| 1	            | `0%`	       | 100%      |
| 0.974878234	  | `0.000%`	   | 97.488%   |
| -0.43	        | `0 %`	       | -43 %     |
| 0.43	        | `(0.000 %)`	 | 43.000 %  |

**Time**
| Number	| Format	   | String   |
|---------|------------|----------|
| 25      | `00:00:00` | 0:00:25  |
| 238	    | `00:00:00` | 0:03:58  |
| 63846   | `00:00:00` | 17:44:06 |

**Exponential**
| Number	      | Format	    | String   |
|---------------|-------------|----------|
| 1123456789    | `0,0e+0`    | 1e+9     |
| 12398734.202  | `0.00e+0`	  | 1.24e+7  |
| 0.000123987   | `0.000e+0`	| 1.240e-4 |

</details>
<!-- prettier-ignore-end -->

### 📞 Phone Numbers

#### \@formatPhoneNumber

Allows clients to apply various standard formatting to phone numbers. Uses [`libphonenumber-js`](https://github.com/catamphetamine/libphonenumber-js) under the hood.

```js
import { formatPhoneNumber } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # String => String
  phoneNumber: String @formatPhoneNumber(
    defaultFormat = International # PhoneFormats!
  )
}

# Included Automatically when using @formatPhoneNumber
enum PhoneFormats {
  National
  International
  E164
  RFC3966
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getPerson {
      # Raw => Default Format => Requested Format
      # +17895551234 => +1 789 555 1234 => (789) 555-1234
      phoneNumber(format: National) # => (789) 555-1234
    }
  }
```
<!-- prettier-ignore-start -->
<details>
<summary>Additional Formatting Options:</summary>

> Table taken from [libphonenumber-js documentation](https://github.com/catamphetamine/libphonenumber-js#formatformat-string-options)

| Format          | Example                   |
|-----------------|---------------------------|
| `National`      | (213) 373-4253            |
| `International` | +1 213 373 4253           |
| `E164`          | +12133734253              |
| `RFC3966`       | tel:+12133734253;ext=123  |

</details>
<!-- prettier-ignore-end -->

### 📝 Strings

#### String Formatting

The following directives all apply various basic string formats and are designed such that they can be combined with other directives to transform strings without adding extra arguments to a field. They all use [`lodash`](https://github.com/lodash/lodash) under the hood. Descriptions and examples are taken from the [lodash documentation](https://lodash.com/docs/4.17.11).

#### \@camelCase

Converts string to camel case.

```js
import { camelCase } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # String => String
  message: String @camelCase
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getMessage {
      # Raw => Formatted String
      # Foo Bar => fooBar
      # --foo-bar-- => fooBar
      # __FOO_BAR__ => fooBar
      message # => fooBar
    }
  }
```

#### \@capitalize

Converts the first character of string to upper case and the remaining to lower case.

```js
import { capitalize } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # String => String
  message: String @capitalize
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getMessage {
      # Raw => Formatted String
      # FRED => Fred
      message # => Fred
    }
  }
```

#### \@deburr

Deburrs string by converting Latin-1 Supplement and Latin Extended-A letters to basic Latin letters and removing combining diacritical marks.

```js
import { deburr } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # String => String
  message: String @deburr
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getMessage {
      # Raw => Formatted String
      # déjà vu => deja vu
      message # => deja vu
    }
  }
```

#### \@kebabCase

Converts string to kebab case.

```js
import { kebabCase } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # String => String
  message: String @kebabCase
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getMessage {
      # Raw => Formatted String
      # Foo Bar => foo-bar
      # fooBar => foo-bar
      # __FOO_BAR__ => foo-bar
      message # => foo-bar
    }
  }
```

#### \@lowerCase

Converts string, as space separated words, to lower case.

```js
import { lowerCase } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # String => String
  message: String @lowerCase
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getMessage {
      # Raw => Formatted String
      # --Foo-Bar-- => foo bar
      # fooBar => foo bar
      # __FOO_BAR__ => foo bar
      message # => foo bar
    }
  }
```

#### \@lowerFirst

Converts the first character of string to lower case.

```js
import { lowerFirst } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # String => String
  message: String @lowerFirst
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getMessage {
      # Raw => Formatted String
      # Fred => fred
      # FRED => fRED
      message # => fRED
    }
  }
```

#### \@snakeCase

Converts string to snake case.

```js
import { snakeCase } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # String => String
  message: String @snakeCase
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getMessage {
      # Raw => Formatted String
      # Foo Bar => foo_bar
      # fooBar => foo_bar
      # --FOO-BAR-- => foo_bar
      message # => foo_bar
    }
  }
```

#### \@toLower

Converts string, as a whole, to lower case.

```js
import { toLower } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # String => String
  message: String @toLower
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getMessage {
      # Raw => Formatted String
      # --Foo-Bar-- => --foo-bar--
      # fooBar => foobar
      # __FOO_BAR__ => __foo_bar__
      message # => foobar
    }
  }
```

#### \@toUpper

Converts string, as a whole, to upper case.

```js
import { toUpper } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # String => String
  message: String @toUpper
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getMessage {
      # Raw => Formatted String
      # --foo-bar-- => --FOO-BAR--
      # fooBar => FOOBAR
      # __foo_bar__ => __FOO_BAR__
      message # => FOOBAR
    }
  }
```

#### \@trim

Removes leading and trailing whitespace from string.

```js
import { trim } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # String => String
  message: String @trim
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getMessage {
      # Raw => Formatted String
      # '  abc  ' => 'abc'
      message # => abc
    }
  }
```

#### \@upperCase

Converts string, as space separated words, to upper case.

```js
import { upperCase } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # String => String
  message: String @upperCase
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getMessage {
      # Raw => Formatted String
      # --foo-bar-- => FOO BAR
      # fooBar => FOO BAR
      # __foo_bar__ => FOO BAR
      message # => FOO BAR
    }
  }
```

#### \@upperFirst

Converts the first character of string to upper case.

```js
import { upperFirst } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # String => String
  message: String @upperFirst
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getMessage {
      # Raw => Formatted String
      # fred => Fred
      # fRED => FRED
      message # => Fred
    }
  }
```

### 📐 Measurements

#### Measurement Conversions

The following directives all convert a category of measurement from one unit to another, for example feet to meters, gallons to fluid ounces, etc. They all use [`mathjs`](https://github.com/josdejong/mathjs) under the hood.

Each conversion directive includes a GraphQL Enum with all of the valid values that directive can process. Included are singular, plural, and abbreviated forms of each unit, with SI prefixes where applicable.

<!-- prettier-ignore-start -->
<details>
<summary>Comprehensive list of supported units:</summary>

> Tables taken from [mathjs documentation](http://mathjs.org/docs/datatypes/units.html#reference)

| Base	| Unit |
|-------|------|
| **Length** |	meter (m), inch (in), foot (ft), yard (yd), mile (mi), link (li), rod (rd), chain (ch), angstrom, mil |
| **Surface area** |	m2, sqin, sqft, sqyd, sqmi, sqrd, sqch, sqmil, acre, hectare |
| **Volume** |	m3, litre (l, L, lt, liter), cc, cuin, cuft, cuyd, teaspoon, tablespoon |
| **Liquid volume** |	minim (min), fluiddram (fldr), fluidounce (floz), gill (gi), cup (cp), pint (pt), quart (qt), gallon (gal), beerbarrel (bbl), oilbarrel (obl), hogshead, drop (gtt) |
| **Angles** | rad (radian), deg (degree), grad (gradian), cycle, arcsec (arcsecond), arcmin (arcminute) |
| **Time** | second (s, secs, seconds), minute (mins, minutes), hour (h, hr, hrs, hours), day (days), week (weeks), month (months), year (years), decade (decades), century (centuries), millennium (millennia) |
| **Mass** | gram(g), tonne, ton, grain (gr), dram (dr), ounce (oz), poundmass (lbm, lb, lbs), hundredweight (cwt), stick, stone |
| **Temperature** |	kelvin (K), celsius (degC), fahrenheit (degF), rankine (degR) |
| **Force** |	newton (N), dyne (dyn), poundforce (lbf), kip |
| **Energy** |	joule (J), erg, Wh, BTU, electronvolt (eV) |
| **Power**	| watt (W), hp |
| **Pressure** |	Pa, psi, atm, torr, bar, mmHg, mmH2O, cmH2O |
| **Binary** |	bit (b), byte (B) |

> Note: Frequency, Electric Current, Amount of Substance, and Luminous Intensity are not currently included as they have only a single unit of measurement inside of mathjs.

Prefixes
The following decimal prefixes are available.

| Name	| Abbreviation | Value |
|-------|--------------|-------|
| deca	| da	         | 1e1   |
| hecto	| h	           | 1e2   |
| kilo	| k	           | 1e3   |
| mega	| M	           | 1e6   |
| giga	| G	           | 1e9   |
| tera	| T	           | 1e12  |
| peta	| P	           | 1e15  |
| exa	  | E	           | 1e18  |
| zetta	| Z	           | 1e21  |
| yotta	| Y	           | 1e24  |

| Name	| Abbreviation | Value |
|-------|--------------|-------|
| deci	| d	           | 1e-1  |
| centi	| c	           | 1e-2  |
| milli	| m	           | 1e-3  |
| micro	| u	           | 1e-6  |
| nano	| n	           | 1e-9  |
| pico	| p	           | 1e-12 |
| femto	| f	           | 1e-15 |
| atto	| a	           | 1e-18 |
| zepto	| z	           | 1e-21 |
| yocto	| y	           | 1e-24 |

The following binary prefixes are available. They can be used with units bit (b) and byte (B).

| Name	| Abbreviation | Value  |
|-------|--------------|--------|
| kibi	| Ki	         | 1024   |
| mebi	| Mi	         | 1024^2 |
| gibi	| Gi	         | 1024^3 |
| tebi	| Ti	         | 1024^4 |
| pebi	| Pi	         | 1024^5 |
| exi	  | Ei	         | 1024^6 |
| zebi	| Zi	         | 1024^7 |
| yobi	| Yi	         | 1024^8 |

| Name	| Abbreviation | Value |
|-------|--------------|-------|
| kilo	| k	           | 1e3   |
| mega	| M	           | 1e6   |
| giga	| G	           | 1e9   |
| tera	| T	           | 1e12  |
| peta	| P	           | 1e15  |
| exa	  | E	           | 1e18  |
| zetta	| Z	           | 1e21  |
| yotta	| Y	           | 1e24  |

</details>
<!-- prettier-ignore-end -->

#### \@convertLength

Converts length measurements from one unit to another.

```js
import { convertLength } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # Int | Float => String
  height: Float @convertLength(
    # Note: There is no pre-configured default, you must specify
    # the originalUnit in your schema!
    originalUnit = inches # LengthTypesEnum!
    # When true, only the value will be returned
    defaultRaw = false # Boolean!
  )
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getPerson {
      # Raw => Original Unit => Requested Unit
      # 70.5 => 70.5 inches => 5.875 feet
      height(convertTo: feet) # => 5.875 feet
    }
  }
```

#### \@convertSurfaceArea

Converts surface area measurements from one unit to another.

```js
import { convertSurfaceArea } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # Int | Float => String
  roomDimensions: Float @convertSurfaceArea(
    # Note: There is no pre-configured default, you must specify
    # the originalUnit in your schema!
    originalUnit = sqft # SurfaceAreaTypesEnum!
    # When true, only the value will be returned
    defaultRaw = false # Boolean!
  )
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getPerson {
      # Raw => Original Unit => Requested Unit
      # 25.75 => 25.75 sqft => 2.3922532800000003 m2
      roomDimensions(convertTo: m2) # => 2.3922532800000003 m2
    }
  }
```

#### \@convertVolume

Converts volume measurements from one unit to another.

```js
import { convertVolume } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # Int | Float => String
  bagSize: Float @convertVolume(
    # Note: There is no pre-configured default, you must specify
    # the originalUnit in your schema!
    originalUnit = cuin # VolumeTypesEnum!
    # When true, only the value will be returned
    defaultRaw = false # Boolean!
  )
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getPerson {
      # Raw => Original Unit => Requested Unit
      # 2772 => 2772 cuin => 45.424941407999995 litre
      bagSize(convertTo: litre) # => 45.424941407999995 litre
    }
  }
```

#### \@convertLiquidVolume

Converts liquid volume measurements from one unit to another.

```js
import { convertLiquidVolume } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # Int | Float => String
  coffeeConsumed: Float @convertLiquidVolume(
    # Note: There is no pre-configured default, you must specify
    # the originalUnit in your schema!
    originalUnit = fluidounce # LiquidVolumeTypesEnum!
    # When true, only the value will be returned
    defaultRaw = false # Boolean!
  )
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getPerson {
      # Raw => Original Unit => Requested Unit
      # 21.125 => 21.125 fluidounce => 2.6406254464508376 cup
      coffeeConsumed(convertTo: cup) # => 2.6406254464508376 cup
    }
  }
```

#### \@convertAngle

Converts angle measurements from one unit to another.

```js
import { convertAngle } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # Int | Float => String
  trajectory: Float @convertAngle(
    # Note: There is no pre-configured default, you must specify
    # the originalUnit in your schema!
    originalUnit = deg # AngleTypesEnum!
    # When true, only the value will be returned
    defaultRaw = false # Boolean!
  )
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getPerson {
      # Raw => Original Unit => Requested Unit
      # 21.125 => 21.125 fluidounce => 2.6406254464508376 cup
      trajectory(convertTo: rad) # => 2.6406254464508376 cup
    }
  }
```

#### \@convertTime

Converts time measurements from one unit to another.

```js
import { convertTime } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # Int | Float => String
  age: Int @convertTime(
    # Note: There is no pre-configured default, you must specify
    # the originalUnit in your schema!
    originalUnit = years # TimeTypesEnum!
    # When true, only the value will be returned
    defaultRaw = false # Boolean!
  )
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getPerson {
      # Raw => Original Unit => Requested Unit
      # 21 => 21 years => 7670.25 days
      age(convertTo: days) # => 7670.25 days
    }
  }
```

#### \@convertMass

Converts mass/weight measurements from one unit to another.

```js
import { convertTime } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # Int | Float => String
  weight: Int @convertTime(
    # Note: There is no pre-configured default, you must specify
    # the originalUnit in your schema!
    originalUnit = poundmass # TimeTypesEnum!
    # When true, only the value will be returned
    defaultRaw = false # Boolean!
  )
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getPerson {
      # Raw => Original Unit => Requested Unit
      # 21 => 21 years => 7670.25 days
      weight(convertTo: gram) # => 7670.25 days
    }
  }
```

#### \@convertTemperature

Converts temperature measurements from one unit to another.

```js
import { convertTemperature } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # Int | Float => String
  temperature: Float @convertTemperature(
    # Note: There is no pre-configured default, you must specify
    # the originalUnit in your schema!
    originalUnit = degF # TemperatureTypesEnum!
    # When true, only the value will be returned
    defaultRaw = false # Boolean!
  )
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getPerson {
      # Raw => Original Unit => Requested Unit
      # 21 => 21 years => 7670.25 days
      temperature(convertTo: degC) # => 7670.25 days
    }
  }
```

#### \@convertForce

Converts force measurements from one unit to another.

```js
import { convertForce } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # Int | Float => String
  temperature: Float @convertForce(
    # Note: There is no pre-configured default, you must specify
    # the originalUnit in your schema!
    originalUnit = degF # ForceTypesEnum!
    # When true, only the value will be returned
    defaultRaw = false # Boolean!
  )
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getPerson {
      # Raw => Original Unit => Requested Unit
      # 21 => 21 years => 7670.25 days
      temperature(convertTo: degC) # => 7670.25 days
    }
  }
```

#### \@convertEnergy

Converts energy measurements from one unit to another.

```js
import { convertEnergy } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # Int | Float => String
  temperature: Float @convertEnergy(
    # Note: There is no pre-configured default, you must specify
    # the originalUnit in your schema!
    originalUnit = degF # EnergyTypesEnum!
    # When true, only the value will be returned
    defaultRaw = false # Boolean!
  )
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getPerson {
      # Raw => Original Unit => Requested Unit
      # 21 => 21 years => 7670.25 days
      temperature(convertTo: degC) # => 7670.25 days
    }
  }
```

#### \@convertPower

Converts power measurements from one unit to another.

```js
import { convertPower } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # Int | Float => String
  temperature: Float @convertPower(
    # Note: There is no pre-configured default, you must specify
    # the originalUnit in your schema!
    originalUnit = degF # PowerTypesEnum!
    # When true, only the value will be returned
    defaultRaw = false # Boolean!
  )
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getPerson {
      # Raw => Original Unit => Requested Unit
      # 21 => 21 years => 7670.25 days
      temperature(convertTo: degC) # => 7670.25 days
    }
  }
```

#### \@convertPressure

Converts pressure measurements from one unit to another.

```js
import { convertPressure } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # Int | Float => String
  temperature: Float @convertPressure(
    # Note: There is no pre-configured default, you must specify
    # the originalUnit in your schema!
    originalUnit = degF # PressureTypesEnum!
    # When true, only the value will be returned
    defaultRaw = false # Boolean!
  )
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getPerson {
      # Raw => Original Unit => Requested Unit
      # 21 => 21 years => 7670.25 days
      temperature(convertTo: degC) # => 7670.25 days
    }
  }
```

#### \@convertBinary

Converts binary measurements from one unit to another.

```js
import { convertBinary } from "@saeris/graphql-directives"
```

Example Schema Usage:
```graphql
type Example {
  # Int => String
  diskSpace: Int @convertBinary(
    # Note: There is no pre-configured default, you must specify
    # the originalUnit in your schema!
    originalUnit = bytes # BinaryTypesEnum!
    # When true, only the value will be returned
    defaultRaw = false # Boolean!
  )
}
```

Example Query Usage:
```graphql
  query ExampleQuery {
    getPerson {
      # Raw => Original Unit => Requested Unit
      # 1024 => 1024 bytes => 78192 bits
      diskSpace(convertTo: bits) # => 8192 bits
    }
  }
```

## 📣 Acknowledgements

This library was inspired by [@lirown/graphql-custom-directives](https://github.com/lirown/graphql-custom-directives). It is an Apollo Server implementation based on their [Schema Directives documentation](https://www.apollographql.com/docs/graphql-tools/schema-directives.html).

## 🥂 License

Released under the [MIT license](https://github.com/Saeris/graphql-directives/blob/master/LICENSE.md).
