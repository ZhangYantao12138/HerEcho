import { createRouter, createWebHistory } from 'vue-router'
import CharacterChatPage from '../components/CharacterChatPage.vue'

const router = createRouter({
  history: createWebHistory('/HerEcho/'),
  routes: [
    {
      path: '/',
      redirect: '/chat'
    },
    {
      path: '/dream',
      name: 'dream',
      component: () => import('../views/DreamHomeView.vue')
    },
    {
      path: '/dream/scene/:storyId?',
      name: 'dreamScene',
      component: () => import('../views/DreamView.vue'),
      props: true
    },
    {
      path: '/chat',
      name: 'chat',
      component: CharacterChatPage
    },
    {
      path: '/discover',
      name: 'discover',
      component: () => import('../views/DiscoverView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    }
  ]
})

export default router 