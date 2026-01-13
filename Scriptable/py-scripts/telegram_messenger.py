# /home/Takagivegeta/py-scripts/telegram_messenger.py
import requests

def send_telegram_msg(message):
    token = ""
    chat_id = ""
    
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id, 
        "text": message,
        "parse_mode": "HTML"
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        return response.status_code == 200
    except Exception as e:
        print(f"Telegram 推送失败: {e}")
        return False