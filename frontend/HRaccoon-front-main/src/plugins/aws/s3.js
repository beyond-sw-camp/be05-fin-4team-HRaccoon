import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

// S3 클라이언트 설정
const s3Client = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
})

export const S3uploadImage = async file => {
  const fileName = `${Date.now()}-${file.name}`
  const params = {
    Bucket: import.meta.env.VITE_AWS_IMAGE_BUCKET_NAME,
    Key: fileName,
    Body: file,
    ContentType: file.type,
  }

  try {
    const command = new PutObjectCommand(params)
    await s3Client.send(command)
    const imageUrl = `https://${params.Bucket}.s3.ap-northeast-2.amazonaws.com/${params.Key}`
    console.log('[SUCCESS] ImageUpload Success', imageUrl)
    return imageUrl
  } catch (err) {
    console.error('[ERROR] S3UploadImage failed: ', err)
    throw new Error('[ERROR] S3UploadImage failed')
  }
}

export const S3getImage = async fileName => {
  const params = {
    Bucket: import.meta.env.VITE_AWS_IMAGE_BUCKET_NAME,
    Key: fileName,
  }

  try {
    const command = new GetObjectCommand(params)
    const data = await s3Client.send(command)
    console.log('[SUCCESS] S3getImage getSuccess', data)
    return data.Body
  } catch (err) {
    console.error('[ERROR] S3getImage failed: ', err)
    throw new Error('[ERROR] S3getImage failed')
  }
}
