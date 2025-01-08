import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import { Readable } from 'stream';

export class HashManager {
    constructor(bucketName, remoteFileKey, awsAccessKeyId, awsSecretAccessKey) {
        // Initialize S3 client with credentials
        this.s3Client = new S3Client({
            region: 'ap-south-1', // specify your region
            credentials: {
                accessKeyId: awsAccessKeyId,
                secretAccessKey: awsSecretAccessKey
            }
        });
        this.bucketName = bucketName;
        this.remoteFileKey = remoteFileKey;
    }

    async _initializeEmptyHashFile() {
        /** Initialize an empty hash file in S3 */
        const data = {
            hashes: [],
            lastUpdated: new Date().toISOString()
        };
        await this.s3Client.send(new PutObjectCommand({
            Bucket: this.bucketName,
            Key: this.remoteFileKey,
            Body: JSON.stringify(data, null, 2),
            ContentType: 'application/json'
        }));
        return [];
    }

    async getRemoteHashes() {
        /** Fetch hashes from remote S3 JSON file */
        try {
            const response = await this.s3Client.send(new GetObjectCommand({
                Bucket: this.bucketName,
                Key: this.remoteFileKey
            }));
            const bodyContents = await this.streamToString(response.Body);
            const data = JSON.parse(bodyContents);
            return data.hashes || [];
        } catch (error) {
            if (error.name === 'NoSuchKey') {
                // If file doesn't exist, create it and return empty list
                return this._initializeEmptyHashFile();
            } else {
                console.error(`Error fetching remote hashes: ${error.message}`);
                return [];
            }
        }
    }

    async updateRemoteHashes(newHashes) {
        /** Update remote JSON file with new hashes */
        try {
            const data = {
                hashes: newHashes,
                lastUpdated: new Date().toISOString()
            };
            await this.s3Client.send(new PutObjectCommand({
                Bucket: this.bucketName,
                Key: this.remoteFileKey,
                Body: JSON.stringify(data, null, 2),
                ContentType: 'application/json'
            }));
            return true;
        } catch (error) {
            console.error(`Error updating remote hashes: ${error.message}`);
            return false;
        }
    }

    async addHash(newHash) {
        /** Add a single hash to the remote file */
        const currentHashes = await this.getRemoteHashes();
        if (!currentHashes.includes(newHash)) {
            currentHashes.push(newHash);
            await this.updateRemoteHashes(currentHashes);
            return true;
        }
        return false;
    }

    async removeHash(hashToRemove) {
        /** Remove a hash from the remote file */
        const currentHashes = await this.getRemoteHashes();
        if (currentHashes.includes(hashToRemove)) {
            const updatedHashes = currentHashes.filter(hash => hash !== hashToRemove);
            await this.updateRemoteHashes(updatedHashes);
            return true;
        }
        return false;
    }

    generateHash(inputString) {
        /** Generate a SHA-256 hash from an input string */
        const hash = crypto.createHash('sha256');
        hash.update(typeof inputString === 'string' ? inputString : JSON.stringify(inputString));
        return hash.digest('hex');
    }

    async streamToString(stream) {
        /** Convert stream to string */
        return new Promise((resolve, reject) => {
            const chunks = [];
            stream.on('data', chunk => chunks.push(chunk));
            stream.on('error', reject);
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        });
    }
}
