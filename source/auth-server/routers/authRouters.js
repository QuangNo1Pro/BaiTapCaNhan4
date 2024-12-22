const express = require('express')
// const passport = require('passport')
const router = express.Router()
const { showRegisterForm, registerUser } = require('../controllers/registerControllers')
const { renderLogin, login } = require('../controllers/loginControllers')
const { showProfiles } = require('../controllers/profilesController')
const { logout}=require('../controllers/logoutControllers')

//  hiển thị form đăng ký
router.get('/', showRegisterForm)
//  hiển thị form đăng ký
router.get('/auth/register', showRegisterForm)
router.post('/auth/register', registerUser)

// hiển thị trang đăng nhập
router.get('/auth/login', renderLogin)

// Xử lý đăng nhập
router.post('/auth/login', login)

// Profile
router.get('/auth/profiles', showProfiles)

//Logout
router.get('/auth/logout',logout)

module.exports = router
