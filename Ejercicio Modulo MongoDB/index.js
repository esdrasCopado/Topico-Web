// index.js

import db from './config/db.js';
import UserDAO from './dataAccess/userDAO.js';

(async function(){
    let dbs = new db();
    let usurdao = new UserDAO();
    await dbs.connect();

    await usurdao.crear({ username: 'Martin', email: 'martin@example.com'})
    await usurdao.crear({ username: 'Ana', email: 'ana@example.com'})
    await usurdao.crear({ username: 'Luis', email: 'luis@example.com'})
    await usurdao.crear({ username: 'Maria', email: 'maria@example.com'})

    const usuarios = await usurdao.obtenerTodos();
    console.log(usuarios);

    dbs.disconnect();
})();
