import bcrypt from 'bcrypt'

const usuarios = [
    {
        name: 'Usuario prueba',
        email: 'user@prueba.com',
        confirmed: 1,
        password: bcrypt.hashSync('password', 10)
    }
]

export default usuarios