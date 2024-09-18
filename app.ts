import express from 'express';
const app = express();

app.get('/', (req, res) => {
  const base64Url = req.query.base64Url;
  if (!base64Url || typeof base64Url !== 'string') {
    res.status(400).send('base64Url query parameter is required');
    return;
  }
  // the base64Url is the image src in base64 format with data:image/[image type];base64, prefix
  // need to remove the prefix to get the base64 string, and also get the image type
  const base64String = base64Url.split(',')[1];
  const imageType = base64Url.split(';')[0].split('/')[1];
  // check imageType is valid
  if (!['png', 'jpeg', 'gif'].includes(imageType)) {
    res.status(400).send('Invalid image type');
    return;
  }

  // check base64 string is valid
  if (!base64String.match(/^[A-Za-z0-9+/]+={0,2}$/)) {
    res.status(400).send('Invalid base64 string');
    return;
  }
  // send the base64 string as actual image which can be displayed in the browser directly without html tag
  // need to send the image header
  res.setHeader('Content-Type', `image/${imageType}`);
  // write the header so that browser can save the image to a file with the imageType extension
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="image.${imageType}"`
  );

  res.send(Buffer.from(base64String, 'base64'));
});

const PORT = import.meta.env.PORT || 3000;

if (import.meta.env.PROD) app.listen(PORT);

export const viteNodeApp = app;
