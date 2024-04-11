import bcrypt from 'bcrypt'

const usuaris = [
    {
        nom: 'Quimet',
        email: 'quimet@quimet.cat',
        confirmat: 1,
        password: bcrypt.hashSync('123456', 10)
    }
]

export default usuaris