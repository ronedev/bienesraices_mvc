import nodemailer from 'nodemailer'

const emailRegistro = async (data)=> {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      })

    const {name, email, token} = data

    await transport.sendMail({
        from: 'bienesraices.net',
        to: email,
        subject: 'Bienes Raices - Verifica tu cuenta',
        text: 'Confirma tu cuenta a continuacion:',
        html: `
            <p>Hola ${name}, verifica tu cuenta en Bienes Raices</p>

            <p>Tu cuenta ya esta lista, solo debes confirmar haciendo click en el siguiente enlace: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar-registro/${token}">Confirmar Cuenta</a></a></p>

            <span>En caso de que no hayas creado la cuenta, puedes ignorar esta mensaje</span>
        `
    })
}

const emailForgotPassword = async (data)=> {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      })

    const {name, email, token} = data

    await transport.sendMail({
        from: 'bienesraices.net',
        to: email,
        subject: 'Bienes Raices - Restablece tu contraseña',
        text: 'Restablece tu contraseña a continuación: ',
        html: `
            <p>Hola ${name}, has solicitado restablecer tu contraseña para bienesraices.net</p>

            <p>Has <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/forgot-password/${token}">Click aquí</a> para restablecer tu contraseña</p>

            <span>En caso de que no hayas solicitado el cambio de contraseña. puedes ignorar el mensaje</span>
        `
    })
}

export{
    emailRegistro,
    emailForgotPassword
}