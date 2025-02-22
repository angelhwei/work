<template>
    <div>
        <h1>Task Manager</h1>

        <!-- 搜索和過濾區域 -->
        <div class="filters">
            <input
                v-model="searchQuery"
                @input="filterTasks"
                placeholder="Search tasks..."
                class="search-input"
            />
            <!-- 日期過濾 -->
            <div class="date-filters">
                <label>From:</label>
                <input type="date" v-model="startDate" @change="filterTasks" />
                <label>To:</label>
                <input type="date" v-model="endDate" @change="filterTasks" />
            </div>
            <!-- 狀態過濾 -->
            <select v-model="statusFilter" @change="filterTasks">
                <option value="">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
            </select>

            <!-- 優先級過濾 -->
            <select v-model="priorityFilter" @change="filterTasks">
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="none">None</option>
            </select>
        </div>

        <div>
            <input v-model="newTask" @keyup.enter="addTask" placeholder="New Task" />
            <!-- add drop-down menu -->
            <label for="priority">Priority:</label>
            <select id="priority" v-model="priority">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="none">None</option>
            </select>
            <!-- 添加日期選擇器 -->
            <label for="dueDate">Due Date:</label>
            <input
                type="date"
                id="dueDate"
                v-model="dueDate"
                :min="new Date().toISOString().split('T')[0]"
            />
            <div>
                <!-- Add status selector to new task form -->
                <label for="status">Status:</label>
                <select id="status" v-model="status">
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
            <button @click="addTask">Add Task</button>
        </div>

        <ul>
            <li v-for="task in tasks" :key="task._id">
                <input type="checkbox" v-model="task.completed" @change="updateTask(task)" />
                <span :style="{ textDecoration: task.completed ? 'line-through' : 'none' }">{{
                    task.title
                }}</span>
                <!-- Add status selector for each task -->
                <select v-model="task.status" @change="updateTask(task)" class="status-select">
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>

                <!-- Add status badge -->
                <span :class="['status-badge', task.status]">
                    {{ formatStatus(task.status) }}
                </span>
                <!-- 修改優先級選擇器 -->
                <select v-model="task.priority" @change="updateTask(task)">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    <option value="none">None</option>
                </select>
                <!-- 添加優先級標籤 -->
                <span :class="['priority-tag', task.priority]">
                    {{ task.priority }}
                </span>
                <!-- 添加截止日期顯示 -->
                <span class="due-date" :class="{ overdue: isOverdue(task.dueDate) }">
                    {{ formatDate(task.dueDate) }}
                </span>
                <button @click="deleteTask(task._id)">Delete</button>
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios'

// Add this utility function in your script section
function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout) // 清除之前的定時器
            func.apply(this, args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait) // 設置新的定時器
    }
}

