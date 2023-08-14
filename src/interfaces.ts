import { QueryResult } from "pg";

interface IMovie {
    id: number;
    name: string;
    category: string;
    duration: number;
    price: number;
}

type IMoviesCreate = Omit<IMovie, 'id'>;
type IMoviesResult = QueryResult<IMovie>;

export {IMovie, IMoviesCreate, IMoviesResult}

