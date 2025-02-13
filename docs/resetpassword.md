## after register user 


### Forgot Password
**POST** `/users/forgot-password`

Initiates password reset process by sending a reset code.

#### Request Body
{
  "email": "user@example.com"
}

### 2. Verify Reset Code
**POST** `/users/verify-reset-code`

Verifies the reset code and returns a temporary token.

#### Request Body
{
  "email": "user@example.com",
  "code": "123456"
}

#### Response
{
  "isError": false,
  "message": "Código verificado correctamente",
  "tempToken": "jwr_token_here"
}

### 3. Reset Password
**POST** `/users/reset-password`
Resets user's password using the temporary token.

#### Request Body
{
  "tempToken": "jwr_token_here",
  "newPassword": "newPassword"
}

## notes
el codigo de 6 digitos es el que se envia al email expira en 1 hora y el token tambien tendriamos que definir eso cuanto lo dejamos o si asi esta bien y el limite de intentos que se le permitira al usuario para el envio del codigo

## add codes, codeExpires, resetCode, resetCodeExpires, resetCodeAttempts in user model

ALTER TABLE usuarios
ALTER TABLE usuarios
ADD COLUMN codes VARCHAR(100),
ADD COLUMN codeExpires DATETIME,
ADD COLUMN resetCode VARCHAR(100),
ADD COLUMN resetCodeExpires DATETIME,
ADD COLUMN resetCodeAttempts INT DEFAULT 0

## env
y en el env cambie el email y la contraseña puse esta EMAIL=everjosejr18@gmail.com
EMAIL_PASSWORD=unyfjuzioekguvuj

