/**
 * ScripTV - iOS Scriptable 影视聚合
 * @version 0.0.1
 * @author Takagivegeta
 */

// --- 配置常量 ---
const PAGE_SIZE = 20
const THEME_COLOR = new Color("#e50914")

// --- 数据源 ---
const SOURCES = [
    { name: "非凡资源", url: "http://ffzy5.tv/api.php/provide/vod" },
    { name: "卧龙资源", url: "https://wolongzyw.com/api.php/provide/vod" },
    { name: "最大资源", url: "https://api.zuidapi.com/api.php/provide/vod" },
    { name: "百度云资源", url: "https://api.apibdzy.com/api.php/provide/vod" },
    { name: "暴风资源", url: "https://bfzyapi.com/api.php/provide/vod" },
    { name: "极速资源", url: "https://jszyapi.com/api.php/provide/vod" },
    { name: "天涯资源", url: "https://tyyszy.com/api.php/provide/vod" },
    { name: "无尽资源", url: "https://api.wujinapi.com/api.php/provide/vod" },
    { name: "魔都资源", url: "https://www.mdzyapi.com/api.php/provide/vod" },
    { name: "360资源", url: "https://360zy.com/api.php/provide/vod" },
    { name: "电影天堂", url: "http://caiji.dyttzyapi.com/api.php/provide/vod" },
    { name: "如意资源", url: "https://cj.rycjapi.com/api.php/provide/vod" },
    { name: "旺旺资源", url: "https://wwzy.tv/api.php/provide/vod" },
    { name: "红牛资源", url: "https://www.hongniuzy2.com/api.php/provide/vod" },
    { name: "光速资源", url: "https://api.guangsuapi.com/api.php/provide/vod" },
    { name: "iKun资源", url: "https://ikunzyapi.com/api.php/provide/vod" },
    { name: "优酷资源", url: "https://api.ukuapi.com/api.php/provide/vod" },
    { name: "虎牙资源", url: "https://www.huyaapi.com/api.php/provide/vod" },
    { name: "新浪资源", url: "http://api.xinlangapi.com/xinlangapi.php/provide/vod" },
    { name: "乐子资源", url: "https://cj.lziapi.com/api.php/provide/vod" },
    { name: "海豚资源", url: "https://hhzyapi.com/api.php/provide/vod" },
    { name: "鲸鱼资源", url: "https://jyzyapi.com/provide/vod" },
    { name: "1080资源", url: "https://api.1080zyku.com/inc/api_mac10.php" },
    { name: "爱蛋资源", url: "https://lovedan.net/api.php/provide/vod" },
    { name: "乐播资源", url: "https://lbapi9.com/api.php/provide/vod" },
    { name: "魔都影视", url: "https://www.moduzy.com/api.php/provide/vod" },
    { name: "非凡API", url: "https://api.ffzyapi.com/api.php/provide/vod" },
    { name: "非凡采集", url: "http://cj.ffzyapi.com/api.php/provide/vod" },
    { name: "非凡采集HTTPS", url: "https://cj.ffzyapi.com/api.php/provide/vod" },
    { name: "非凡线路1", url: "http://ffzy1.tv/api.php/provide/vod" },
    { name: "卧龙采集", url: "https://collect.wolongzyw.com/api.php/provide/vod" },
    { name: "暴风APP", url: "https://app.bfzyapi.com/api.php/provide/vod" },
    { name: "无尽ME", url: "https://api.wujinapi.me/api.php/provide/vod" },
    { name: "天涯海角", url: "https://tyyszyapi.com/api.php/provide/vod" },
    { name: "光速HTTP", url: "http://api.guangsuapi.com/api.php/provide/vod" },
    { name: "新浪HTTPS", url: "https://api.xinlangapi.com/xinlangapi.php/provide/vod" },
    { name: "1080JSON", url: "https://api.1080zyku.com/inc/apijson.php" },
    { name: "乐子HTTP", url: "http://cj.lziapi.com/api.php/provide/vod" },
    // 下列敏感资源已去除
    // { name: "CK", url: "https://www.ckzy1.com/api.php/provide/vod" },
    // { name: "jkun", url: "https://jkunzyapi.com/api.php/provide/vod" },
    // { name: "155", url: "https://155api.com/api.php/provide/vod" },
    // { name: "lsb", url: "https://apilsbzy1.com/api.php/provide/vod" },
    // { name: "黄色仓库", url: "https://hsckzy.vip/api.php/provide/vod" },
    // { name: "玉兔", url: "https://yutuzy10.com/api.php/provide/vod" },
    // { name: "美少女资源站", url: "https://www.msnii.com/api/json.php" },
    // { name: "淫水机资源站", url: "https://www.xrbsp.com/api/json.php" },
    // { name: "香奶儿资源站", url: "https://www.gdlsp.com/api/json.php" },
    // { name: "白嫖资源站", url: "https://www.kxgav.com/api/json.php" },
    // { name: "小湿妹资源站", url: "https://www.afasu.com/api/json.php" },
    // { name: "黄AV资源站", url: "https://www.pgxdy.com/api/json.php" }
]

