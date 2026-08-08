fetch(
  `${DOG_API}${path}`, // where
  { headers: { "x-api-key": process.env.DOG_API_KEY } }, // who you are
);
// then: check response.ok                          // did it work
