const express = require("express");
const cors = require("cors");
const ep = require("./endpoints")

const app = express();

app.use(cors());
app.use(express.json()); // able to get json data from incoming request object


app.get("/quotes/:id", async(req,res) =>{
    try {
        // endpoint id is required -  should be available
        const { id } = req.params;

        if (id != "image"){
            const response = await fetch(`https://zenquotes.io/api/${id}`);
            const data = await response.json()
            console.log(data)
            // q, a - h is html formatted -> send back all to react app
            res.json(data);
        }
        else{
            const response = await fetch(`https://zenquotes.io/api/${id}`, 
                {
                    headers: {
                        'Content-Type': 'image/jpeg'
                    }
                }
            );
            const contentType = response.headers.get('content-type');
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
    
            res.setHeader('Content-Type', contentType);
            res.send(buffer);
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Failed to fetch quote' });
    }
})


// endRoutes
app.listen(5000, () => {
    console.log("Server started")
}) 

