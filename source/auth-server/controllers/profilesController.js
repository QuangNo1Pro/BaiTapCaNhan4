const {getProfileByUserId,updateProfile}=require('../models/Auth/AuthDatabase')
const path = require('path');
require('dotenv').config();  
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
//Hiển thị profiles
const showProfiles = async (req, res) => {
  const token = req.query.token; 
  if (!token) {
    return res.status(401).json({ message: 'Token không hợp lệ.' });
  }
  
  try {
    // Kiểm tra token có phải là một chuỗi hợp lệ hay không
    if (token.length < 100) {
      return res.status(400).json({ message: 'Token không hợp lệ.' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = decoded; 
    
    if (!req.user) {
      // Nếu req.user không tồn tại, trả về lỗi hoặc chuyển hướng
      return res.redirect('/auth/login?message=Đăng+nhập+lại+!');
    }
    
    const userId = req.user.id;
    const profile = await getProfileByUserId(userId);

    if (profile) {
      // Nếu profile đã tồn tại, không hiển thị form cập nhật
      return res.render('profile', {
        username: req.user.username,
        profile, 
        allowUpdate: false, // Không cho phép cập nhật
        token: token // Truyền token vào trong render
      });
    } else {
      // Nếu chưa có profile, cho phép cập nhật
      return res.render('profile', {
        username: req.user.username,
        profile: { nickname: '', fullname: '', avatar: '' },
        allowUpdate: true, // Cho phép cập nhật
        token: token // Truyền token vào trong render
      });
    }
  } catch (err) {
    console.error('Lỗi khi hiển thị trang profile:', err.message || err);
    res.status(500).send('Lỗi khi hiển thị trang profile.');
  }
};



const UpdateProfile = async (req, res) => {
    if (!req.user) {
      return res.redirect('/auth/login?message=Đăng+nhập+lại+!');
    }
    const { nickname, fullname } = req.body;
    const avatar = req.files.avatar;
    const uploadPath = path.join(__dirname, '../uploads/', avatar.name);
    try {
        await avatar.mv(uploadPath);
        const imageUrl = `/uploads/${avatar.name}`;
        await updateProfile(req.user.id,nickname, fullname, imageUrl);
        res.redirect('/auth/profiles');
  } catch (err) {
    res.status(500).send('Error updating profile.');
  }
};


module.exports = {showProfiles,UpdateProfile}