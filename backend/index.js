const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-creator-node');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate-pdf', (req, res) => {
    const html = fs.readFileSync(path.join(__dirname, 'templates', 'temp.html'), 'utf8');
    const document = {
        html: html,
        data: { name: req.body.name },
        path: './output.pdf',
        type: '',
    };

    const options = {
        format: 'A4',
        orientation: 'landscape', 
        printBackground: true, 
        scale: 0.8, 
        printMediaType: true, 
        dpi: 300, 
    };

    pdf.create(document, options)
        .then(result => {
            res.setHeader('Content-Type', 'application/pdf');
            res.sendFile(path.resolve(result.filename));
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error generating PDF');
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

