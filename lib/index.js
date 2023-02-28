import connectMongodb from "./databases/mongodb.js"
import connectMap from "./databases/map.js";
import 'dotenv/config';
import { connectPostgres } from "./databases/postgreSQL.js";

const PORT = process.env.PORT || 3030;
const databaseType = process.env.DB.toLowerCase();
// console.log('Port ' + PORT)
// console.log(databaseType)

const databaseConnections = {
    mongodb: connectMongodb,
    map: connectMap,
    postgres: connectPostgres
};

const connectDatabase = databaseConnections[databaseType];

if (!connectDatabase) {
    throw new Error("Database type isn't provided");
}

connectDatabase(PORT);





