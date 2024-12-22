const {getProfileByUserId,updateProfile}=require('../models/Auth/AuthDatabase')
const path = require('path');

//Hiển thị profiles
const showProfiles = async (req, res) => {
  try {
    if (!req.user) {
      // Nếu req.user không tồn tại, trả về lỗi hoặc chuyển hướng
      return res.redirect('/auth/login?message=Đăng+nhập+lại+!');
    }
    const userId = req.user.id;
    //console.log(userId);

    const profile = await getProfileByUserId(userId);

    if (profile) {
      // Nếu profile đã tồn tại, không hiển thị form cập nhật
      return res.render('profile', {
        username: req.user.username,
        profile, 
        allowUpdate: false, // Không cho phép cập nhật
      });
    } else {
      // Nếu chưa có profile, cho phép cập nhật
      return res.render('profile', {
        username: req.user.username,
        profile: { nickname: '', fullname: '', avatar: '' },
        allowUpdate: true, // Cho phép cập nhật
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