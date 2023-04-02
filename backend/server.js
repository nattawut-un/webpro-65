import express from 'express'
import cors from 'cors'
import Router from './routes/routes.js'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import colors from 'colors'
import * as dotenv from 'dotenv'
dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

// console.log(' process.env '.bgGray, process.env)

app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:5173',
      'https://localhost:5173',
      'http://127.0.0.1:5173',
      'https://127.0.0.1:5173',
      process.env.CLIENT_ORIGIN
    ]
  })
);
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api', Router)
app.use('/images', express.static('images'))

app.get('/', (req, res, next) => {
  res.send('<h1>Web Programming 2023</h1><p>by Nattawut Unwiseth 64070035</p><a href="https://github.com/nattawut-un/webpro-65">GitHub</a><br><img src="https://media.tenor.com/71bZdJOKqqgAAAAC/spideyvivi.gif">')
})

app.listen(port, () => {
  console.log()
  console.log('======================================='.rainbow)
  console.log('         Web Programming 2023          '.bgYellow.bold)
  console.log('     by Nattawut Uniseth 64070035      '.yellow)
  console.log('    Starting node.js at port: '.yellow + colors.yellow.bold.underline(port))
  console.log('======================================='.rainbow)
  console.log()
});