// --- Store 模块 (持久化) ---
const Store = {
    KEY_SOURCE_INDEX: "ScripTV_Source_Index",
    FAVORITES_FILE: "ScripTV_Favorites.json",

    // --- 默认源管理 ---
    getCurrentSourceIndex() {
        if (Keychain.contains(this.KEY_SOURCE_INDEX)) {
            const idx = parseInt(Keychain.get(this.KEY_SOURCE_INDEX))
            return isNaN(idx) ? 0 : idx
        }
        return 0
    },

    setCurrentSourceIndex(index) {
        Keychain.set(this.KEY_SOURCE_INDEX, index.toString())
    },

    getCurrentSource() {
        const idx = this.getCurrentSourceIndex()
        return SOURCES[idx] || SOURCES[0]
    },

    // --- 收藏管理 ---
    getFavoritesPath() {
        const fm = FileManager.local()
        return fm.joinPath(fm.documentsDirectory(), this.FAVORITES_FILE)
    },

    getFavorites() {
        const fm = FileManager.local()
        const path = this.getFavoritesPath()
        if (!fm.fileExists(path)) return []
        try {
            const content = fm.readString(path)
            return JSON.parse(content)
        } catch (e) {
            return []
        }
    },

    saveFavorites(favorites) {
        const fm = FileManager.local()
        const path = this.getFavoritesPath()
        try {
            const content = JSON.stringify(favorites, null, 2)
            fm.writeString(path, content)
            return true
        } catch (e) {
            return false
        }
    },

    isFavorite(vodId) {
        const favorites = this.getFavorites()
        return favorites.some(f => f.vod_id === vodId)
    },

    addFavorite(video) {
        const favorites = this.getFavorites()
        if (favorites.some(f => f.vod_id === video.vod_id)) return false
        const favoriteItem = {
            ...video,
            _favorite_time: Date.now() // 添加收藏时间戳
        }
        favorites.unshift(favoriteItem)
        return this.saveFavorites(favorites)
    },

    removeFavorite(vodId) {
        const favorites = this.getFavorites()
        const filtered = favorites.filter(f => f.vod_id !== vodId)
        if (filtered.length === favorites.length) return false
        return this.saveFavorites(filtered)
    },

    toggleFavorite(video) {
        if (this.isFavorite(video.vod_id)) return this.removeFavorite(video.vod_id)
        else return this.addFavorite(video)
    }
}

