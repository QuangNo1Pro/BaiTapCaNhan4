const db = require('pg-promise')()
require('dotenv').config()

// Kết nối cơ sở dữ liệu
const connection = db({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

//Lấy Top 5 Rated Movies
async function getTop5RatedMovies() {
  const query = `
    SELECT m.title , m.image
    FROM s22296.movies m
    JOIN s22296.ratings r ON m.id = r.movie_id
    WHERE r.imDb IS NOT NULL  
    ORDER BY r.imDb DESC
    LIMIT 5;
  `
  const result = await connection.any(query)
  return result
}

// Lấy Top 20 Movies by Revenue
async function getTop20RevenueMovies() {
  const query = `
    SELECT m.title , m.image
    FROM s22296.movies m
    JOIN s22296.box_office bo ON m.id = bo.movie_id
    WHERE bo.cumulativeworldwidegross IS NOT NULL  
    ORDER BY bo.cumulativeworldwidegross DESC
    LIMIT 20;
  `;
  const result = await connection.any(query)
  return result
}

// Lấy Top 20 Popular Movies
async function getTop20PopularMovies() {
  const query = `
    SELECT m.title , m.image
    FROM s22296.movies m
    LEFT JOIN s22296.review_items ri ON m.id = ri.movie_id
    LIMIT 20
  `
  const result = await connection.any(query)
  return result
}

// Hàm để lấy tất cả dữ liệu
async function getAllMovieData() {
  try {
    const top5RatedMovies = await getTop5RatedMovies()
    const top20RevenueMovies = await getTop20RevenueMovies()
    const top20PopularMovies = await getTop20PopularMovies()

    return { top5RatedMovies, top20RevenueMovies, top20PopularMovies }
  } catch (error) {
    console.error("Error fetching data: ", error)
    throw error; // Ném lỗi để controller có thể xử lý
  }
}
module.exports={getAllMovieData}