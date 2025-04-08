const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const fs = require('fs');
const path = require('path');
app.get('/', (req, res) => {
    const dataPath = path.join(__dirname, 'images.json');
    const images = JSON.parse(fs.readFileSync(dataPath));
    res.render('slike', { images });
});
app.get('/slike', (req, res) => {
    const folderPath = path.join(__dirname, 'public', 'images');
    const files = fs.readdirSync(folderPath);

    const images = files
        .filter(file => file.endsWith('.jpg') || file.endsWith('.svg'))
        .map((file, index) => ({
            url: `/images/${file}`,
            id: `slika${index + 1}`,
            title: `Slika ${index + 1}`
        }));

    res.render('slike', { images });
});

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.send('Pozdrav sa Railway servera!');
});
app.listen(PORT, () => {
    console.log('Server pokrenut na portu ${PORT}');
});
