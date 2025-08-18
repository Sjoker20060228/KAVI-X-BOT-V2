name: Node.js CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Ensure pinned dependencies
        run: |
          npm pkg set dependencies.cheerio="1.0.0-rc.12"
          npm pkg set dependencies["css-select"]="5.1.0"

      - name: Install dependencies
        run: npm ci --legacy-peer-deps

      # If you need to run tests
      - name: Run tests
        run: npm test

      # Start the application in background (only if
