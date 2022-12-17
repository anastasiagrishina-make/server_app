import connectMongodb from "./databases/mongodb.js"
import connectMap from "./databases/map.js";

const PORT = process.env.PORT || 3030;

const databaseType = 'Map';

switch (databaseType) {
    case "mongodb":
        connectMongodb(PORT);
        break
    case "Map":
        connectMap(PORT);
        break
    default:
        connectMongodb(PORT);
}





