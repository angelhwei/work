// 引入所需的模塊
const express = require('express') // 引入Express框架
const mongoose = require('mongoose') // 引入Mongoose，用於連接和操作MongoDB
const cors = require('cors') // 引入CORS中間件，允許跨域請求
require('dotenv').config() // 引入dotenv模塊，從.env文件加載環境變量

const app = express() // 創建Express應用程序實例

// 中間件設置
app.use(cors()) // 使用CORS中間件
app.use(express.json()) // 使用JSON解析中間件，解析請求中的JSON數據

// 連接到 MongoDB
mongoose
    .connect(process.env.MONGO_URI) // 使用環境變量中的MongoDB URI連接到MongoDB
    .then(() => console.log('MongoDB connected')) // 連接成功時打印消息
    .catch(err => console.log(err)) // 連接失敗時打印錯誤

// 定義任務模型
const Task = mongoose.model(
    'Task',
    new mongoose.Schema({
        title: { type: String, required: true }, // 任務標題，必填
        completed: { type: Boolean, default: false }, // 任務完成狀態，默認為false
        priority: { type: String, default: 'none' }, // 任務優先級，默認為none
        dueDate: { type: Date }, // 添加截止日期字段
        status: { type: String, default: 'todo' }, // Add status field
    })
)

// 路由：獲取所有任務
// 修改獲取任務的路由，添加搜索和過濾功能
app.get('/tasks', async (req, res) => {
    try {
        const { search, startDate, endDate, status, priority } = req.query
        let query = {}

        // 標題搜索
        if (search) {
            query.title = { $regex: search, $options: 'i' } // $regex: MongoDB 的正則表達式搜索, $options: 'i': 不區分大小寫
        }

        // 日期範圍過濾
        if (startDate || endDate) {
            query.dueDate = {}
            if (startDate) query.dueDate.$gte = new Date(startDate)
            if (endDate) query.dueDate.$lte = new Date(endDate)
        } // $gte: 大於或等於開始日期, $lte: 小於或等於結束日期

        // 狀態過濾
        if (status) {
            query.status = status
        }

        // 優先級過濾
        if (priority) {
            query.priority = priority
        }

        const tasks = await Task.find(query).sort({ dueDate: 1 }) // find(query): 根據組合的查詢條件搜索, sort({ dueDate: 1 }): 按截止日期升序排序
        res.json(tasks)
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' })
    }
})

// 路由：創建任務
app.post('/tasks', async (req, res) => {
    const newTask = new Task({
        title: req.body.title,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        status: req.body.status,
    }) // 根據請求中的標題創建新任務
    await newTask.save() // 將新任務保存到數據庫
    res.json(newTask) // 將新創建的任務以JSON格式返回
})

// 路由：更新任務完成狀態
app.put('/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id) // 根據ID查找任務
    task.completed = req.body.completed // 更新任務的完成狀態
    task.priority = req.body.priority // 確保更新優先級
    task.dueDate = req.body.dueDate
    task.status = req.body.status
    await task.save() // 將更新後的任務保存到數據庫
    res.json(task) // 將更新後的任務以JSON格式返回
})

// 路由：刪除任務
app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id) // 根據ID刪除任務
    res.json({ message: 'Task deleted' }) // 返回刪除成功的消息
})

// 啟動伺服器
const PORT = process.env.PORT || 5001 // 設置伺服器端口，默認為5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)) // 啟動伺服器並打印運行消息