export default {
    data() {
        return {
            tasks: [],
            newTask: '',
            priority: 'none',
            dueDate: new Date().toISOString().split('T')[0], // 今天的日期作為默認值
            status: 'todo', // Add default status
            searchQuery: '',
            startDate: '',
            endDate: '',
            statusFilter: '',
            priorityFilter: '',
        }
    },
    methods: {
        async fetchTasks() {
            try {
                let url = 'http://localhost:5001/tasks?' // 設定基礎 API URL
                const params = new URLSearchParams() // 創建 URL 參數對象

                if (this.searchQuery) params.append('search', this.searchQuery)
                if (this.startDate) params.append('startDate', this.startDate)
                if (this.endDate) params.append('endDate', this.endDate)
                if (this.statusFilter) params.append('status', this.statusFilter)
                if (this.priorityFilter) params.append('priority', this.priorityFilter)

                // 組合完整的 URL（包含過濾參數）
                // 使用 axios 發送 GET 請求
                const response = await axios.get(`${url}${params.toString()}`) 
                this.tasks = response.data // 更新本地任務列表
            } catch (error) {
                console.error('Error fetching tasks:', error)
            }
        },
        async addTask() {
            if (this.newTask.trim()) {
                try {
                    console.log('Priority:', this.priority)
                    const response = await axios.post('http://localhost:5001/tasks', {
                        title: this.newTask,
                        priority: this.priority,
                        dueDate: this.dueDate,
                        status: this.status, // Add status to new task
                    })
                    this.tasks.push(response.data)
                    this.newTask = '' // Clear the input field
                    this.priority = 'none' // Clear the priority
                    this.dueDate = new Date().toISOString().split('T')[0] // Clear the due date
                    this.status = 'todo' // Reset status
                } catch (error) {
                    console.error('Error adding task:', error)
                }
            }
        },

        formatDate(date) {
            if (!date) return 'No due date'
            return new Date(date).toLocaleDateString()
        },

        isOverdue(date) {
            if (!date) return false
            return new Date(date) < new Date().setHours(0, 0, 0, 0)
        },

        async updateTask(task) {
            try {
                const response = await axios.put(`http://localhost:5001/tasks/${task._id}`, {
                    completed: task.completed,
                    priority: task.priority, // 添加優先級更新
                    status: task.status, // Add status update
                })
                const index = this.tasks.findIndex(t => t._id === task._id)
                if (index !== -1) {
                    this.tasks[index] = { ...this.tasks[index], ...response.data }
                }
                console.log('Task updated:', response.data) // 添加日誌
            } catch (error) {
                console.error('Error updating task:', error)
            }
        },

        async deleteTask(id) {
            try {
                await axios.delete(`http://localhost:5001/tasks/${id}`)
                this.tasks = this.tasks.filter(task => task._id !== id)
            } catch (error) {
                console.error('Error deleting task:', error)
            }
        },

        formatStatus(status) {
            const statusMap = {
                todo: 'To Do',
                'in-progress': 'In Progress',
                completed: 'Completed',
            }
            return statusMap[status] || status
        },

        // 添加防抖功能來避免過多請求
        /* 
        Debounce 是一個性能優化技術，用於限制函數的執行頻率。
        它特別適用於處理頻繁觸發的事件，比如搜索輸入。

        優點
        1. 減少服務器負載：避免過多的 API 請求、節省服務器資源
        2. 提升性能：減少不必要的數據處理、提高應用響應速度
        3. 改善用戶體驗：更流暢的搜索體驗、減少閃爍和卡頓

        使用場景
        1. 搜索框即時搜索
        2. 窗口調整大小
        3. 滾動事件處理
        4. 表單驗證 
        */
        filterTasks: debounce(function () {
            this.fetchTasks()
        }, 300), // 300ms 的延遲
    },
    created() {
        this.fetchTasks()
    },
}
</script>

<style scoped>
button {
    margin-left: 10px;
    cursor: pointer;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    margin: 10px 0;
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.priority-tag {
    padding: 2px 6px;
    border-radius: 4px;
    margin: 0 8px;
    font-size: 0.8em;
    text-transform: capitalize;
}

.high {
    background-color: #ff4444;
    color: white;
}

.medium {
    background-color: #ffbb33;
    color: black;
}

.low {
    background-color: #00c851;
    color: white;
}

.none {
    background-color: gray;
    color: black;
}

.task-input {
    margin-bottom: 20px;
}

.task-input input[type='date'] {
    margin: 0 10px;
    padding: 5px;
}

.due-date {
    margin-left: 10px;
    font-size: 0.9em;
    color: #666;
}

.overdue {
    color: #ff4444;
    font-weight: bold;
}

.status-select {
    margin: 0 10px;
    padding: 3px;
    border-radius: 3px;
}

.status-badge {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    margin: 0 8px;
}

.todo {
    background-color: #f0f0f0;
    color: #666;
}

.in-progress {
    background-color: #3498db;
    color: white;
}

.completed {
    background-color: #2ecc71;
    color: white;
}

.filters {
    margin: 20px 0;
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
}

.search-input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 200px;
}

.date-filters {
    display: flex;
    gap: 10px;
    align-items: center;
}

select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
</style>
