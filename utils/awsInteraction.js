import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

async function downloadJsonFromS3(bucketName, fileKey, awsAccessKeyId, awsSecretAccessKey) {
    // Initialize S3 client
    const s3Client = new S3Client({
        region: 'us-east-1', // specify your region
        credentials: {
            accessKeyId: awsAccessKeyId,
            secretAccessKey: awsSecretAccessKey
        }
    });

    try {
        // Download the file from S3
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileKey
        });
        const response = await s3Client.send(command);

        // Read the content and parse it as JSON
        const content = await streamToString(response.Body);
        const jsonData = JSON.parse(content);

        return jsonData;
    } catch (error) {
        console.error(`Error downloading or parsing JSON from S3: ${error.message}`);
        return null;
    }
}

async function streamToString(stream) {
    // Convert stream to string
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
}

module.exports = { downloadJsonFromS3 };