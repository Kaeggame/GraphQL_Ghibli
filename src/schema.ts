const typeDefs = `
type Film {
  id: ID!
  title: String
  people: [People!]
}

type People {
  id: ID!
  name: String
  eyeColor: String
  films: [Film!]
}

type Query {
  getFilms: [Film!]!
  getPeople: [People!]!
}
`;

export default typeDefs;