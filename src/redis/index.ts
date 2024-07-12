import { Redis } from "ioredis";

let client: Redis;

export function makeRedisClient() {
    if (!client) {
        client = new Redis({
            host: process.env.REDIS_HOST as string,
            port: process.env.REDIS_PORT as unknown as number,
        });
        console.log("Connection with redis server established!");
    }
}

export { client };
