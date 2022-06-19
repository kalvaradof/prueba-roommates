const http = require('http')
const fs = require('fs')
const url = require('url')

const { nuevoRoommate, guardarRoommate, actualizarRoommate } = require('./roommate')
const { agregarGasto, consultarGasto, actualizarGastoRoommate, eliminarGasto, editarGasto } = require('./gastos')

http
    .createServer(async (req, res) => {
        // Creación de servidor
        if (req.url == "/" && req.method == "GET") {
            // Página raíz
            res.setHeader("content-type", "text/html");
            res.end(fs.readFileSync("index.html", "utf8"));
        }

        if (req.url.startsWith("/roommate") && req.method == "POST") {
            await nuevoRoommate(res);
            await actualizarGastoRoommate();
        }

        if (req.url.startsWith("/roommate") && req.method == "GET") {
            res.setHeader("Content-Type", "application/json");
            asyncReadFile('roommates.json')
            guardarRoommate(req, res)
                .then((data) => {
                    res.end(data)
                })
                .catch((err) => {
                    res.writeHead(500)
                    res.end(`Error: ${err}`)
                })
        } 
        
        if (req.url.startsWith("/gastos") && req.method == "GET") {
            res.setHeader("Content-Type", "application/json");
            consultarGasto(req, res)
            asyncReadFile('gastos.json')
                .then((data) => {
                    res.end(data)
                })
                .catch((err) => {
                    res.writeHead(500)
                    res.end(`Error: ${err}`)
                })
        }

        if (req.url.startsWith("/gasto") && req.method == "POST") {
            await agregarGasto(req, res).then((gasto) => {
                res.end(JSON.stringify(gasto));
            });
        }

        if (req.url.startsWith("/gasto") && req.method == "PUT") {
            console.log(`${res.statusCode} PUT GASTO`);
            await editarGasto(req, res);
        }

        if (req.url.startsWith("/gastos") && req.method == "DELETE") {
            console.log(`${res.statusCode} DELETE GASTO`);
            const params = url.parse(req.url, true).query;
            const id_costo = params.id;
            await eliminarGasto(id_costo, res);
        }
    })
    .listen(3000, () => console.log("3000 ON"));


