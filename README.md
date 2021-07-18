[![Blitz.js](https://raw.githubusercontent.com/blitz-js/art/master/github-cover-photo.png)](https://blitzjs.com)

This is a [Blitz.js](https://github.com/blitz-js/blitz) app.

# **lantern-wallet**

## Getting Started

You will need docker-compose to run the postgres database.

Run your app in the development mode.

```
blitz dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To populate the database with actual currencies from the [Currency Converter API Documentation (natkapral) | RapidAPI](https://rapidapi.com/natkapral/api/currency-converter5/)

```
blitz db seed
```

## Tests

Runs your tests using Jest.

```
yarn test
```
