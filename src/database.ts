import 'dotenv/config'
import { Client } from 'pg'

const client: Client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB,
    port: Number(process.env.DB_PORT),
})

const startDataBase = async (): Promise<void> => {
    await client.connect()
    console.log('database connected')
}

export { client, startDataBase};
