module.exports = {
  /**
   * Conventional Commit Vocabulary:
   *
   *    type(scope): Subject <-- The config makes all of this required.
   *
   *    Body
   *
   *    Footer
   *
   */
  rules: {
    // Scope can never be empty.
    "scope-empty": [
      2, // Error if it is empty
      "never",
    ],
    // Scope's value must be one of these explicit strings.
    "scope-enum": [
      2,
      "always",
      // Override these values per your repo's scoping needs.
      ["repo"],
    ],
    // Subject and type are required alongside scope.
    "subject-empty": [2, "never"],
    "type-empty": [2, "never"],
  },
};
