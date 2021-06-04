const express = require('express')
const { exec } = require("child_process");
const app = express()
const port = 3000

app.get('/', (req, res) => {
    exec("planet mosaics list", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(stdout);
    });
})

app.get('/mosaics/{geometry}/start/end', (req, res) => {
    res.send(`PL_API_KEY: ${process.env.PL_API_KEY}`)
})

app.listen(port, () => {
  console.log(`Planet test runing on http://localhost:${port}`)
})