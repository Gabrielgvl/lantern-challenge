const b = require("benny");

b.suite(
  "Example",

  b.add("Reduce two elements", () => {
    [1, 2].reduce((a, b) => a + b);
  }),

  b.add("Reduce five elements", () => {
    [1, 2, 3, 4, 5].reduce((a, b) => a + b);
  }),

  b.cycle(),
  b.complete()
);