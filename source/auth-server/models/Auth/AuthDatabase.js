const { connection } = require('../../../connectToDB/db');
const checkAccountExists = async (username) => { 
    try {
        const result = await connection.oneOrNone('SELECT * FROM s22296.users WHERE "username" = $1', [username])
        return result? true : false;
    } catch (e) {
        throw e;
    }
}
async function getUserByUsername(username) {
    const res = await connection.query('SELECT * FROM s22296.users WHERE "username" = $1', [username]);
    return res[0]
}

async function getUserById(id) {
    const res = await connection.query('SELECT * FROM s22296.users WHERE "id" = $1', [id]);
    return res[0];
}
const addUser = async (username, hashedPassword) => { 
    try {
        await connection.none('INSERT INTO s22296.users ("username","password") VALUES ($1, $2)',
            [username, hashedPassword])
        console.log('Thêm tài khoản thành công!');
    } catch (e) {
        throw e;
    }

}



module.exports = {getUserByUsername,getUserById,checkAccountExists,addUser };
