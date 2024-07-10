import { Redis } from "ioredis";

let client: Redis;

export function makeRedisClient() {
    if (!client) {
        client = new Redis(process.env.REDIS_URL as string);
        console.log("Redis Client Created");
    }
}

export { client };
