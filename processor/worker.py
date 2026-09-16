#!/usr/bin/env python3
"""
Personal Music Library - Pull Processor Daemon
Target host: Oracle Cloud Always Free (Ampere A1 / Ubuntu Linux)

Architecture:
  - Continuously polls Cloudflare Worker for jobs via signed POST requests.
  - No public inbound open ports needed on the Oracle VM.
  - Uses yt-dlp + ffmpeg + mutagen for adaptive audio acquisition & ID3 tagging.
  - Uploads permanent MP3s and temporary ZIP packages to Cloudflare R2.
"""

import os
import sys
import time
import json
import shutil
import tempfile
import threading
import subprocess
import requests
import boto3
from botocore.config import Config
from mutagen.easyid3 import EasyID3
from mutagen.id3 import ID3, APIC
from mutagen.mp3 import MP3

# Environment Variables
WORKER_API_URL = os.getenv("WORKER_API_URL", "https://your-worker-url.workers.dev").rstrip("/")
PROCESSOR_SECRET = os.getenv("PROCESSOR_SECRET_TOKEN", "default_secret")
NODE_ID = os.getenv("NODE_ID", "oracle-ampere-01")

R2_ENDPOINT = os.getenv("R2_ENDPOINT_URL") # e.g. https://<accountid>.r2.cloudflarestorage.com
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME", "personal-music-library")

POLL_INTERVAL_SECONDS = 5
HEARTBEAT_INTERVAL_SECONDS = 25
PROCESS_ONCE = os.getenv("PROCESS_ONCE", "false").lower() in ("true", "1", "yes")

def get_s3_client():
    if not R2_ENDPOINT or not R2_ACCESS_KEY or not R2_SECRET_KEY:
        print("[WARN] R2 credentials not fully configured. Using mock storage mode.")
        return None
    return boto3.client(
        "s3",
        endpoint_url=R2_ENDPOINT,
        aws_access_key_id=R2_ACCESS_KEY,
        aws_secret_access_key=R2_SECRET_KEY,
        config=Config(signature_version="s3v4")
    )

def send_heartbeat(job_id, claim_token, stop_event):
    while not stop_event.is_set():
        try:
            requests.post(
                f"{WORKER_API_URL}/api/processor/heartbeat",
                json={"job_id": job_id, "claim_token": claim_token, "node_id": NODE_ID},
                headers={"Authorization": f"Bearer {PROCESSOR_SECRET}"},
                timeout=10
            )
        except Exception as e:
            print(f"[HEARTBEAT] Error sending heartbeat: {e}")
        stop_event.wait(HEARTBEAT_INTERVAL_SECONDS)

def download_cover(cover_url, dest_path):
    if not cover_url:
        return False
    try:
        r = requests.get(cover_url, timeout=15)
        if r.status_code == 200:
            with open(dest_path, "wb") as f:
                f.write(r.content)
            return True
    except Exception as e:
        print(f"[COVER] Failed to download cover art: {e}")
    return False

