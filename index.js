import express from 'express';
import 'dotenv/config';
import database from './database.js';
import Redis from 'ioredis';
import redisService from './service/redisService.js';

const app = express();
const redis = new Redis();
app.use(express.json());

app.get("/", async (req, res) => {
    res.send("Hello World");
})


// Write through cache strategy

// app.post("/users", async (req, res) => {
//     const { full_name, email, age, password } = req.body;  
//     try {   
//         await redis.set(email, JSON.stringify({ full_name, email, age, password }));
//         console.log("Data stored in Redis")
//         const query = 'INSERT INTO public.user (full_name, email, age, password) VALUES ($1, $2, $3, $4) RETURNING *';
//         const { rows } = await database.query(query, [full_name, email, age, password]);
//         console.log("Data stored in the database")
//         return res.status(201).send(rows[0]);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send("Internal server error");
//     }
// });


// Write behind cache strategy

let keysToSave = [];

const periodicWrite = async () => {
    if (keysToSave.length === 0) {
        console.log("There is no data to save")
        return;
    }
    const data = await redis.mget(keysToSave);
    data.map(async (stringifiedUser) => {
        const user = JSON.parse(stringifiedUser);
        console.log("Write to database", user)
        const query = 'INSERT INTO public.user (full_name, email, age, password) VALUES ($1, $2, $3, $4) RETURNING *';
        await database.query(query, [user.full_name, user.email, user.age, user.password]);
    })
    keysToSave = [];
}

// setInterval(periodicWrite, 10000);

app.post("/users", async (req, res) => {
    const { full_name, email, age, password } = req.body;  
    try {
        await redis.set(email, JSON.stringify({ full_name, email, age, password }));
        console.log("Data stored in Redis")
        keysToSave.push(email);
        return res.status(201).send({ full_name, email, age, password });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
});


// Cache aside strategy
// app.get("/users/:email", async (req, res) => {
//     const email = req.params.email; 
//     try {
//         const data = await redis.get(email)
//         if (data) {
//             console.log("Cache hit", data)
//             return res.status(200).send(JSON.parse(data));
//         }
//         console.log("Cache miss! Load data from the database")
//         const query = 'SELECT * FROM public.user WHERE email = $1';
//         const { rows } = await database.query(query, [email]);
//         console.log("Store the missing data in Redis: ", rows[0]);
//         await redis.set(email, JSON.stringify(rows[0]));
//         return res.status(200).send(rows[0]);
        
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send("Internal server error");
//     }   
// })


// Read through cache strategy

app.get("/users/:email", async (req, res) => {
    const email = req.params.email;
    try {
        const data = await redisService.get(email);
        return res.json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
    
    }
})


app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});