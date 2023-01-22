import connectMongodb from "./databases/mongodb.js"
import connectMap from "./databases/map.js";

const PORT = process.env.PORT || 3030;
const databaseType = process.env.DB.toLowerCase();

const databaseConnections = {
    mongodb: connectMongodb,
    map: connectMap,
};

const connectDatabase = databaseConnections[databaseType];

if (!connectDatabase) {
    throw new Error("Database type isn't provided");
}

connectDatabase(PORT);





