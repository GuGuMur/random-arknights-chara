<template>
  <el-container>
    <el-main>
      <MainHeader :hasDrawn="hasDrawn" @action="getRandomCharacters" />
      <CharacterGrid v-if="hasDrawn" :characters="currentCharacters" @mark-not-owned="markNotOwned" />
      <ExcludedCharacters v-if="excludedCharacters.length > 0" :characters="excludedCharacters"
        @restore-character="restoreCharacter" />
    </el-main>
  </el-container>
</template>

<script>
import MainHeader from "./components/MainHeader.vue";
import CharacterGrid from "./components/CharacterGrid.vue";
import ExcludedCharacters from "./components/ExcludedCharacters.vue";
import { characters as allCharacters } from "@/assets/operator_data.js";
import Cookies from "js-cookie";

export default {
  components: {
    MainHeader,
    CharacterGrid,
    ExcludedCharacters,
  },
  data() {
    return {
      characters: [],
      currentCharacters: [],
      excludedCharacters: [],
      hasDrawn: false,
    };
  },
  methods: {
    initializeCharacters() {
      this.characters = allCharacters.map((item) => ({
        name: item.干员,
        rarity: Number(item.稀有度),
        image: `/random-arknights-chara/img/半身像_${item.干员}_2.png`,
        avatar:
          Number(item.稀有度) >= 3
            ? `/random-arknights-chara/img/头像_${item.干员}_2.png`
            : `/random-arknights-chara/img/头像_${item.干员}.png`,
        ...item,
      }));
    },
    getRandomCharacters() {
      // 收集已被标记为未拥有的角色名
      const excludedNames = this.excludedCharacters.map((char) => char.name);

      // 从角色池中排除未拥有的角色
      const availableCharacters = this.characters.filter(
        (char) => char.rarity === 5 && !excludedNames.includes(char.name)
      );

      if (availableCharacters.length < 12) {
        this.$message.error("剩余可抽取角色不足12个！");
        return;
      }

      // 随机选择12个不重复的角色
      const selectedCharacters = new Set();
      while (selectedCharacters.size < 12) {
        const randomIndex = Math.floor(Math.random() * availableCharacters.length);
        selectedCharacters.add(availableCharacters[randomIndex]);
      }

      this.currentCharacters = Array.from(selectedCharacters);
      this.hasDrawn = true;
    },
    markNotOwned(name) {
      // 找到被标记为未拥有的角色
      const excludedChar = this.characters.find((char) => char.name === name);

      if (!excludedChar || this.excludedCharacters.some((char) => char.name === name)) {
        return; // 如果角色已被标记未拥有，直接返回
      }

      // 添加到未拥有列表
      this.excludedCharacters.push(excludedChar);
      this.saveExcludedCharacters();

      // 从当前角色中移除被标记未拥有的角色
      const charIndex = this.currentCharacters.findIndex((char) => char.name === name);
      if (charIndex === -1) return;

      // 收集已排除和当前角色的名字，避免重复
      const excludedNames = this.excludedCharacters.map((char) => char.name);
      const currentNames = this.currentCharacters.map((char) => char.name);
      const unavailableNames = new Set([...excludedNames, ...currentNames]);

      // 从角色池中找到可用的替换角色
      const availableCharacters = this.characters.filter(
        (char) => char.rarity === 5 && !unavailableNames.has(char.name)
      );

      if (availableCharacters.length === 0) {
        // 如果没有足够的角色可替换，则移除角色而不替换
        this.currentCharacters.splice(charIndex, 1);
        this.$message.warning("没有足够的角色可替换！");
      } else {
        // 替换逻辑：随机选择一个新角色并替换
        const randomIndex = Math.floor(Math.random() * availableCharacters.length);
        this.currentCharacters[charIndex] = availableCharacters[randomIndex];
      }
    },
    restoreCharacter(index) {
      this.excludedCharacters.splice(index, 1);
      this.saveExcludedCharacters();
    },
    saveExcludedCharacters() {
      // 将未拥有的干员名称数组保存到 Cookie
      const excludedNames = this.excludedCharacters.map((char) => char.name);
      Cookies.set("excludedCharacters", JSON.stringify(excludedNames), {
        expires: 365, // 一年有效期
      });
    },
    loadExcludedCharacters() {
      // 从 Cookie 中加载未拥有的干员名称，并恢复对应干员数据
      const cookieData = Cookies.get("excludedCharacters");
      if (cookieData) {
        const excludedNames = JSON.parse(cookieData);
        this.excludedCharacters = this.characters.filter((char) =>
          excludedNames.includes(char.name)
        );
      }
    },
  },
  mounted() {
    this.initializeCharacters();
    this.loadExcludedCharacters();
  },
};
</script>