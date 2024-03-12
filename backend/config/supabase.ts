import { createClient } from '@supabase/supabase-js'

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_BUCKET_NAME } = process.env

if (!SUPABASE_URL)
  throw new Error('SUPABASE_URL is not found in environment variables.')
if (!SUPABASE_SERVICE_ROLE_KEY)
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY is not found in environment variables.'
  )
if (!SUPABASE_BUCKET_NAME)
  throw new Error('SUPABASE_BUCKET_NAME is not found in environment variables.')

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

console.log(SUPABASE_BUCKET_NAME)

export async function uploadFile(path: string, file: File) {
  const { data, error } = await supabase.storage
    .from(`${SUPABASE_BUCKET_NAME}`)
    .upload(path + new Date().getTime() + file.name, file)

  if (error) throw new Error(error.message)
  return data.path
}

export async function getPublicURL(path: string) {
  const { data } = supabase.storage
    .from(`${SUPABASE_BUCKET_NAME}`)
    .getPublicUrl(path)

  return data.publicUrl
}
