const express = require('express')

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

const db = new Database(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  db.connect().catch((err) =>
    console.error("Error connecting to database:", err)
  );
  
 

app.listen(PORT,() => {
    console.log("server stated at ${3000}")
})