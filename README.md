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
import CustomDirectives from "@saeris/graphql-directives"
import typeDefs from "./types"
import resolvers from "./resolvers"
// Alternatively, import individual directives:
// import { formatDate } from "@saeris/graphql-directives"

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    // formatDate
    ...CustomDirectives
  }
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
```

Now you can use them in your schema just like you would any other Directive:

```graphql
type Person {
  # ...
  birthDate: String @formatDate(default: "MMMM D, YYYY")
  # ...
}
```

## 🏖️ Example

You can quickly take this library for a spin by running the example either locally under the `example` directory (just run `yarn && yarn start` and open your browser to http://localhost:4000) or live inside of CodeSandbox [here](https://codesandbox.io/s/github/Saeris/graphql-directives/).

## 🗺 Directives

### formatDate

```js
import { formatDate } from "@saeris/graphql-directives"
```

Allows clients to apply custom date formatting to date strings. Uses [`date-fns`](https://date-fns.org/v1.30.1/docs/format) under the hood. Formats include the following:

<!-- prettier-ignore-start -->
<details>
<summary>Show Formats Table</summary>

| Unit                    | Token | Result Examples                  |
| :---------------------- | :---- | :------------------------------- |
| Month                   | M     | 1, 2, ..., 12                    |
|                         | Mo    | 1st, 2nd, ..., 12th              |
|                         | MM    | 01, 02, ..., 12                  |
|                         | MMM   | Jan, Feb, ..., Dec               |
|                         | MMMM  | January, February, ..., December |
| Quarter                 | Q     | 1, 2, 3, 4                       |
|                         | Qo    | 1st, 2nd, 3rd, 4th               |
| Day of month            | D     | 1, 2, ..., 31                    |
|                         | Do    | 1st, 2nd, ..., 31st              |
|                         | DD    | 01, 02, ..., 31                  |
| Day of year             | DDD   | 1, 2, ..., 366                   |
|                         | DDDo  | 1st, 2nd, ..., 366th             |
|                         | DDDD  | 001, 002, ..., 366               |
| Day of week             | d     | 0, 1, ..., 6                     |
|                         | do    | 0th, 1st, ..., 6th               |
|                         | dd    | Su, Mo, ..., Sa                  |
|                         | ddd   | Sun, Mon, ..., Sat               |
|                         | dddd  | Sunday, Monday, ..., Saturday    |
| Day of ISO week         | E     | 1, 2, ..., 7                     |
| ISO week                | W     | 1, 2, ..., 53                    |
|                         | Wo    | 1st, 2nd, ..., 53rd              |
|                         | WW    | 01, 02, ..., 53                  |
| Year                    | YY    | 00, 01, ..., 99                  |
|                         | YYYY  | 1900, 1901, ..., 2099            |
| ISO week-numbering year | GG    | 00, 01, ..., 99                  |
|                         | GGGG  | 1900, 1901, ..., 2099            |
| AM/PM                   | A     | AM, PM                           |
|                         | a     | am, pm                           |
|                         | aa    | a.m., p.m.                       |
| Hour                    | H     | 0, 1, ... 23                     |
|                         | HH    | 00, 01, ... 23                   |
|                         | h     | 1, 2, ..., 12                    |
|                         | hh    | 01, 02, ..., 12                  |
| Minute                  | m     | 0, 1, ..., 59                    |
|                         | mm    | 00, 01, ..., 59                  |
| Second                  | s     | 0, 1, ..., 59                    |
|                         | ss    | 00, 01, ..., 59                  |
| 1/10 of second          | S     | 0, 1, ..., 9                     |
| 1/100 of second         | SS    | 00, 01, ..., 99                  |
| Millisecond             | SSS   | 000, 001, ..., 999               |
| Timezone                | Z     | -01:00, +00:00, ... +12:00       |
|                         | ZZ    | -0100, +0000, ..., +1200         |
| Seconds timestamp       | X     | 512969520                        |
| Milliseconds timestamp  | x     | 512969520900                     |

</details>
<!-- prettier-ignore-end -->

## 📣 Acknowledgements

This library was inspired by [@lirown/graphql-custom-directives](https://github.com/lirown/graphql-custom-directives). It is an Apollo Server implementation based on their [Schema Directives documentation](https://www.apollographql.com/docs/graphql-tools/schema-directives.html).

## 🥂 License

Released under the [MIT license](https://github.com/Saeris/graphql-directives/blob/master/LICENSE.md).
