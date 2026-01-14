# /home/Takagivegeta/py-scripts/main.py
import sys
import os

# 确保能导入当前目录下的模块
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from telegram_messenger import send_telegram_msg
import tieba_sign
import xiaohaios_sign
import yuchengyouxi_sign
import mmios_sign
import bubei_sign

def run_all_tasks():
    results = []

    # 任务列表：(任务名称, 函数名)
    tasks = [
        ("百度贴吧", tieba_sign.main_task),
        ("小小哈士奇", xiaohaios_sign.main_task),
        ("雨晨分享站", yuchengyouxi_sign.main_task),
        ("mmios.net", mmios_sign.main_task),
    ]

    for name, func in tasks:
        print(f"正在执行任务: {name}...")
        try:
            res = func()
            results.append(res)
        except Exception as e:
            results.append(f"<b>{name}</b>\n运行异常: {str(e)}")

    # 汇总报告
    report = "\n" + "─" * 20 + "\n"
    report += "\n\n".join(results)
    final_message = f"📅 <b>今日自动签到汇总报告</b>\n{report}"

    print("正在发送 Telegram 通知...")
    send_telegram_msg(final_message)
    print("所有任务执行完毕。")

if __name__ == "__main__":

    run_all_tasks()
