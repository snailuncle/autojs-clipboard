# 本仓库主要为了, 方便手机和电脑剪贴板, 在局域网同步

## 同步原理
1. 手机autojs运行`mobile.js`, 监听到剪贴板变化, 就发送http请求
2. 在vscode中, 按 ctrl + shift + p, 输入`clip`, 点击`autojs: Clipboard synchronization 剪贴板同步`, 开启服务
3. 服务开启后, vscode会监听7101端口的请求, 并提取get请求中的clipboard的值
4. 用clipboardy设置剪贴板内容

# 牙叔出品, mobile.js用抠脚代码改的.