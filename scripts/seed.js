import { Movie, Rating, User, db } from "../src/model.js";
import movieData from "./data/movies.json" assert { type: "json" };
import lodash from "lodash";

console.log("Syncing database.....");
await db.sync({ force: true });

console.log("Seeding database...");

const moviesInDB = await Promise.all(
  movieData.map(async (movie) => {
    const releaseDate = new Date(Date.parse(movie.releaseDate));
    const { title, overview, posterPath } = movie;

    const newMovie = Movie.create({
      title,
      overview,
      posterPath,
      releaseDate,
    });

    return newMovie;
  })
);

const usersToCreate = [];
for (let i = 1; i <= 10; i++) {
  const newUser = User.create({
    email: `user${i}@email.com`,
    password: "test",
  });
  usersToCreate.push(newUser);
}
const usersInDB = await Promise.all(usersToCreate);

const ratingsInDB = await Promise.all(
  usersInDB.flatMap((user) => {
    // Get ten random movies
    const randomMovies = lodash.sampleSize(moviesInDB, 10);

    // Create a rating for each movie
    const movieRatings = randomMovies.map((movie) => {
      return Rating.create(
        {
          score: lodash.random(1, 5),
          userId: user.userId,
          movieId: movie.movieId,
        },
        { underscored: true }
      );
    });

    return movieRatings;
  })
);

// console.log(ratingsInDB);
// console.log(moviesInDB);
// console.log(usersInDB);
