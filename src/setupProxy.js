const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);

// Create react app proxy

module.exports = app => {
  app.get('/api/data/:number', async (req, res) => {
    try {
      const coordinates = await readJsonData(req.params.number);
      res.send(coordinates);
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.status(404).send({ status: 'Not found' });
      } else {
        res.status(500).send({ status: 'Server error' });
        console.error(`number: ${req.params.number}`, error);
      }
    }
  });
};

function readJsonData(number) {
  return readFileAsync(`${__dirname}/../data/${number}.json`, {
    encoding: 'utf8',
  }).then(contents => JSON.parse(contents));
}
