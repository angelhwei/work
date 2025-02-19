<template>
    <div>
        <h1>Task Manager</h1>
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
            <button @click="addTask">Add Task</button>
        </div>

        <ul>
            <li v-for="task in tasks" :key="task._id">
                <input type="checkbox" v-model="task.completed" @change="updateTask(task)" />
                <span :style="{ textDecoration: task.completed ? 'line-through' : 'none' }">{{
                    task.title
                }}</span>
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
                <button @click="deleteTask(task._id)">Delete</button>
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            tasks: [],
            newTask: '',
            priority: 'none',
        }
    },
    methods: {
        async fetchTasks() {
            try {
                const response = await axios.get('http://localhost:5001/tasks')
                this.tasks = response.data
                console.log('Tasks:', this.tasks)
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
                    })
                    this.tasks.push(response.data)
                    this.newTask = '' // Clear the input field
                    this.priority = 'none' // Clear the priority
                } catch (error) {
                    console.error('Error adding task:', error)
                }
            }
        },
        async updateTask(task) {
            try {
                const response = await axios.put(`http://localhost:5001/tasks/${task._id}`, {
                    completed: task.completed,
                    priority: task.priority, // 添加優先級更新
                })
                const index = this.tasks.findIndex(t => t._id === task._id);
                if (index !== -1) {
                    this.tasks[index] = { ...this.tasks[index], ...response.data };
                }
                console.log('Task updated:', response.data);  // 添加日誌
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
</style>
