const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const crypto = require('crypto');
const router = express.Router();
require('dotenv').config();

// Load and decrypt token
const publicDir = path.join(__dirname, '..', '..');
const encB64 = fs.readFileSync(path.join(publicDir, 'token.enc.b64'));
const encrypted = Buffer.from(encB64.toString(), 'base64');
const privateKey = fs.readFileSync(path.join(publicDir, 'private_key.pem'), 'utf8');
const decrypted = crypto.privateDecrypt(
  { key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
  encrypted
);
const token = decrypted.toString('utf8');
const API_BASE = `https://api.github.com/repos/${process.env.GITHUB_REPO}/issues`;

router.get('/', async (req, res) => {
  const response = await fetch(API_BASE, {
    headers: { Authorization: `token ${token}`, Accept:'application/vnd.github.v3+json' }
  });
  const issues = await response.json();
  res.json(issues);
});

router.post('/', async (req, res) => {
  const response = await fetch(API_BASE, {
    method:'POST',
    headers:{
      Authorization: `token ${token}`,
      'Content-Type':'application/json',
      Accept:'application/vnd.github.v3+json'
    },
    body: JSON.stringify({ title: req.body.title, body: req.body.body })
  });
  const issue = await response.json();
  res.json(issue);
});

module.exports = router;