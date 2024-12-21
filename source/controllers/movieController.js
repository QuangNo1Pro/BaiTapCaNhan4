const { getAllMovieData } = require('../models/db');
const fs = require('fs');
const path = require('path');
const TemplateEngine = require('../22296'); // Đảm bảo đường dẫn đúng tới TemplateEngine.js

// Hàm xử lý trang chủ
async function homePage(req, res) {
  try {
    // Lấy dữ liệu phim
    const { top5RatedMovies, top20RevenueMovies, top20PopularMovies } = await getAllMovieData();

    // Đọc file template từ đĩa
    const templatePath = path.join(__dirname,'..', 'views', 'home.html');
    const template = await fs.promises.readFile(templatePath, 'utf-8');

      const data = {
          top5RatedMovies: top5RatedMovies,
          top20RevenueMovies: top20RevenueMovies,
          top20PopularMovies: top20PopularMovies,
      };
      // Khởi tạo TemplateEngine với dữ liệu gộp
    const engine = new TemplateEngine(data,template);
    const finalContent = engine.render();

    // Trả lại kết quả render cho client
    res.send(finalContent);
  } catch (error) {
    console.error("Error rendering home page:", error);
    res.status(500).send("Server Error");
  }
}

module.exports = { homePage };