// --- API 模块 ---
const API = {
    buildUrl(baseUrl, params) {
        const query = Object.keys(params)
            .filter(key => params[key] !== undefined && params[key] !== '')
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&')
        if (!query) return baseUrl
        const hasQuery = baseUrl.includes('?')
        return `${baseUrl}${hasQuery ? '&' : '?'}${query}`
    },

    /**
     * 获取单个源的数据
     */
    async fetchLatest(sourceUrl, page = 1, keyword = "") {
        const params = {
            ac: 'videolist',
            pg: page
        }
        if (keyword) params.wd = keyword
        const url = this.buildUrl(sourceUrl, params)
        const req = new Request(url)
        req.timeoutInterval = 10
        try {
            const res = await req.loadJSON()
            return res
        } catch (e) {
            return null
        }
    },

    /**
     * 流式聚合搜索
     * 不等待所有结果，而是每当一个源完成，就调用回调函数 onReceive
     */
    async searchStream(keyword, onReceive) {
        const promises = SOURCES.map(async (source) => {
            try {
                const data = await this.fetchLatest(source.url, 1, keyword)
                if (data && data.list && data.list.length > 0) {
                    const items = data.list.map(item => ({
                        ...item,
                        _source_name: source.name,
                        _source_url: source.url
                    }))
                    onReceive(items)
                }
            } catch (e) { }
        })
        await Promise.all(promises)
    },

    async fetchDetail(sourceUrl, id) {
        const url = this.buildUrl(sourceUrl, {
            ac: 'videolist',
            ids: id
        })
        const req = new Request(url)
        try {
            const res = await req.loadJSON()
            return res.list && res.list.length > 0 ? res.list[0] : null
        } catch (e) {
            return null
        }
    }
}