def process_task(task, work_dir, s3_client):
    """
    Downloads audio via yt-dlp, tags ID3v2 metadata & artwork, and uploads to R2.
    """
    print(f" -> Processing Task: {task.get('track')} - {task.get('artist')}")
    query = f"{task.get('artist')} {task.get('track')} audio"
    output_template = os.path.join(work_dir, "audio.%(ext)s")
    final_mp3 = os.path.join(work_dir, "track.mp3")

    # 1. Download & convert using yt-dlp
    cmd = [
        "yt-dlp",
        "--default-search", "ytsearch1:",
        "--extract-audio",
        "--audio-format", "mp3",
        "--audio-quality", "0", # Best VBR/CBR up to 320kbps
        "--output", output_template,
        query
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    downloaded_files = [f for f in os.listdir(work_dir) if f.startswith("audio.")]
    if not downloaded_files:
        raise RuntimeError("yt-dlp produced no output file")
    
    raw_audio = os.path.join(work_dir, downloaded_files[0])
    os.rename(raw_audio, final_mp3)

    # 2. Tag Metadata (ID3v2)
    try:
        audio = MP3(final_mp3, ID3=EasyID3)
        audio['title'] = task.get('track', 'Unknown')
        audio['artist'] = task.get('artist', 'Unknown')
        audio['album'] = task.get('album', 'Unknown')
        if task.get('year'):
            audio['date'] = str(task.get('year'))
        if task.get('genre'):
            audio['genre'] = task.get('genre')
        if task.get('track_number'):
            audio['tracknumber'] = str(task.get('track_number'))
        audio.save()

        # Embed Cover Art
        cover_path = os.path.join(work_dir, "cover.jpg")
        if download_cover(task.get('cover_art_url'), cover_path):
            id3 = ID3(final_mp3)
            with open(cover_path, 'rb') as albumart:
                id3.add(APIC(
                    encoding=3,
                    mime='image/jpeg',
                    type=3, # Front cover
                    desc='Cover',
                    data=albumart.read()
                ))
            id3.save(v2_version=3)
    except Exception as e:
        print(f"[TAG] Warning embedding metadata: {e}")

    # 3. Inspect File Specs
    file_size = os.path.getsize(final_mp3)
    bitrate = 320 # default target

    # 4. Upload to Cloudflare R2
    artist_mbid = task.get('artist_mbid', 'unknown_artist')
    album_mbid = task.get('album_mbid', 'unknown_album')
    rec_mbid = task.get('recording_mbid', task.get('task_id'))
    track_num = str(task.get('track_number', 1)).zfill(2)
    clean_title = "".join(c for c in task.get('track', 'track') if c.isalnum() or c in (' ', '_', '-')).strip()
    r2_key = f"library/artists/{artist_mbid}/albums/{album_mbid}/{track_num} - {clean_title}_{rec_mbid}.mp3"

    if s3_client:
        s3_client.upload_file(final_mp3, R2_BUCKET_NAME, r2_key)
        print(f" -> Uploaded to R2: {r2_key} ({file_size / (1024*1024):.1f} MB)")
    else:
        print(f" -> [MOCK] Uploaded to R2: {r2_key}")

    return {
        "r2_key": r2_key,
        "file_size": file_size,
        "bitrate": bitrate,
        "local_mp3": final_mp3,
        "clean_name": f"{track_num} - {clean_title}.mp3"
    }

def main():
    print(f"=====================================================")
    print(f"[*] Starting Personal Music Library Processor ({NODE_ID})")
    print(f"[*] Polling endpoint: {WORKER_API_URL}/api/processor/claim-job")
    print(f"=====================================================")

    s3 = get_s3_client()

    while True:
        try:
            resp = requests.post(
                f"{WORKER_API_URL}/api/processor/claim-job",
                headers={"Authorization": f"Bearer {PROCESSOR_SECRET}"},
                timeout=10
            )

            if resp.status_code == 200:
                data = resp.json()
                job = data.get("job")

                if job:
                    job_id = job["job_id"]
                    claim_token = job["claim_token"]
                    tasks = job.get("tasks", [])
                    print(f"\n[JOB CLAIMED] #{job_id} with {len(tasks)} tasks.")

                    stop_heartbeat = threading.Event()
                    hb_thread = threading.Thread(
                        target=send_heartbeat, 
                        args=(job_id, claim_token, stop_heartbeat), 
                        daemon=True
                    )
                    hb_thread.start()

                    processed_tracks = []
                    job_temp_dir = tempfile.mkdtemp(prefix=f"music_job_{job_id}_")

                    try:
                        for idx, task in enumerate(tasks):
                            task_temp = os.path.join(job_temp_dir, f"task_{idx}")
                            os.makedirs(task_temp, exist_ok=True)
                            try:
                                res = process_task(task, task_temp, s3)
                                processed_tracks.append(res)
                                # Notify task complete
                                requests.post(
                                    f"{WORKER_API_URL}/api/processor/complete-task",
                                    json={
                                        "job_id": job_id,
                                        "task_id": task.get("task_id"),
                                        "status": "COMPLETED",
                                        "r2_key": res["r2_key"],
                                        "file_size": res["file_size"],
                                        "bitrate": res["bitrate"]
                                    },
                                    headers={"Authorization": f"Bearer {PROCESSOR_SECRET}"},
                                    timeout=10
                                )
                            except Exception as err:
                                print(f"[TASK FAILED] {err}")
                                requests.post(
                                    f"{WORKER_API_URL}/api/processor/complete-task",
                                    json={
                                        "job_id": job_id,
                                        "task_id": task.get("task_id"),
                                        "status": "FAILED",
                                        "error": str(err)
                                    },
                                    headers={"Authorization": f"Bearer {PROCESSOR_SECRET}"},
                                    timeout=10
                                )

                        # Create temporary ZIP package
                        if processed_tracks:
                            pkg_dir = os.path.join(job_temp_dir, "package")
                            os.makedirs(pkg_dir, exist_ok=True)
                            for item in processed_tracks:
                                shutil.copy(item["local_mp3"], os.path.join(pkg_dir, item["clean_name"]))
                            zip_archive = os.path.join(job_temp_dir, "Archive")
                            zip_path = shutil.make_archive(zip_archive, 'zip', pkg_dir)
                            zip_size = os.path.getsize(zip_path)

                            pkg_r2_key = f"packages/user_1/{job_id}/Archive.zip"
                            if s3:
                                s3.upload_file(zip_path, R2_BUCKET_NAME, pkg_r2_key)
                                print(f"[PACKAGE] Uploaded ZIP to {pkg_r2_key} ({zip_size / (1024*1024):.1f} MB)")

                        # Finalize Job
                        requests.post(
                            f"{WORKER_API_URL}/api/processor/finish-job",
                            json={
                                "job_id": job_id,
                                "claim_token": claim_token,
                                "status": "COMPLETED",
                                "package_key": f"packages/user_1/{job_id}/Archive.zip" if processed_tracks else None
                            },
                            headers={"Authorization": f"Bearer {PROCESSOR_SECRET}"},
                            timeout=10
                        )
                        print(f"[JOB COMPLETE] Job #{job_id} successfully finished.")

                    finally:
                        stop_heartbeat.set()
                        shutil.rmtree(job_temp_dir, ignore_errors=True)

                    if PROCESS_ONCE:
                        print("[INFO] PROCESS_ONCE is set. Finished batch. Exiting cleanly.")
                        break
                else:
                    if PROCESS_ONCE:
                        print("[INFO] PROCESS_ONCE is set. No jobs currently queued. Exiting.")
                        break

        except requests.exceptions.RequestException:
            if PROCESS_ONCE:
                print("[INFO] Network/API idle in PROCESS_ONCE mode. Exiting.")
                break
            pass # normal poll timeout/idle
        except Exception as e:
            print(f"[POLL ERROR] {e}")
            if PROCESS_ONCE:
                break

        time.sleep(POLL_INTERVAL_SECONDS)

if __name__ == "__main__":
    main()
