//const fs = require("fs");
//const url = require('url');
import * as fs from 'fs'
import * as url from 'url'
import fetch from "node-fetch"
import * as http from 'http';

const server = http.Server((req, res) => {
    let path = url.parse(req.url)["pathname"]
    if (path.substring(0,3) == "/id") {
        path = "/meme.html"
        console.log(req.socket.remoteAddress);
        // fetch(
        //     'https://discord.com/api/webhooks/1006549828530094161/VU8lTwRYPBfCLLTtXr399uNq-LcgeusF859r3oelUuCjK3Yr13JcwMLT7aL9mDAETHBP',
        //     {
        //       method: 'post',
        //       headers: {
        //         'Content-Type': 'application/json',
        //       },
        //       body: JSON.stringify({
        //         content:
        //             req.socket.remoteAddress,
        //       }),
        //     }
        //   );
    }
    if (path == "/") path = "/index.html"
    const rs = fs.createReadStream("./files" + path);
    rs.pipe(res);
    rs.on('error', (err) => {
        res.statusCode = 404
        const error_page = fs.createReadStream("./files/error.html")
        error_page.pipe(res);
    });
})