// --- UI 模块 ---
const UI = {
    videos: [],
    page: 1,
    keyword: "",
    isLoading: false,
    searchMode: "ALL", // "ALL" | "SINGLE"
    table: new UITable(),

    async renderHome() {
        this.table.showSeparators = true
        await this.refresh(this.table)
        await this.table.present(true)
    },

    /**
     * 列表渲染
     */
    renderList(table) {
        if (this.videos.length === 0) {
            const row = new UITableRow()
            let msg = "暂无数据，请尝试搜索或切换源"
            if (this.isLoading) msg = "正在搜索资源..."
            const cell = row.addText(msg)
            cell.centerAligned()
            cell.titleColor = Color.gray()
            table.addRow(row)
            return
        }

        for (const video of this.videos) {
            const row = new UITableRow()
            row.height = 125
            row.cellSpacing = 15
            // 封面
            const imgCell = row.addImageAtURL(video.vod_pic || "https://via.placeholder.com/150")
            imgCell.widthWeight = 20
            imgCell.centerAligned()
            // 标题 + 来源/时间
            const subText = video._source_name
                ? `来源: ${video._source_name} | ${video.vod_remarks || ""}`
                : `更新: ${video.vod_remarks || video.vod_time}`
            const titleCell = row.addText(video.vod_name, subText)
            titleCell.leftAligned()
            titleCell.widthWeight = 70
            titleCell.titleFont = Font.boldSystemFont(16)
            titleCell.subtitleFont = Font.systemFont(12)
            // 搜索结果高亮来源
            if (video._source_name) titleCell.subtitleColor = new Color("#007aff")
            else titleCell.subtitleColor = Color.gray()
            // 收藏按钮
            const isFav = Store.isFavorite(video.vod_id)
            const favBtn = row.addButton(isFav ? "⭐" : "☆")
            favBtn.rightAligned()
            favBtn.widthWeight = 10
            favBtn.onTap = async () => {
                Store.toggleFavorite(video)
                // 刷新当前列表以更新按钮状态
                await this.refresh(this.table)
            }
            row.onSelect = () => this.showDetail(video)
            table.addRow(row)
        }
    },

    async loadMore() {
        // 搜索模式下（特别是全网聚合时），禁用简单的翻页，因为数据源混杂
        if (this.isLoading) return
        if (this.keyword && this.searchMode === "ALL") return

        this.isLoading = true
        await this.refresh(this.table)
        try {
            const source = Store.getCurrentSource()
            if (!this.keyword || this.searchMode === "SINGLE") {
                const data = await API.fetchLatest(source.url, this.page, this.keyword)
                if (data && data.list) {
                    const newItems = data.list.map(item => ({
                        ...item,
                        _source_name: source.name,
                        _source_url: source.url
                    }))
                    this.videos = this.videos.concat(newItems)
                    this.page += 1
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            this.isLoading = false
            await this.refresh(this.table)
        }
    },

    async refresh(table) {
        table.removeAllRows()
        const currentSource = Store.getCurrentSource()
        // 1. 初始加载（仅在非收藏模式下自动加载）
        if (this.videos.length === 0 && !this.keyword && !this.isLoading && this.searchMode !== "FAVORITE") {
            this.isLoading = true
            try {
                const data = await API.fetchLatest(currentSource.url, 1)
                if (data && data.list) {
                    this.videos = data.list.map(item => ({ ...item, _source_name: currentSource.name, _source_url: currentSource.url }))
                    this.page = 2
                }
            } catch (e) { }
            this.isLoading = false
        }

        // 2. 顶部标题栏
        const headerRow = new UITableRow()
        headerRow.isHeader = true
        headerRow.height = 50
        let titleText = "ScripTV"
        let subTitleText = currentSource.name
        if (this.searchMode === "FAVORITE") {
            titleText = "我的收藏"
            subTitleText = `共 ${this.videos.length} 部作品`
        } else if (this.keyword) {
            titleText = this.searchMode === "ALL" ? `聚合搜索: ${this.keyword}` : `单源搜索: ${this.keyword}`
            if (this.isLoading) subTitleText = `搜索中... (已找到 ${this.videos.length} 个)`
            else subTitleText = `搜索完成 (共 ${this.videos.length} 个)`
        }
        const titleCell = headerRow.addText(titleText, subTitleText)
        titleCell.titleFont = Font.boldSystemFont(20)
        titleCell.titleColor = THEME_COLOR
        titleCell.subtitleColor = Color.gray()
        titleCell.widthWeight = 56
        // 首页按钮
        const homeBtn = headerRow.addButton("🏠")
        homeBtn.rightAligned()
        homeBtn.widthWeight = 8
        homeBtn.onTap = () => this.goHome()
        // 收藏按钮
        const favBtn = headerRow.addButton("❤️")
        favBtn.rightAligned()
        favBtn.widthWeight = 8
        favBtn.onTap = () => this.showFavorites()
        // 搜索按钮
        const searchBtn = headerRow.addButton("🔍")
        searchBtn.rightAligned()
        searchBtn.widthWeight = 8
        searchBtn.onTap = () => this.showSearchInput()
        // 切换源按钮
        const switchBtn = headerRow.addButton("⚙️")
        switchBtn.rightAligned()
        switchBtn.widthWeight = 8
        switchBtn.onTap = () => this.showSourcePicker()
        table.addRow(headerRow)

        // 3. 渲染列表
        this.renderList(table)
        // 4. 加载更多按钮 (搜索页和首页下显示)
        if (this.videos.length > 0 && !(this.keyword && this.searchMode === "ALL") && this.searchMode !== "FAVORITE") {
            const loadRow = new UITableRow()
            loadRow.height = 50
            const btnText = this.isLoading ? "加载中..." : "加载更多"
            const loadBtn = loadRow.addButton(btnText)
            loadBtn.centerAligned()
            loadBtn.onTap = async () => await this.loadMore()
            table.addRow(loadRow)
        }
        table.reload()
    },

    async showSearchInput() {
        const alert = new Alert()
        const currentSourceName = Store.getCurrentSource().name
        alert.title = "视频搜索"
        alert.addTextField("输入片名/关键字", this.keyword)
        alert.addAction(`当前源搜索 (${currentSourceName})`)
        alert.addAction("全网聚合搜索")
        alert.addCancelAction("取消")

        const idx = await alert.present()
        const text = alert.textFieldValue(0)
        if (idx === 0) { // 单源搜索
            if (!text) return
            this.keyword = text
            this.searchMode = "SINGLE"
            this.videos = []
            this.page = 1
            this.isLoading = false
            await this.loadMore()
            await this.refresh(this.table)
        } else if (idx === 1) { // 全网聚合搜索
            if (!text) return
            this.keyword = text
            this.searchMode = "ALL"
            this.videos = []
            this.page = 1
            this.isLoading = true
            // 先刷新一次，显示“搜索中...”
            await this.refresh(this.table)
            await API.searchStream(this.keyword, (newItems) => {
                this.videos = this.videos.concat(newItems)
                this.refresh(this.table)
            })
            // 所有请求结束后，改变 loading 状态并最后刷新一次
            this.isLoading = false
            await this.refresh(this.table)
        }
    },

    async showSourcePicker() {
        const alert = new Alert()
        alert.title = "切换主页数据源"
        SOURCES.forEach(s => alert.addAction(s.name))
        alert.addCancelAction("取消")
        const idx = await alert.presentSheet()
        if (idx !== -1) {
            Store.setCurrentSourceIndex(idx)
            // 1. 立即清空数据并重置状态
            this.keyword = ""
            this.videos = []
            this.page = 1
            this.isLoading = true
            // 2. 先刷新界面，显示"正在加载中..."
            await this.refresh(this.table)
            // 3. 重置 isLoading，否则 loadMore 会因为防抖直接返回
            this.isLoading = false
            // 4. 异步加载新源的数据
            await this.loadMore()
        }
    },

    /**
     * 返回首页
     */
    async goHome() {
        // 清空搜索和收藏状态
        this.keyword = ""
        this.videos = []
        this.page = 1
        this.searchMode = "SINGLE"
        this.isLoading = false
        // 重新加载当前源的数据
        await this.loadMore()
        await this.refresh(this.table)
    },

    /**
     * 显示收藏列表
     */
    async showFavorites() {
        // 保存当前状态
        const previousVideos = this.videos
        const previousKeyword = this.keyword
        const previousPage = this.page
        const previousSearchMode = this.searchMode
        // 加载收藏数据
        this.videos = Store.getFavorites()
        this.keyword = ""
        this.page = 1
        this.searchMode = "FAVORITE"
        // 刷新并显示
        await this.refresh(this.table)
        await this.table.present(true)
        // 用户返回后，恢复之前的状态
        this.videos = previousVideos
        this.keyword = previousKeyword
        this.page = previousPage
        this.searchMode = previousSearchMode
        // 重新展示主列表
        await this.refresh(this.table)
        await this.table.present(true)
    },

    async showDetail(videoSummary) {
        const targetSourceUrl = videoSummary._source_url || Store.getCurrentSource().url
        const detail = await API.fetchDetail(targetSourceUrl, videoSummary.vod_id)
        if (!detail) {
            const alert = new Alert()
            alert.title = "错误"
            alert.message = "无法获取视频详情"
            alert.addAction("确定")
            await alert.present()
            await this.table.present(true)
            return
        }

        // 很多 CMS 返回的 vod_play_url 使用 $$$ 分隔不同的播放源
        // 例如: m3u8列表$$$mp4列表 默认只取第一个源，或者优先取 m3u8
        let playUrlStr = detail.vod_play_url || ""
        let playFromStr = detail.vod_play_from || ""
        const playLists = playUrlStr.split('$$$')
        const playSources = playFromStr.split('$$$')

        // 简单策略：默认取第一个源 (通常是主源)
        // 如果想更智能，可以在这里遍历 playSources 找 "m3u8"
        const currentPlaylist = playLists[0] || ""
        const currentSourceName = playSources[0] || "默认源"
        const episodes = currentPlaylist.split('#').map(e => {
            let parts = e.split('$')
            if (parts.length >= 2) return { name: parts[0], url: parts[1] }
            else return { name: "正片", url: parts[0] }
        }).filter(e => e.url && (e.url.startsWith('http') || e.url.startsWith('https')))

        const alert = new Alert()
        alert.title = `${detail.vod_name} (${currentSourceName})`
        const sourceName = videoSummary._source_name || Store.getCurrentSource().name
        let rawContent = detail.vod_content || "暂无简介"
        let cleanContent = rawContent.replace(/<[^>]+>/g, '')

        alert.message = `[来源: ${sourceName}]\n\n${cleanContent}`
        if (episodes.length === 0) {
            alert.message += "\n\n(无有效播放地址)"
            alert.addCancelAction("关闭")
            await alert.present()
            await this.table.present(true)
            return
        }

        episodes.forEach(ep => alert.addAction(ep.name))
        alert.addCancelAction("返回")
        const index = await alert.presentSheet()
        if (index !== -1) await this.playVideo(episodes[index].url)
        await this.table.present(true)
    },

    async playVideo(url) {
        await Safari.openInApp(url, true)
    }
}

// --- 启动程序 ---
if (config.runsInWidget) {
    let widget = new ListWidget()
    widget.addText("请在应用中运行 ScripTV")
    Script.setWidget(widget)
} else await UI.renderHome()
