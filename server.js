const express = require("express");
const path = require("path");

const app = express();

// 设置静态文件目录
app.use(express.static(path.join(__dirname, "src")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
