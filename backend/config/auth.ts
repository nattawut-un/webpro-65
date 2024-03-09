import * as dotenv from 'dotenv'
dotenv.config()

export default {
  'jwt-secret': process.env.JWT_SECRET || '',
  'salt-rounds' : parseInt(process.env.JWT_SALT_ROUNDS || '12')
}
