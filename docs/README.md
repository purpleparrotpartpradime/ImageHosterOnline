# ImageHoster.Land (Secure with RSA)

This version encrypts your GitHub PAT using RSA.  
- `public_key.pem`: use to encrypt your PAT.  
- `token.enc.b64`: contains your encrypted PAT (base64).  
- `private_key.pem`: used at runtime to decrypt `token.enc.b64`.  

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and set:
   ```
   GITHUB_REPO=your_username/your_repo
   PORT=4000
   ```
3. Run the server:
   ```
   npm start
   ```
