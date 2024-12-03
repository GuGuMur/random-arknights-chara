<template>
  <el-container>
    <!-- 网站标题 -->
    <!-- <el-header>
      <h1 class="site-title">老！缠！杯！</h1>
    </el-header> -->

    <!-- 抽取标题和按钮 -->
    <el-main>
      <div class="main-header">
        <h1 class="draw-title">角色抽取！没有的角色就点它替换！</h1>
        <el-button
          class="action-button"
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

      <!-- 未拥有角色展示 -->
      <div class="excluded-characters" v-if="excludedCharacters.length > 0">
        <h2>未拥有的角色：</h2>
        <div class="small-grid">
          <div
            v-for="(char, index) in excludedCharacters"
            :key="char.name"
            class="small-card"
          >
            <div class="small-card-container">
              <img :src="char.url" :alt="char.name" class="small-image" />
              <div class="overlay">
                <el-button
                  class="restore-button"
                  type="success"
                  icon="Check"
                  @click="restoreCharacter(index)"
                >
                  恢复
                </el-button>
              </div>
            </div>
            <div class="small-name">{{ char.name }}</div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { characters } from "./assets/characters";
import CharacterGrid from "./components/CharacterGrid.vue";
import Cookies from "js-cookie";
import { Refresh, Check } from "@element-plus/icons-vue";

export default {
  components: { CharacterGrid },
  data() {
    return {
      characters,
      excludedCharacters: [],
      currentCharacters: [],
      hasDrawn: false,
    };
  },
  methods: {
    getRandomCharacters() {
      const excludedNames = this.excludedCharacters.map((char) => char.name);
      const availableCharacters = this.characters.filter(
        (char) => !excludedNames.includes(char.name)
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
      this.hasDrawn = true;
    },
    replaceCharacter(name) {
      const excludedNames = this.excludedCharacters.map((char) => char.name);
      const availableCharacters = this.characters.filter(
        (char) =>
          !excludedNames.includes(char.name) &&
          !this.currentCharacters.some((current) => current.name === char.name)
      );

      if (availableCharacters.length === 0) {
        this.$message.error("没有更多可替换的角色！");
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableCharacters.length);
      const newCharacter = availableCharacters[randomIndex];

      const index = this.currentCharacters.findIndex((char) => char.name === name);
      if (index !== -1) {
        this.currentCharacters.splice(index, 1, newCharacter);
      }

      const excludedChar = this.characters.find((char) => char.name === name);
      if (excludedChar && !this.excludedCharacters.includes(excludedChar)) {
        this.excludedCharacters.push(excludedChar);
        this.saveExcludedCharacters();
      }
    },
    restoreCharacter(index) {
      this.excludedCharacters.splice(index, 1);
      this.saveExcludedCharacters();
    },
    saveExcludedCharacters() {
      Cookies.set("excludedCharacters", JSON.stringify(this.excludedCharacters), {
        expires: 365,
      });
    },
    loadExcludedCharacters() {
      const cookieData = Cookies.get("excludedCharacters");
      if (cookieData) {
        this.excludedCharacters = JSON.parse(cookieData);
      }
    },
    addGoogleAnalytics() {
      const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
      if (gaId) {
        // 加载 Google Analytics 脚本
        const script1 = document.createElement("script");
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script1);

        // 初始化 Google Analytics
        const script2 = document.createElement("script");
        script2.text = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
        document.head.appendChild(script2);
      }
    },
  },
  mounted() {
    this.loadExcludedCharacters();
    this.addGoogleAnalytics();
  },
};
</script>

<style>
/* 网站标题 */
.site-title {
  text-align: center;
  font-size: 32px;
  color: #4caf50;
  font-weight: bold;
  margin: 16px 0;
}

/* 主标题和按钮区域 */
.main-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.draw-title {
  font-size: 24px;
  color: #333;
  margin: 8px 0;
  text-align: center;
}

.action-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
}

/* 未拥有角色展示 */
.excluded-characters {
  margin-top: 32px;
}

.small-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.small-card {
  width: 80px;
  text-align: center;
}

.small-card-container {
  position: relative;
  width: 100%;
}

.small-image {
  width: 100%;
  border-radius: 4px;
}

.small-name {
  font-size: 12px;
  color: #333;
  margin-top: 4px;
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

.small-card-container:hover .overlay {
  opacity: 1;
}

.restore-button {
  background-color: #4caf50;
  border: none;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}
</style>