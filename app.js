const { PassThrough } = require("node:stream");
const PlayHT = require("playht");
let fs = require('fs');


try {
    PlayHT.init({
        apiKey: process.env.PLAYHT_API_KEY,
        userId: process.env.PLAYHT_USER_ID,
    });
} catch (error) {
    console.log("Failed to initialise PlayHT SDK", error.message);
}

// Function to read large file as a stream and process chunks
async function processTextFile(inputFilePath) {
    const result = new PassThrough();
    const textStream = fs.createReadStream(inputFilePath, 'utf8');

    textStream.on('data', async (chunk) => {
       result.push(chunk)
    });

    textStream.on('error', (err) => {
        console.error('Error reading text file:', err.message);
    });

    textStream.on('end', async (chunk) => {
        result.push(null)
     });

    return result;
}


async function main(inputFilePath, outputFilePath) {
    const audioFileStream = fs.createWriteStream(outputFilePath);
    try {
        const fileStream = await processTextFile(inputFilePath);
        const stream = await PlayHT.stream(fileStream, {
            voiceEngine: "PlayHT2.0-turbo",
            // this voice id can be one of our prebuilt voices or your own voice clone id, refer to the`listVoices()` method for a list of supported voices.
            voiceId: "s3://voice-cloning-zero-shot/775ae416-49bb-4fb6-bd45-740f205d20a1/jennifersaad/manifest.json",
            // you can pass any value between 8000 and 48000, 24000 is default
            sampleRate: 8000,
            // the generated audio encoding, supports 'raw' | 'mp3' | 'wav' | 'ogg' | 'flac' | 'mulaw'
            outputFormat: 'wav',
            temperature: 0.5,
            voiceGuidance: 1,
            //text_guidance: 0.95,

            // playback rate of generated speech
            speed: 1,
        });

        stream.pipe(audioFileStream);

       
        stream.on('end', (chunk) => {
            console.log("Done streaming");
            console.log("An audio file is created with name " + outputFilePath);
            process.exit(0)
        });
        
    } catch (error) {
       console.error("error", error);
    }
}

main("input_data.txt", "output_audio.wav");



