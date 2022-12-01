import fs from "fs"
import http from "http"

const url_remaps = {
  "/": "/index.html"
}
const server = http.createServer((req, res) => {
  let page = req.url
  if (url_remaps[page]) page = url_remaps[page]
  let file = fs.createReadStream('./files'+page)
  file.on('error', function(err) {
    console.log(err);
    const error_page = fs.createReadStream("./files/error.html")
    error_page.pipe(res);
    return
  });
  file.pipe(res)
})
server.listen(process.env.PORT || 8080, () => {
  console.log("server is running");
});