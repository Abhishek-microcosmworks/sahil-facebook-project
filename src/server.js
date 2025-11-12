// console.log("SERVER FILE LOADED");

// import app from "./app.js";

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });



// PORT=5000
// MONGO_URI=mongodb+srv://sahilahmed_db_user:T6EcQDTxWt0Pvq3U@cluster0.mz1jst2.mongodb.net/
// JWT_SECRET=T6EcQDTxWt0Pvq3U


// # mongodb+srv://sahilahmed_db_user:T6EcQDTxWt0Pvq3U@cluster0.mz1jst2.mongodb.net/


console.log("SERVER FILE LOADED");

import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n✅ Server running on port ${PORT}`);

  console.log("\n📌 API Base URL:");
  console.log(`👉 http://localhost:${PORT}/api\n`);

  console.log("📌 Try the health check (if you make one):");
  console.log(`👉 http://localhost:${PORT}/api/health\n`);

  console.log("---------------------------------------------\n");
});
