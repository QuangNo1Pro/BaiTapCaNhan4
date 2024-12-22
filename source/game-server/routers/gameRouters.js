const express = require('express')
const router = express.Router()
const { authenticateToken, getGamePage } = require('../controllers/gameControllers')

// Route game, yêu cầu người dùng phải xác thực bằng token JWT
router.get('/', authenticateToken, getGamePage)

module.exports = router
