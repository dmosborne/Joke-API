import express from 'express';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", (req,res) => {
    res.render("index.ejs", {
        joke: null,
        user: null
    });
});

app.post("/get-joke", async (req, res) => {
    const username = req.body.username;
    
    try {
        const result = await axios.get("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit);

        let joke;

        if (result.data.type === "single") {
            joke = result.data.joke;
        } else {
            joke = `${result.data.setup} - ${result.data.delivery}`;
        }

        res.render("index.ejs", {
            joke: joke,
            user: username
        });

    } catch (error) {
        console.log(error.response?.data || error.message);
        res.status(500).send("Error fetching joke");
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
