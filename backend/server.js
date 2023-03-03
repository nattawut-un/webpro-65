import express from 'express'
import cors from 'cors'
import Router from './routes/routes.js'

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use(Router)

app.listen(port, () => {
  console.log("Starting node.js at port " + port);
});
