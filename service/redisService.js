import  Redis from "ioredis";
import database from "../database.js";

const redis = new Redis();

const redisService = {
    get: async (key) => {
        try {
            const data = await redis.get(key);
            if (data) {
                console.log("Cache hit", data);
                return JSON.parse(data);
            }
            console.log("Cache miss! Load data from the database");
            const { rows } = await database.query('SELECT * FROM public.user WHERE email = $1', [key]);
            console.log("Store the missing data in Redis: ", rows[0]);
            await redis.set(key, JSON.stringify(rows[0]));
            return rows[0];
        } catch (err) {
            console.error(err);
            return null;
        }
    }
};

export default redisService;
