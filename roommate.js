//Requerimientos
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const url = 'https://randomuser.me/api/'

const nuevoRoommate = async (res) => {
    let user = {};
    await axios
        .get(url)
        .catch((error) => console.log(error))
        .then((datos) => {
            const data = datos.data.results;
            user = {
                id: uuidv4().slice(30),
                correo: data[0].email,
                nombre: `${data[0].name.first} ${data[0].name.last}`,
                debe: 0,
                recibe: 0,
            };
            return user;
        })
        .then(async (user) => {
            await guardarRoommate(user);
            res.end(JSON.stringify(user));
        })
        .catch((error) => {
            console.log(error);
        });
};
//json
const guardarRoommate = (newRoommate) => {
    try {
        const roommatesJSON = JSON.parse(fs.readFileSync('roommates.json', 'utf8'))
        roommatesJSON.roommates.push(newRoommate)
        fs.writeFileSync('roommates.json', JSON.stringify(roommatesJSON))
    } catch (error) {
        console.log(error);
    }
};

const actualizarRoommate = async (gasto) => {

    try {
        const userJSON = await JSON.parse(
            fs.readFileSync("roommates.json", "utf8")
        );
        let data = {};
        let deuda = gasto.monto / userJSON.roommates.length;
        data.roommates = userJSON.roommates.map((user) => {
            if (user.id == gasto.idroommie) user.recibe += deuda;
            else user.debe += deuda;
            return user;
        });
        fs.writeFileSync("roommates.json", JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    nuevoRoommate,
    guardarRoommate,
    actualizarRoommate
}

