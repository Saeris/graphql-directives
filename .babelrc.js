module.exports = {
  plugins: [
    require(`@babel/plugin-proposal-export-namespace-from`)
  ],
  presets: [
    [
      require(`@babel/preset-env`),
      { targets: { node: `8.10` }, useBuiltIns: `usage` }
    ]
  ],
  env: {
    test: {
      sourceMaps: `inline`,
      presets: [
        [
          require(`@babel/preset-env`),
          {
            targets: { node: `8.10` },
            modules: `commonjs`,
            useBuiltIns: `usage`
          }
        ]
      ]
    }
  }
}
