import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import chalk from 'chalk';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/auth', function (req, res) {
  const { code } = req.body;

  const data = {
    client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
    client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
    code: code,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  };

  fetch('https://github.com/login/oauth/access_token', options)
    .then(response => response.json())
    .then(response => {
      const access_token = response.access_token;
      return fetch(`https://api.github.com/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
    })
    .then(response => response.json())
    .then(response => {
      return res.status(200).json(response);
    })
    .catch(error => {
      return res.status(400).json(error);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    chalk.blue(`🔥  ghAuthServer listening on http://localhost:${PORT}/auth`)
  )
);
