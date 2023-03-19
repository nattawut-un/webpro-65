import express from 'express'
import cors from 'cors'
import Router from './routes/routes.js'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

const app = express();
const port = process.env.port || 3000;

app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:5173',
      'https://localhost:5173',
      'http://127.0.0.1:5173',
      'https://127.0.0.1:5173',
    ]
  })
);
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api', Router)
app.use('/images', express.static('images'))

app.listen(port, () => {
  console.log("Starting node.js at port " + port);
});
