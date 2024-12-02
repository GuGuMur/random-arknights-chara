<template>
    <div class="character-grid">
      <div v-for="char in characters" :key="char.name" class="character-card">
        <img :src="char.url" :alt="char.name" class="character-image" />
        <div class="character-name">{{ char.name }}</div>
        <div class="overlay">
          <el-button
            type="danger"
            icon="Close"
            @click="$emit('replace', char.name)"
          >
            未拥有
          </el-button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ["characters"],
  };
  </script>
  
  <style scoped>
.character-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); /* 响应式列数 */
  gap: 16px;
  padding: 16px;
  justify-content: center;
}

.character-card {
  width: 100%;
  max-width: 180px; /* 保持图片比例的最大宽度 */
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
}

.character-image {
  width: 100%;
  height: auto; /* 保持宽高比 */
}

.character-name {
  margin-top: 8px;
  font-size: 16px;
  color: #333;
  font-weight: bold;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.character-card:hover .overlay {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .character-grid {
    grid-template-columns: repeat(4, 1fr); /* 中屏设备显示 4 列 */
  }
}

@media (max-width: 768px) {
  .character-grid {
    grid-template-columns: repeat(6, 1fr); /* 小屏设备显示 6 列 */
  }
}

@media (max-width: 480px) {
  .character-grid {
    grid-template-columns: repeat(4, 1fr); /* 超小屏设备显示 4 列 */
  }
}
  </style>