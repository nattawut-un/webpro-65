import express from 'express'
import cors from 'cors'
import Router from './routes/routes.js'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import colors from 'colors'

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
      'https://webpro-65.vercel.app'
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
  console.log()
  console.log('==================================='.rainbow)
  console.log(' Web Programming 2023 '.bgBrightYellow)
  console.log('by Nattawut Uniseth 64070035'.brightYellow)
  console.log('Starting node.js at port '.brightYellow + colors.brightYellow.underline(port))
  console.log('==================================='.rainbow)
  console.log()
});
