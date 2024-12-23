const {getProfileByUserId,updateProfile}=require('../models/Auth/AuthDatabase')
const path = require('path');
require('dotenv').config();  
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
//Hiển thị profiles
const showProfiles = async (req, res) => {
  const token = req.query.token; 

  // Kiểm tra nếu không có token
  if (!token) {
    return res.redirect('/auth/login?message=Token+không+có');
  }

  try {
    // Giải mã token để lấy thông tin người dùng
    const decoded = jwt.verify(token, JWT_SECRET); // Giải mã token
    const user = decoded;  
    req.user = user;

    // Kiểm tra nếu không có user (không hợp lệ)
    if (!user) {
      return res.redirect('/auth/login?message=Đăng+nhập+lại+!');
    }

    // Lấy profile của người dùng
    const profile = await getProfileByUserId(user.id);

    // Kiểm tra nếu profile đã tồn tại
    if (profile) {
      // Nếu profile đã tồn tại, không cho phép cập nhật
      return res.render('profile', {
        username: user.username,
        profile, 
        allowUpdate: false, 
        token: token // Truyền lại token
      });
    } else {
      // Nếu không có profile, cho phép cập nhật
      return res.render('profile', {
        username: user.username,
        profile: { nickname: '', fullname: '', avatar: '' }, // Hiển thị dữ liệu mặc định
        allowUpdate: true, 
        token: token // Truyền lại token
      });
    }
  } catch (err) {
    // Nếu có lỗi trong quá trình giải mã token hoặc xử lý profile
    console.error('Lỗi khi hiển thị trang profile:', err.message || err);
    res.redirect('/auth/login?message="jwt hết hạn, vui lòng đăng nhập lại "');
  }
};
const UpdateProfile = async (req, res) => {
  // Kiểm tra xem người dùng có đăng nhập hay không
  if (!req.user) {
    return res.redirect('/auth/login?message=Đăng+nhập+lại+!');
  }

  const { nickname, fullname } = req.body;
  const avatar = req.files.avatar;
  const uploadPath = path.join(__dirname, '../uploads/', avatar.name);

  try {
    // Di chuyển ảnh avatar lên thư mục uploads
    await avatar.mv(uploadPath);
    const imageUrl = `/uploads/${avatar.name}`;

    // Cập nhật thông tin profile trong database
    await updateProfile(req.user.id, nickname, fullname, imageUrl);
    // Chuyển hướng lại trang profile với token đã được truyền
    res.redirect(`/auth/login?message="Update thành công, vui lòng Login lại "`);
  } catch (err) {
    // Xử lý lỗi khi có sự cố trong quá trình cập nhật profile
    res.status(500).send('Error updating profile.');
  }
};

module.exports = {showProfiles,UpdateProfile}