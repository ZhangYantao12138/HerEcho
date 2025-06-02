import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['src/**/*.test.ts'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*.{ts,vue}'],
            exclude: ['src/**/*.test.ts']
        }
    }
}) 