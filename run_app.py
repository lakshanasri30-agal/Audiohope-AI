import subprocess
import sys
import time
import os

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

print("==================================================================")
print("Starting AudioHope AI Full-Stack Unified Platform")
print("==================================================================")
print("1. Launching Python FastAPI Backend Server on http://127.0.0.1:8000...")
print("2. Launching Next.js App Router Frontend on http://localhost:3000...")
print("------------------------------------------------------------------")

try:
    # 1. Start FastAPI Backend Process
    backend_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )

    # 2. Start Next.js Frontend Process
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_process = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )

    print("AudioHope AI Full-Stack Website is now running live!")
    print("Access Website: http://localhost:3000")
    print("Access API Docs: http://127.0.0.1:8000/docs")
    print("==================================================================")

    while True:
        time.sleep(1)

except KeyboardInterrupt:
    print("\nStopping AudioHope AI Full-Stack servers...")
    backend_process.terminate()
    frontend_process.terminate()
    sys.exit(0)
