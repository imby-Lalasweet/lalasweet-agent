import fs from 'fs';

// Read .env file to get the key
const envFile = fs.readFileSync('.env', 'utf-8');
const match = envFile.match(/VITE_GEMINI_API_KEY=(.*)/);
if (!match) {
    console.error("No API key found in .env");
    process.exit(1);
}
const apiKey = match[1].trim();

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

try {
    const response = await fetch(url);
    const parsed = await response.json();
    if (parsed.error) {
        console.error(parsed.error.message);
    } else {
        console.log("--- 사용 가능한 모델 리스트 ---");
        parsed.models.forEach(m => {
            if (m.supportedGenerationMethods.includes('generateContent')) {
                console.log(`모델 이름: ${m.name}`);
            }
        });
    }
} catch (e) {
    console.error(e);
}
