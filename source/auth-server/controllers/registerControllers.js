const { checkAccountExists, addUser } = require('../models/Auth/AuthDatabase')
const bcrypt = require('bcrypt')

// Show form đăng kí
const showRegisterForm = async (req, res) => {
  res.render('register')  
}

const registerUser = async (req, res) => {
    const { username, password } = req.body;
    try { 
        const userExists = await checkAccountExists(username);
      if (userExists) {
            return res.render('register', {
                errorMessage: 'Username đã tồn tại, vui lòng chọn username khác!',
            });
            
        }

        //hash mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
        await addUser(username, hashedPassword);
        res.redirect('/auth/login');
    }
    catch(err) {
      console.log('Lỗi đăng kí ', err);
      res.render('register', {
            errorMessage: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
        });
        
    }
}
module.exports = {showRegisterForm, registerUser}