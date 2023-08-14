import { QueryConfig } from "pg";
import { IMovie, IMoviesCreate, IMoviesResult } from "./interfaces";
import { client } from "./database";
import format from "pg-format";
import { Request, Response, request } from "express";

const CreateMovies = async (req: Request, res: Response): Promise<Response> => {
    const payload: IMoviesCreate = req.body;

    const queryString: string =`
    INSERT INTO "movies"("name", "category", "duration","price")
    VALUES($1, $2, $3, $4)
    RETURNING *;
    `;
    
    const queryConfig: QueryConfig = {
        text: queryString,
        values: Object.values(payload)
    }

    const QueryResult: IMoviesResult = await client.query(queryConfig);
    const movie: IMovie = QueryResult.rows[0];

    return res.status(201).json(movie)

}

const readMovies = async (req: Request, res: Response): Promise<Response> => {

    const payload: string = req.query.category as string;
    if(payload){
     const queryString: string =`
     SELECT * FROM "movies" WHERE category = $1;
     `  
     const queryResult: IMoviesResult = await client.query(queryString, [payload]);

     if(queryResult.rows.length > 0){
        return res.status(200).json(queryResult.rows)
     }
    }

    const queryString:  string =`
    SELECT * FROM "movies";
    `;

    const queryResult: IMoviesResult = await client.query(queryString);
    

    return res.status(200).json(queryResult.rows);


}

const readMoviesbyId = async (req: Request, res: Response): Promise<Response> => {
    const itemMovie:IMovie = res.locals.QueryResult;

    return res.status(200).json(itemMovie);
}

const updateMovie = async (
    request: Request, 
    response: Response
    ): Promise<Response> => {
        const {body, params} = request;

        const updateColumns: string[] = Object.keys(body);
        const updateValues: string[] = Object.values(body);

        const queryTemplate: string = `
        UPDATE "movies"
        SET (%I) = ROW(%L)
        WHERE id = $1
        RETURNING *;
        `;

        const queryFormat: string = format(
            queryTemplate,
            updateColumns,
            updateValues
        )

        const queryConfig: QueryConfig = {
            text: queryFormat,
            values: [params.id],
        }

        const queryResult: IMoviesResult = await client.query(queryConfig);
        const updatedMovies: IMovie = queryResult.rows[0];

        
        return response.status(200).json(updatedMovies)
}

const deleteMovie = async (req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

   const queryString: string = `
    DELETE FROM "movies" WHERE "id" = $1;
   `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    await client.query(queryConfig);

    return res.status(204).send();
}



export { CreateMovies, updateMovie, readMovies, readMoviesbyId, deleteMovie}