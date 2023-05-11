const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8000;
const staticFolderPath = path.join(__dirname, 'dist');

app.use(express.static(staticFolderPath));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(staticFolderPath, 'index.html'));
});

app.listen(port, () => console.log(`Server running on ${port}`));
