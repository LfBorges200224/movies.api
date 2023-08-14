import { Request, Response, NextFunction } from "express";
import { IMoviesCreate, IMoviesResult } from "./interfaces";
import { client } from "./database";

const verifyExisteMovie = async (req: Request, res: Response, next: NextFunction): Promise<Response|void> => {
    const payload: IMoviesCreate = req.body;

    const queryString: string =` 
    SELECT * FROM "movies" WHERE name = $1;
    `;
    
    const QueryResult: IMoviesResult = await client.query(queryString,[
        payload.name
    ]);

    if(QueryResult.rows.length > 0){
        return res.status(409).json({message: "Movie already exists!"})
    }

    return next();
}

const verifyIdExists = async (req: Request, res: Response, next: NextFunction): Promise<Response|void> => {
    const { id } = req.params;
    const queryString: string = `
    SELECT * FROM "movies" WHERE id = $1;
    `;

    const QueryResult: IMoviesResult = await client.query(queryString, [id]);

    if(QueryResult.rows.length === 0 ){
        return res.status(404).json({message: "Movie not found!"});
    }

    res.locals.QueryResult = QueryResult.rows[0];

    return next();
}

export { verifyExisteMovie, verifyIdExists}