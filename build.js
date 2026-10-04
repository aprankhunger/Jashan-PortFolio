const fs = require('fs');

const imageExts = /\.(png|jpg|jpeg|webp|gif|svg)$/i;
const videoExts = /\.(mp4|mov|webm|mkv)$/i;

const thumbnails = fs.existsSync('./thumbnails')
    ? fs.readdirSync('./thumbnails').filter(f => imageExts.test(f))
    : [];

const videos = fs.existsSync('./videos')
    ? fs.readdirSync('./videos').filter(f => videoExts.test(f))
    : [];

fs.writeFileSync('./manifest.json', JSON.stringify({ thumbnails, videos }));
console.log(`✓ manifest.json → ${thumbnails.length} thumbnails, ${videos.length} videos`);
