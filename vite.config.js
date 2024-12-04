import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src', // 确保 @ 指向 src 目录
    },
  },
  base: '/random-arknights-chara/', // 设置你的项目路径
});