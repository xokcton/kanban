const User = require('../models/user')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
  try {
    const { password } = req.body
    req.body.password = CryptoJS.AES.encrypt(
      password,
      process.env.PASSWORD_SECRET_KEY
    )
    const user = await User.create(req.body)
    const token = jwt.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '24h' }
    )

    res.status(201).json({ user, token })
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username }).select('password username')

    if (!user) return res.status(401).json({
      errors: [
        {
          param: 'username',
          msg: 'Invalid username or password!'
        }
      ]
    })

    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8)

    if (decryptedPassword !== password) return res.status(401).json({
      errors: [
        {
          param: 'username',
          msg: 'Invalid username or password!'
        }
      ]
    })

    user.password = undefined
    const token = jwt.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '24h' }
    )

    res.status(200).json({ user, token })
  } catch (error) {
    res.status(500).json(error)
  }
}