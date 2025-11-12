
// console.log("SERVER FILE LOADED");

// import app from "./app.js";

// const PORT = process.env.PORT || 5000;

// import express from "express";
// import path from "path";

// const __dirname = path.resolve();

// // ✅ Serve uploaded files
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// app.listen(PORT, () => {
//   console.log(`\n✅ Server running on port ${PORT}`);

//   console.log("\n📌 API Base URL:");
//   console.log(`👉 http://localhost:${PORT}/api\n`);

//   console.log("📌 Try the health check (if you make one):");
//   console.log(`👉 http://localhost:${PORT}/api/health\n`);

//   console.log("📌 To Check All users:");
//   console.log(`👉 http://localhost:${PORT}/api/users\n`);

//   console.log("---------------------------------------------\n");
// });


// import app from "./app.js";

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
//   console.log(`📂 Uploads served at: http://localhost:${PORT}/uploads`);
// });
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📂 Serving uploads from: http://localhost:${PORT}/uploads`);
});
