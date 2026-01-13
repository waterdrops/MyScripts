# /home/Takagivegeta/py-scripts/mmios_sign.py
import requests
import re
import logging

class MMIOS:
    def __init__(self):
        self.base_url = "https://www.mmios.net"
        self.ajax_url = f"{self.base_url}/wp-admin/admin-ajax.php"
        self.session = requests.Session()
        self.ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"
        self.session.headers.update({"User-Agent": self.ua})

    def run(self):
        try:
            # 1. 登录
            login_data = {
                "action": "user_login",
                "username": "",
                "password": "",
                "rememberme": "1"
            }
            login_res = self.session.post(self.ajax_url, data=login_data, headers={"X-Requested-With": "XMLHttpRequest"}).json()
            
            if login_res.get("status") != "1":
                return f"<b>mmios.net</b>\n状态：登录失败\n详情：{login_res.get('msg')}"

            # 2. 获取签到 Nonce
            # 原脚本在 /tuiguang 页面获取 nonce
            page_r = self.session.get(f"{self.base_url}/tuiguang")
            nonce_match = re.search(r'data-nonce\s*=\s*["\']([a-f0-9]{10})["\']', page_r.text, re.I)
            if not nonce_match:
                return "<b>mmios.net</b>\n状态：失败 (未找到Nonce)"
            nonce = nonce_match.group(1)

            # 3. 执行签到
            sign_data = {
                "action": "user_qiandao",
                "nonce": nonce
            }
            sign_res = self.session.post(self.ajax_url, data=sign_data, headers={
                "X-Requested-With": "XMLHttpRequest",
                "Referer": f"{self.base_url}/tuiguang"
            }).json()

            msg = sign_res.get("msg", "未知结果")
            if sign_res.get("status") == "1":
                return f"<b>mmios.net</b>\n状态：签到成功 🎉\n详情：{msg}"
            else:
                return f"<b>mmios.net</b>\n状态：提示\n详情：{msg}"

        except Exception as e:
            return f"<b>mmios.net</b>\n状态：脚本异常\n详情：{str(e)}"

def main_task():
    client = MMIOS()
    return client.run()

if __name__ == "__main__":
    print(main_task())