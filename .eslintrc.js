module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "plugins": [
      "react",
      "jsx-a11y",
      "import",
  ],
  "env": {
    "browser": true,
  },
  "rules": {
    "no-trailing-spaces": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "react/sort-comp": 0,
  }
};