import { createClient } from "redis";

export const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    }
});


export const publisher = client.duplicate();
export const subscriber = client.duplicate();

client.on('error', err => console.log('Redis Client Error', err));
const connectRedis = async () => {
    try {
        await client.connect();
        await publisher.connect();
        await subscriber.connect();
        console.log('connect to redis success !');
    } catch (error) {
        console.log('connect to redis failed !', error.message);
    }

}

connectRedis();



