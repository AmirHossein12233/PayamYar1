
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI(title="PayamYar Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

connections = {}

@app.get("/")
def home():
    return {"app": "PayamYar", "status": "online"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/users")
def users():
    return {"users": list(connections.keys())}

@app.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    username = username.strip()[:24]
    if not username:
        await websocket.close(code=1008)
        return

    await websocket.accept()

    # از اتصال هم‌زمان چند نشست با یک نام جلوگیری می‌کنیم.
    old = connections.get(username)
    connections[username] = websocket

    if old and old is not websocket:
        try:
            await old.close(code=4001, reason="Logged in elsewhere")
        except Exception:
            pass

    try:
        await broadcast_users()

        while True:
            raw = await websocket.receive_text()
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                continue

            target = str(data.get("to", "")).strip()[:24]
            message = str(data.get("message", "")).strip()[:2000]

            if not target or not message:
                continue

            receiver = connections.get(target)
            if receiver:
                await receiver.send_json({
                    "type": "message",
                    "from": username,
                    "message": message
                })
            else:
                await websocket.send_json({
                    "type": "error",
                    "message": "کاربر مقصد آنلاین نیست."
                })

    except WebSocketDisconnect:
        pass
    finally:
        if connections.get(username) is websocket:
            del connections[username]
            await broadcast_users()

async def broadcast_users():
    data = {"type": "users", "users": list(connections.keys())}
    for ws in list(connections.values()):
        try:
            await ws.send_json(data)
        except Exception:
            pass
