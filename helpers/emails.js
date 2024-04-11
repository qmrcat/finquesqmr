import nodemailer from 'nodemailer'

const emailRegistre = async (usuari) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    console.log( 'emailRegistre: ', usuari );
    

    const { email, nom, token } = usuari

    // Enviar el email
    await transport.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Confirma el teu compte a Finques.cat',
        text: 'Confirma el teu compte a Finques.cat',
        html: `
             <p>Hola ${nom}, comprova el teu compte a Finques.cat</p>

             <p>El teu compte ja esta llest i configurat, només l'has de confirmar al següent enllaç:
             <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? process.env.BACKEND_PORT}/auth/confirmar/${token}">Confirmar Compte</a> </p>

             <p>Si no heu creat aquest compte, podeu ignorar el missatge</p>
        `
    })
}

const emailRecuperarPassword = async (usuari) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nom, token } = usuari

    // Enviar el email
    await transport.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Reestableix el teu Password a Finques.cat',
        text: 'Reestableix el teu Password a Finques.cat',
        html: `
            <p>Hola ${nom}, has sol·licitat restablir el teu password a Finques.cat</p>

            <p>Segueix el següent enllaç per generar un password nou:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? process.env.BACKEND_PORT}/auth/recuperar-pas/${token}">Reestablir Password</a> </p>

            <p>Si tu no vas sol·licitar el canvi de contrasenya, pots ignorar el missatge</p>
        `
    })
}


export {
    emailRegistre,
    emailRecuperarPassword
}