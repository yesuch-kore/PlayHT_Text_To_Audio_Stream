# Text to Audio File Generator

## Purpose
This script generates an audio file from a provided text file using PlayHT’s API.

## Approach
Given that the text file may be large, a read stream is created to handle it efficiently. The text is then piped continuously to PlayHT for audio synthesis. The resulting audio stream is piped to a write stream, generating the audio file in real-time.

## Usage
To use this script, ensure that you have your PlayHT credentials. Then, run the following command:

```bash
PLAYHT_USER_ID=<PLAYHT_USER_ID> PLAYHT_API_KEY=<PLAYHT_API_KEY> node app.js