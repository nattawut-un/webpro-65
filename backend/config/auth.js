import * as dotenv from 'dotenv'
dotenv.config()

export default {
  'jwt-secret': process.env.jwt_secret,
  'salt-rounds' : parseInt(process.env.jwt_salt_rounds)
}
