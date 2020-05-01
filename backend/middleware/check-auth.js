const jwt = require('jsonwebtoken')

// this is how we define the middle in node.js
module.exports = (req, res, next) => {
  try {
    // 'Bearer xxxxxxxxxxx'
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_KEY)
    req.userData = {
      ...decodedToken
    }
    next()
  } catch (error) {
    res.status(401).json({
      message: 'Auth failed!'
    })
  }

}
