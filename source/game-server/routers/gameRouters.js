const express = require('express')
const router = express.Router()
const { authenticateToken, showOnlineUsers } = require('../controllers/gameControllers')

// Route game, yêu cầu người dùng phải xác thực bằng token JWT
router.get('/', authenticateToken, showOnlineUsers)
module.exports = router
