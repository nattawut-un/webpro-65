import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import Router from './routes/routes'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import colors from 'colors'
import morgan from 'morgan'
import * as dotenv from 'dotenv'
dotenv.config()

const app: Express = express();
const port = process.env.PORT || '3000';

app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:5173',
      'https://localhost:5173',
      'http://127.0.0.1:5173',
      'https://127.0.0.1:5173',
      'http://localhost:4173',
      'https://localhost:4173',
      'http://127.0.0.1:4173',
      'https://127.0.0.1:4173',
      'http://localhost',
      'http://127.0.0.1',
      process.env.CLIENT_ORIGIN || ''
    ]
  })
);
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.static('static'))

app.use('/api', Router)
0
app.get('/', (req: Request, res: Response) => {
  res.send(
    '<h1>Restaurant App: Express Backend</h1><p>by Nattawut Unwiseth 64070035</p><a href="https://github.com/nattawut-un/webpro-65">GitHub</a><br><img src="https://media.tenor.com/71bZdJOKqqgAAAAC/spideyvivi.gif">'
  )
})

app.listen(port, () => {
  console.log()
  console.log('========================================'.rainbow)
  console.log('    Restaurant App: Express Backend     '.bgYellow.bold)
  console.log('      by Nattawut Uniseth 64070035      '.yellow)
  console.log('     Starting node.js at port: '.yellow + colors.yellow.bold.underline(port))
  console.log('========================================'.rainbow)
  console.log()
});
