var fs = require('fs');
const express = require('express')
const app = express()
const http = require('http')
const moment = require('moment')
const multiparty = require('multiparty')

// Server Connection
const port = '8080' 
app.set('port', port)
const server = http.createServer(app)
console.log('NODE TIME ===> ' + moment(new Date()).format("YYYY-MM-DD HH:mm:ss"))
server.listen(port, () => console.log(`API running on localhost:${port}`))


app.post('/upload', function (req, res) {
    const form = new multiparty.Form();
    form.parse(req, async (error, fields, data) => {
        if (error) throw new Error(error);
        Promise.all(data.file.map(file => {
            return new Promise((resolve, reject) => {
                const path = file.path
                const buffer = fs.readFileSync(path)
                fs.writeFile("./images/" + file.originalFilename, buffer, function (err) {
                    if (err) {
                        reject(err)
                        throw err;
                    }
                    console.log('Saved!');
                    resolve()
                });
            })
        })).then(result => {
            res.status(200).send("OK");
        }).catch(err => {
            res.status(400).send(err);
        })
    })
})