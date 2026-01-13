# /home/Takagivegeta/py-scripts/xiaohaios_sign.py
import requests
import re
import time
from datetime import datetime

# --- 配置区 ---
USERNAME = ""
PASSWORD = ""
BASE_URL = "https://www.xiaohaios.com"

class XiaoHaiOS:
    def __init__(self):
        self.session = requests.Session()
        self.ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        self.session.headers.update({"User-Agent": self.ua})

    def extract_vs(self, html):
        """提取 ASP.NET 的必要表单参数"""
        vs = re.search(r'name="__VIEWSTATE" id="__VIEWSTATE" value="(.*?)"', html)
        vg = re.search(r'name="__VIEWSTATEGENERATOR" id="__VIEWSTATEGENERATOR" value="(.*?)"', html)
        return (vs.group(1) if vs else "", vg.group(1) if vg else "")

    def check_status(self):
        """检查今日签到状态"""
        url = f"{BASE_URL}/ashx/Honor.ashx"
        data = {
            "control": "list",
            "nowmonth": datetime.now().month
        }
        headers = {
            "X-Requested-With": "XMLHttpRequest",
            "Referer": f"{BASE_URL}/aspx3/mobile/qiandao.aspx"
        }
        try:
            resp = self.session.post(url, data=data, headers=headers).json()
            if resp.get("signedToday") == "True":
                return True, resp.get("continuousDays", 0)
            return False, 0
        except:
            return False, 0

    def login(self):
        """登录流程"""
        login_page_url = f"{BASE_URL}/aspx3/mobile/login.aspx?action=index&t="
        # 1. 获取登录页提取初始参数
        r = self.session.get(login_page_url)
        vs, vg = self.extract_vs(r.text)
        
        # 2. 提交登录
        data = {
            "__EVENTTARGET": "btnLogin",
            "__EVENTARGUMENT": "",
            "__VIEWSTATE": vs,
            "__VIEWSTATEGENERATOR": vg,
            "txtUser_sign_in": USERNAME,
            "txtPwd_sign_in": PASSWORD,
            "save_pass": ""
        }
        self.session.post(login_page_url, data=data, headers={"Referer": login_page_url})

    def run_sign(self):
        """执行签到动作"""
        qd_url = f"{BASE_URL}/aspx3/mobile/qiandao.aspx"
        
        # 1. 登录
        self.login()
        
        # 2. 检查是否已签到
        already_signed, days = self.check_status()
        if already_signed:
            return f"<b>小小哈士奇</b>\n状态：今日已完成\n连续签到：{days}天"

        # 3. 获取签到页参数并执行
        r = self.session.get(qd_url)
        vs, vg = self.extract_vs(r.text)
        
        sign_data = {
            "__EVENTTARGET": "_lbtqd",
            "__EVENTARGUMENT": "",
            "__VIEWSTATE": vs,
            "__VIEWSTATEGENERATOR": vg
        }
        self.session.post(qd_url, data=sign_data, headers={"Referer": qd_url})

        # 4. 循环验证结果 (最多5次)
        for i in range(5):
            time.sleep(4)
            success, days = self.check_status()
            if success:
                return f"<b>小小哈士奇</b>\n状态：签到成功 🎉\n连续签到：{days}天"
        
        return "<b>小小哈士奇</b>\n状态：签到可能失败，请手动检查"

def main_task():
    client = XiaoHaiOS()
    return client.run_sign()

if __name__ == "__main__":
    print(main_task())