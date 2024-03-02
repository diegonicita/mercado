const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization

  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1]
    console.log(token)

    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        console.log(err)
        res.sendStatus(403)
      } else {
        req.token = token
        req.user = decoded
        console.log(decoded.email)        
        next()
      }
    })
  } else {
    console.log(res)
    res.sendStatus(403)
  }
}

module.exports = verifyToken
