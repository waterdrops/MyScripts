# /home/Takagivegeta/py-scripts/yuchengyouxi_sign.py
import requests
import re
import logging

class YuCheng:
    def __init__(self):
        self.base_url = "https://yc.yuchengyouxi.com"
        self.ajax_url = f"{self.base_url}/wp-admin/admin-ajax.php"
        self.session = requests.Session()
        self.ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"
        self.session.headers.update({"User-Agent": self.ua})

    def get_token(self):
        """从登录页面提取 token"""
        r = self.session.get(f"{self.base_url}/login")
        token_match = re.search(r'name=["\']token["\']\s+value=["\']([a-f0-9]{10})["\']', r.text, re.I)
        return token_match.group(1) if token_match else None

    def run(self):
        try:
            # 1. 获取 Token
            token = self.get_token()
            if not token:
                return "<b>雨晨分享站</b>\n状态：失败 (未找到Token)"

            # 2. 登录
            login_data = {
                "user_login": "",
                "password": "",
                "rememberme": "1",
                "redirect": f"{self.base_url}/?unpf=1",
                "action": "userlogin_form",
                "token": token
            }
            login_res = self.session.post(self.ajax_url, data=login_data, headers={"X-Requested-With": "XMLHttpRequest"}).json()
            
            # 3. 签到
            sign_data = {"action": "daily_sign"}
            # 模拟原脚本中的 Referer
            headers = {
                "X-Requested-With": "XMLHttpRequest",
                "Referer": f"{self.base_url}/login?r=https%3A%2F%2Fyc.yuchengyouxi.com%2Fusers%3Ftab%3Dmembership%26unpf%3D1"
            }
            sign_res = self.session.post(self.ajax_url, data=sign_data, headers=headers).json()
            
            msg = sign_res.get("msg", "未知结果")
            if sign_res.get("success") == "success":
                return f"<b>雨晨分享站</b>\n状态：签到成功 🎉\n详情：{msg}"
            else:
                return f"<b>雨晨分享站</b>\n状态：提示\n详情：{msg}"

        except Exception as e:
            return f"<b>雨晨分享站</b>\n状态：脚本异常\n详情：{str(e)}"

def main_task():
    client = YuCheng()
    return client.run()

if __name__ == "__main__":
    print(main_task())