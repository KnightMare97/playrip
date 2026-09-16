# Personal Music Library (Cloudflare + Oracle Always Free + Telegram)

A private, self-hosted, non-commercial music library and automated acquisition system designed to run 24/7 at **$0/month recurring cost**.

---

## 🏗️ System Architecture

```
                  ┌─────────────────────────────────────────┐
                  │                 CLIENTS                 │
                  │   [React 19 Web App]   [Telegram Bot]   │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                   ┌───────────────────────────────────────┐
                   │          CLOUDFLARE WORKERS           │
                   │           (API Controller)            │
                   └───────┬───────────────┬───────┬───────┘
                           │               │       │
             ┌─────────────┴─────┐   ┌─────┴─────┐ │
             ▼                   ▼   ▼           ▼ ▼
      [Cloudflare D1]     [Cloudflare R2]   [MusicBrainz]
      (SQLite Database)   (10 GB Storage)   (Free Catalog)
                                 ▲
                                 │ Direct S3 Upload
                                 │
                   ┌─────────────┴─────────────────────────┐
                   │    ORACLE CLOUD ALWAYS FREE (ARM)     │
                   │        (Inbound-Free Pull Daemon)     │
                   │   yt-dlp • ffmpeg • ID3 Tag & Art     │
                   └───────────────────────────────────────┘
```

---

## 🔑 What You Need (Checklist)

| Provider | Requirement | Where to get it |
| :--- | :--- | :--- |
| **Telegram** | `TELEGRAM_BOT_TOKEN` | Chat with [@BotFather](https://t.me/BotFather) on Telegram (`/newbot`) |
| **Cloudflare** | Free Account | [cloudflare.com](https://dash.cloudflare.com) |
| **Cloudflare** | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard (Sidebar) |
| **Cloudflare** | `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard &rarr; My Profile &rarr; API Tokens |
| **Cloudflare** | `R2_ACCESS_KEY_ID` & `SECRET` | Cloudflare Dashboard &rarr; R2 &rarr; Manage R2 API Tokens |
| **Oracle Cloud** | Always Free VM (Ampere A1) | [cloud.oracle.com](https://cloud.oracle.com) (4 OCPU / 24GB RAM free pool) |
| **Security** | `PROCESSOR_SECRET_TOKEN` | Any secure 32-character string you invent |

---

## 🚀 Step-by-Step Setup Guide

### 1. Exporting to GitHub
In **Google AI Studio**:
1. Click the **Project Settings** menu in the top-right corner.
2. Select **"Export to GitHub"** (or download the ZIP and push to your GitHub repo).

---

### 2. Cloudflare Setup (Workers, D1, R2)

1. Clone your exported repository and install dependencies:
   ```bash
   npm install
   ```

2. Login to Cloudflare via Wrangler:
   ```bash
   npx wrangler login
   ```

3. Create your Cloudflare D1 database:
   ```bash
   npx wrangler d1 create music-library-db
   ```
   *Copy the generated `database_id` into `wrangler.toml` under `database_id`.*

4. Initialize the database schema:
   ```bash
   npx wrangler d1 execute music-library-db --file=./schema.sql
   ```

5. Create your Cloudflare R2 bucket:
   ```bash
   npx wrangler r2 bucket create personal-music-library
   ```

6. Store your secrets in Cloudflare Workers:
   ```bash
   npx wrangler secret put TELEGRAM_BOT_TOKEN
   npx wrangler secret put PROCESSOR_SECRET_TOKEN
   npx wrangler secret put WEB_ADMIN_PASSWORD
   ```

7. Build & Deploy the frontend and Worker:
   ```bash
   npm run build
   npx wrangler deploy
   ```
   *Note your deployment URL (e.g. `https://personal-music-library.<your-subdomain>.workers.dev`).*

---

### 3. Oracle Always Free VM (Processor Daemon)

1. Create a free instance in Oracle Cloud:
   - Image: **Ubuntu 22.04 LTS**
   - Shape: **VM.Standard.A1.Flex** (Ampere ARM, 2 to 4 OCPUs, 12GB+ RAM).
   - No open inbound ports required!

2. SSH into your Oracle VM and install audio dependencies:
   ```bash
   sudo apt update && sudo apt install -y python3-pip python3-venv ffmpeg
   ```

3. Setup the processor directory:
   ```bash
   mkdir -p ~/music-processor && cd ~/music-processor
   ```
   Copy `processor/worker.py`, `processor/requirements.txt`, and `processor/music-processor.service` here.

4. Install Python dependencies:
   ```bash
   pip3 install -r requirements.txt
   ```

5. Create `~/music-processor/.env`:
   ```env
   WORKER_API_URL="https://personal-music-library.<your-subdomain>.workers.dev"
   PROCESSOR_SECRET_TOKEN="your_secure_32_char_secret_token"
   NODE_ID="oracle-ampere-01"

   R2_ENDPOINT_URL="https://<your_account_id>.r2.cloudflarestorage.com"
   R2_ACCESS_KEY_ID="your_r2_access_key_id"
   R2_SECRET_ACCESS_KEY="your_r2_secret_access_key"
   R2_BUCKET_NAME="personal-music-library"
   ```

6. Enable the systemd service (so it runs automatically 24/7):
   ```bash
   sudo cp music-processor.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable --now music-processor
   ```

7. Check service status:
   ```bash
   sudo systemctl status music-processor
   ```

---

### 4. Link Your Telegram Bot

1. Open your web app URL.
2. Go to **Settings** &rarr; copy the 6-digit one-time code (e.g. `849201`).
3. In Telegram, open your bot and send:
   ```text
   /link 849201
   ```
4. Your Telegram account is now connected! You can now search, browse artists, queue batch downloads, and receive ZIP packages directly in Telegram.
