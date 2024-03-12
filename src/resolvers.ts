import fetch from 'node-fetch';
 
 
const resolvers = {
  Query: {
    async getFilms() {
      // Appel à l'API REST pour récupérer les films
      const films = await fetch('https://ghibliapi.dev/films').then(res => res.json());
      return films.map(film => ({
        ...film,
        people: film.people.filter(url => url.includes('people')).map(url => ({ __typename: 'People', id: url.split('/').pop() }))
      }));
    },
    async getPeople() {
      // Appel à l'API REST pour récupérer les personnes
      const people = await fetch('https://ghibliapi.dev/people').then(res => res.json());
      return people.map(person => ({
        ...person,
        eyeColor: person.eye_color || 'N/A',
        films: person.films.map(url => ({ __typename: 'Film', id: url.split('/').pop() }))
      }));
    }
  },
  Film: {
    people(parent) {
      // Récupérer les informations des personnes à partir de leur ID
      return Promise.all(parent.people.map(async ({ id }) => {
        const person = await fetch(`https://ghibliapi.dev/people/${id}`).then(res => res.json());
        return {
          ...person,
          eyeColor: person.eye_color || 'N/A' // Fetch the eye color information and return it, or return 'N/A' if not available
        };
      }));
    }
  },
  People: {
    id(parent) {
      // Vérifier si l'ID est présent et le renvoyer, sinon renvoyer une valeur par défaut
      return parent.id || 'N/A';
    },
    films(parent) {
      // Récupérer les informations des films à partir de leur ID
      return parent.films.map(async ({ id }) => {
        return fetch(`https://ghibliapi.dev/films/${id}`).then(res => res.json());
      });
    }
  }
};
 
export default resolvers;