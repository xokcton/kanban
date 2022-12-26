const jwt = require('jsonwebtoken')
const User = require('../models/user')

const decodeToken = (req) => {
  const bearerHeader = req.headers['authorization']
  if (!bearerHeader) return false

  try {
    const bearer = bearerHeader.split(" ")[1]
    const decodedToken = jwt.verify(
      bearer,
      process.env.TOKEN_SECRET_KEY
    )
    return decodedToken
  } catch {
    return false
  }
}

exports.verifyToken = async (req, res, next) => {
  const decodedToken = decodeToken(req)
  if (decodedToken) {
    try {
      const user = await User.findById(decodedToken.id)
      if (!user) return res.status(401).json("Unathorized")
      req.user = user
      next()
    } catch (error) {
      res.status(500).json("Something went wrong!")
    }
  } else res.status(401).json("Unathorized")
} 