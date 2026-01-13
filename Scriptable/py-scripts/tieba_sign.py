# /home/Takagivegeta/py-scripts/tieba_sign.py
import logging
import requests
import hashlib
import time
from dataclasses import dataclass
from typing import List

# 禁用 requests 的一些琐碎日志，保持输出整洁
logging.getLogger("requests").setLevel(logging.WARNING)

@dataclass
class ForumInfo:
    forum_id: int
    forum_name: str

class Tieba:
    def __init__(self, bduss: str) -> None:
        self.bduss = bduss
        self.logger = logging.getLogger("Tieba")

    @property
    def session(self) -> requests.Session:
        if not getattr(self, "_session", None):
            self._session = requests.Session()
            self._session.headers.update({
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Cookie": f"BDUSS={self.bduss}"
            })
        return self._session

    @property
    def tbs(self) -> str:
        if getattr(self, "_tbs", None): return self._tbs
        resp = self.session.get("http://tieba.baidu.com/dc/common/tbs")
        self._tbs = resp.json().get("tbs", "")
        return self._tbs

    @classmethod
    def signature(cls, data) -> str:
        val = "".join(f"{k}={data[k]}" for k in sorted(data))
        return hashlib.md5((val + "tiebaclient!!!").encode()).hexdigest().upper()

    def get_likes(self, page_no: int):
        data = {
            "BDUSS": self.bduss, "_client_type": "2", "_client_version": "9.7.8.0",
            "page_no": str(page_no), "page_size": "200", "timestamp": str(int(time.time())),
        }
        data["sign"] = self.signature(data)
        resp = self.session.post("http://c.tieba.baidu.com/c/f/forum/like", data=data)
        resp_json = resp.json()
        forum_list = resp_json.get("forum_list", {}).get("non-gconforum", [])
        forum_list += resp_json.get("forum_list", {}).get("gconforum", [])
        if resp_json.get("has_more") == "1":
            forum_list += self.get_likes(page_no + 1)
        return forum_list

    def sign(self, fid: str, name: str) -> bool:
        data = {
            "BDUSS": self.bduss, "fid": fid, "kw": name, "tbs": self.tbs,
            "_client_type": "2", "_client_version": "9.7.8.0", "timestamp": str(int(time.time())),
        }
        data["sign"] = self.signature(data)
        resp = self.session.post("http://c.tieba.baidu.com/c/c/forum/sign", data=data)
        return resp.json().get("error_code") == "0" or resp.json().get("error_msg") == "success"

def main_task():
    # 你的 BDUSS
    bduss = ""
    cli = Tieba(bduss)
    
    try:
        forums = cli.get_likes(1)
        n_succeed, n_fail = 0, 0
        for forum in forums:
            if cli.sign(forum["id"], forum["name"]):
                n_succeed += 1
            else:
                n_fail += 1
        return f"<b>百度贴吧</b>\n成功: {n_succeed} | 失败: {n_fail}"
    except Exception as e:
        return f"<b>百度贴吧</b>\n发生异常: {str(e)}"
        
        
if __name__ == "__main__":
    print(main_task())