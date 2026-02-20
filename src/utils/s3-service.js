import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

export async function uploadToSSS3(file, s3Key) {
  console.log('\n📤 S3 Upload Details:');
  console.log('  Bucket:', process.env.AWS_BUCKET);
  console.log('  Key:', s3Key);
  console.log('  File size:', file.buffer?.length, 'bytes');
  console.log('  Content-Type:', file.mimetype);
  
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: s3Key,
    Body: file.buffer,
    ContentType: file.mimetype,
    // Uncomment if you want public access:
    // ACL: 'public-read',
  };

  try {
    const result = await s3.upload(params).promise();
    
    console.log('✅ Upload successful!');
    console.log('  ETag:', result.ETag);
    console.log('  Location:', result.Location);
    
    // Verify the object exists
    await s3.headObject({
      Bucket: process.env.AWS_BUCKET,
      Key: s3Key
    }).promise();
    
    console.log('✅ File verified in S3');
    
    return result;
  } catch (error) {
    console.error('❌ S3 Error:', error.message);
    console.error('  Code:', error.code);
    console.error('  Status:', error.statusCode);
    throw error;
  }
}