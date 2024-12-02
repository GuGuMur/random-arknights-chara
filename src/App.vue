<template>
  <el-container>
    <!-- 网站标题 -->
    <!-- <el-header>
      <h1 class="site-title">脑！缠！杯！</h1>
    </el-header> -->

    <!-- 抽取标题和按钮 -->
    <el-main>
      <div class="main-header">
        <h1 class="draw-title">角色抽取！</h1>
        <el-button
          type="primary"
          size="large"
          @click="getRandomCharacters"
          icon="Refresh"
        >
          {{ hasDrawn ? "重抽" : "抽取" }}
        </el-button>
      </div>

      <!-- 角色展示网格 -->
      <CharacterGrid
        v-if="hasDrawn"
        :characters="currentCharacters"
        @replace="replaceCharacter"
      />
    </el-main>
  </el-container>
</template>

<style>
.main-header {
  text-align: center;
  margin-bottom: 24px;
}

.draw-title {
  font-size: 24px;
  color: #333;
  margin: 8px 0;
}
</style>

<script>
import { characters } from "./assets/characters";
import CharacterGrid from "./components/CharacterGrid.vue";
import { Refresh } from "@element-plus/icons-vue";

export default {
  components: { CharacterGrid },
  data() {
    return {
      characters,
      excludedCharacters: [],
      currentCharacters: [],
      hasDrawn: false, // 控制是否已抽取
    };
  },
  methods: {
    getRandomCharacters() {
      const availableCharacters = this.characters.filter(
        (char) => !this.excludedCharacters.includes(char.name)
      );

      if (availableCharacters.length < 12) {
        this.$message.error("剩余角色不足12个！");
        return;
      }

      this.currentCharacters = [];
      while (this.currentCharacters.length < 12) {
        const randomIndex = Math.floor(Math.random() * availableCharacters.length);
        const character = availableCharacters[randomIndex];
        if (!this.currentCharacters.includes(character)) {
          this.currentCharacters.push(character);
        }
      }
      this.hasDrawn = true; // 抽取后状态设为已抽取
    },
    replaceCharacter(name) {
      const availableCharacters = this.characters.filter(
        (char) =>
          !this.excludedCharacters.includes(char.name) &&
          !this.currentCharacters.some((current) => current.name === char.name)
      );

      if (availableCharacters.length === 0) {
        this.$message.error("没有更多可替换的角色！");
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableCharacters.length);
      const newCharacter = availableCharacters[randomIndex];

      // 替换当前角色
      const index = this.currentCharacters.findIndex((char) => char.name === name);
      if (index !== -1) {
        this.currentCharacters.splice(index, 1, newCharacter);
      }
    },
  },
};
</script>