## after register user 

### Verify Email
**POST** `/users/sendCode`

Verifies user's email using the verification code.

#### Headers
Authorization: Bearer {token}

#### Request Body
{
  "email": "user@example.com"
}

### Forgot Password
**POST** `/users/forgot-password`

Initiates password reset process by sending a reset code.

#### Request Body
{
  "email": "user@example.com"
}

### 4. Reset Password
**POST** `/users/reset-password`

Resets user's password using the reset code.

#### Request Body
{
  "email": "user@example.com",
  "code": "123456",
  "password": "newPassword"
}

## notes
elimine sendEmail function in usercontroller no se si lo usabas para otra cosa y cambie el code de uuidv4 por 6 numeros random

## add resetToken and resetTokenExpires in user model
agregue el campo resetToken y resetTokenExpires en el modelo de usuario

ALTER TABLE usuarios
ADD COLUMN resetToken VARCHAR(100),
ADD COLUMN resetTokenExpires DATETIME;

## env
y en el env cambie el email y la contraseña puse esta EMAIL=everjosejr18@gmail.com
EMAIL_PASSWORD=unyfjuzioekguvuj

