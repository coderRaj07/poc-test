import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';
// import dotenv from 'dotenv';
import { Proof } from './utils/proofValidation.js';

// Load environment variables from .env file
// dotenv.config();

// // Default to 'production' if NODE_ENV is not set
// const environment = process.env.NODE_ENV || 'production';

// Set the input and output directories based on the environment
const INPUT_DIR = './demo/input'
const OUTPUT_DIR = './demo/output'
const SEALED_DIR ='./demo/sealed'

function loadConfig() {
    const config = {
        dlpId: process.env.DLP_ID,  // dlp_id is 24 for our datadao
        inputDir: INPUT_DIR,
        // salt: '5EkntCWI',
        validatorBaseApiUrl: process.env.VALIDATOR_BASE_API_URL,
        awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
        awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    };
    console.info(`Using config: ${JSON.stringify(config, null, 2)}`);
    return config;
}

async function extractInput() {
    const inputFiles = fs.readdirSync(INPUT_DIR);

    for (const inputFilename of inputFiles) {
        const inputFile = path.join(INPUT_DIR, inputFilename);

        if (inputFile.endsWith('.zip')) {
            await new Promise((resolve, reject) => {
                fs.createReadStream(inputFile)
                    .pipe(unzipper.Extract({ path: INPUT_DIR }))
                    .on('close', () => {
                        console.info(`Extracted ${inputFile}`);
                        resolve();
                    })
                    .on('error', reject);
            });
        }
    }
}

function testGenerate(){
    return {
        "dlp_id": 24, // DLP ID is found in the Root Network contract after the DLP is registered
        "valid": true, // A single boolean to summarize if the file is considered valid in this DLP
        "score": 0.7614457831325301, // A score between 0 and 1 for the file, used to determine how valuable the file is. This can be an aggregation of the individual scores below.
        "authenticity": 1.0, // A score between 0 and 1 to rate if the file has been tampered with
        "ownership": 1.0, // A score between 0 and 1 to verify the ownership of the file
        "quality": 0.6024096385542169, // A score between 0 and 1 to show the quality of the file
        "uniqueness": 0, // A score between 0 and 1 to show unique the file is, compared to others in the DLP
        "attributes": { // Custom attributes that can be added to the proof to provide extra context about the encrypted file
          "total_score": 0.5,
          "score_threshold": 0.83,
          "email_verified": true
        }
      }
}

async function run() {
    // const config = loadConfig();
    console.log('Running proof generation...', fs.existsSync(INPUT_DIR));
    const inputFilesExist = fs.existsSync(INPUT_DIR) && fs.readdirSync(INPUT_DIR).length > 0;

    if (!inputFilesExist) {
        throw new Error(`No input files found in ${INPUT_DIR}`);
    }

    await extractInput();

    // Assume Proof is asynchronous
    // const proof = new Proof(config);
    const proofResponse =  testGenerate();

    const outputPath = path.join(OUTPUT_DIR, 'results.json');
    fs.writeFileSync(outputPath, JSON.stringify(proofResponse, null, 2));
    console.info(`Proof generation complete: ${JSON.stringify(proofResponse, null, 2)}`);
}

// Call the run function immediately
(async () => {
    try {
        await run();
        console.log('Run function executed successfully.');
    } catch (error) {
        console.error('Error executing run function:', error);
    } 
})();