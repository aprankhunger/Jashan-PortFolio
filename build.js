const fs = require('fs');

const imageExts = /\.(png|jpg|jpeg|webp|gif|svg)$/i;
const videoExts = /\.(mp4|mov|webm|mkv)$/i;

const longForm = fs.existsSync('./Long form')
    ? fs.readdirSync('./Long form').filter(f => videoExts.test(f) || imageExts.test(f))
    : [];

const shortsReels = fs.existsSync('./Shorts-reels')
    ? fs.readdirSync('./Shorts-reels').filter(f => videoExts.test(f) || imageExts.test(f))
    : [];

const graphicDesign = fs.existsSync('./Graphic design')
    ? fs.readdirSync('./Graphic design').filter(f => videoExts.test(f) || imageExts.test(f))
    : [];

fs.writeFileSync('./manifest.json', JSON.stringify({ longForm, shortsReels, graphicDesign }));
console.log(`✓ manifest.json → ${longForm.length} long form, ${shortsReels.length} shorts, ${graphicDesign.length} graphics`);
