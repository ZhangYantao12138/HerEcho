import { createRouter, createWebHistory } from 'vue-router'
import ScriptListView from '../views/ScriptListView.vue'
import ChatView from '../views/ChatView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'script-list',
            component: ScriptListView
        },
        {
            path: '/chat/:characterId',
            name: 'chat',
            component: ChatView,
            props: true
        }
    ]
})

export default router 