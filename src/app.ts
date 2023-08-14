import express, { Application, json } from "express";
import { startDataBase } from "./database";
import { CreateMovies, deleteMovie, readMovies, readMoviesbyId, updateMovie } from "./logics";
import { verifyExisteMovie, verifyIdExists} from "./midlewares";

const app: Application = express();

app.use(json());

app.post("/movies", verifyExisteMovie, CreateMovies)

app.get("/movies", readMovies)

app.get("/movies/:id", verifyIdExists, readMoviesbyId)

app.patch("/movies/:id", verifyIdExists, verifyExisteMovie, updateMovie)

app.delete("/movies/:id", verifyIdExists, verifyExisteMovie, deleteMovie)

const Msgserver = `Server running on http://localhost:${process.env.PORT}`;

app.listen(process.env.PORT, async () =>{
    await startDataBase();
    console.log(Msgserver);
} )