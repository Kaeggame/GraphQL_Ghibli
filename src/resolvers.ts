import fetch from 'node-fetch';
 
 
const resolvers = {
  Query: {
    async getFilms() {
      const films = await fetch('https://ghibliapi.dev/films').then(res => res.json());
      return films.map(film => ({
        ...film,
        people: film.people.filter(url => url.includes('people')).map(url => ({ __typename: 'People', id: url.split('/').pop() }))
      }));
    },
    async getPeople() {
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
      return Promise.all(parent.people.map(async ({ id }) => {
        const person = await fetch(`https://ghibliapi.dev/people/${id}`).then(res => res.json());
        return {
          ...person,
          eyeColor: person.eye_color || 'N/A'
        };
      }));
    }
  },
  People: {
    id(parent) {
      return parent.id || 'N/A';
    },
    films(parent) {
      return parent.films.map(async ({ id }) => {
        return fetch(`https://ghibliapi.dev/films/${id}`).then(res => res.json());
      });
    }
  }
};
 
export default resolvers;