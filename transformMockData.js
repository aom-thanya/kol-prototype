import fs from 'fs';

// Read the original file
const path = './src/data/mockData.js';
let content = fs.readFileSync(path, 'utf8');

// The file exports customersSeed and briefsSeed. We can extract briefsSeed, parse it, update it, and write it back.
// Since it's valid JS/JSON, we can dynamically import it to get the object, but we need to rewrite the file text.
// Let's use a regex approach to update persona strings to arrays, since they are consistently formatted strings.

content = content.replace(/"demographic":\s*"([^"]*)"/g, (match, p1) => `"demographic": ${JSON.stringify(p1 ? p1.split(',').map(s => s.trim()) : [])}`);
content = content.replace(/"location":\s*"([^"]*)"/g, (match, p1) => `"location": ${JSON.stringify(p1 ? p1.split(',').map(s => s.trim()) : [])}`);
content = content.replace(/"occupation":\s*"([^"]*)"/g, (match, p1) => `"occupation": ${JSON.stringify(p1 ? p1.split(',').map(s => s.trim()) : [])}`);
content = content.replace(/"persona":\s*"([^"]*)"/g, (match, p1) => `"persona": ${JSON.stringify(p1 ? p1.split(',').map(s => s.trim()) : [])}`);
content = content.replace(/"contentCategory":\s*"([^"]*)"/g, (match, p1) => `"contentCategory": ${JSON.stringify(p1 ? p1.split(',').map(s => s.trim()) : [])}`);
content = content.replace(/"storyTelling":\s*"([^"]*)"/g, (match, p1) => `"storyTelling": ${JSON.stringify(p1 ? p1.split(',').map(s => s.trim()) : [])}`);

// Now we need to inject referenceInfluencers into influencerDetails objects
// An influencerDetails block looks like:
// "influencerDetails": [
//   {
//     "id": "...",
//     ...
//     "persona": { ... }
//   }
// ]

const refStr = `
                "referenceInfluencers": [
                  {
                    "id": 1,
                    "username": "@jane_doe",
                    "platform": "Instagram",
                    "profileUrl": "https://instagram.com/jane_doe",
                    "followers": "120K",
                    "engagement": "3.2%",
                    "category": ["Beauty", "Lifestyle"],
                    "persona": ["Trendy"],
                    "avatar": "https://i.pravatar.cc/150?u=1"
                  },
                  {
                    "id": 2,
                    "username": "@john_smith",
                    "platform": "TikTok",
                    "profileUrl": "https://tiktok.com/@john_smith",
                    "followers": "45K",
                    "engagement": "4.5%",
                    "category": ["Tech"],
                    "persona": ["Geek"],
                    "avatar": "https://i.pravatar.cc/150?u=2"
                  }
                ]
`;

// we can find the end of persona object inside influencerDetails and append referenceInfluencers
// This regex finds the end of the persona block inside influencerDetails
content = content.replace(/("persona":\s*{[^}]*})\n\s*}/g, `$1,\n${refStr}\n              }`);

fs.writeFileSync(path, content, 'utf8');
console.log("Mock data updated successfully");
