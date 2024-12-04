<template>
    <div class="character-grid" :style="gridStyle">
        <div class="character-card" v-for="char in characters" :key="char.name" :style="cardStyle">
            <img :src="char.image" :alt="char.name" class="character-image" :style="imageStyle" />
            <div class="character-name">{{ char.name }}</div>
            <div class="overlay">
                <el-button class="not-owned-button" type="danger" icon="Close" @click="markNotOwned(char.name)"
                    :style="buttonStyle">
                    未拥有
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        characters: Array,
    },
    data() {
        return {
            gridStyle: "",
            cardStyle: "",
            imageStyle: "",
            buttonStyle: "",
        };
    },
    methods: {
        updateGridLayout() {
            const containerWidth = window.innerWidth; // 获取窗口宽度
            const maxColumns = 12; // 最大列数
            const gap = 12; // 固定间距
            const maxImageWidth = 180; // 最大图片宽度
            const minImageWidth = 50; // 最小图片宽度

            // 计算适合的列数和图片大小
            const availableWidth = containerWidth - gap * (maxColumns - 1); // 扣除间距后的总宽度
            let columns = Math.floor(availableWidth / maxImageWidth);

            if (columns >= 12) columns = 12;
            else if (columns >= 6 && columns < 12) columns = 6;
            else if (columns >= 4 && columns < 6) columns = 4;
            else if (columns < 4) columns = 4; // 最少4列

            const imageWidth = Math.min(
                maxImageWidth,
                (availableWidth - gap * (columns - 1)) / columns
            );
            const adjustedImageWidth = Math.max(minImageWidth, imageWidth);

            // 动态设置样式
            this.gridStyle = `
                display: grid;
                grid-template-columns: repeat(${columns}, ${adjustedImageWidth}px);
                gap: ${gap}px;
                justify-content: center;
            `;
            this.cardStyle = `
                width: ${adjustedImageWidth}px;
                height: auto;
                text-align: center;
            `;
            this.imageStyle = `
                max-width: 100%;
                height: auto;
                object-fit: contain;
            `;
            this.buttonStyle = `
                font-size: ${Math.max(8, adjustedImageWidth * 0.1)}px;
                padding: ${Math.max(2, adjustedImageWidth * 0.05)}px ${Math.max(4, adjustedImageWidth * 0.1)}px;
                border-radius: ${Math.max(2, adjustedImageWidth * 0.02)}px;
            `;
        },
        markNotOwned(name) {
            this.$emit("mark-not-owned", name);
        },
    },
    mounted() {
        this.updateGridLayout();
        window.addEventListener("resize", this.updateGridLayout); // 监听窗口大小变化
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.updateGridLayout); // 清理事件监听
    },
};
</script>

<style>
.character-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    grid-template-rows: repeat(2, minmax(120px, auto));
    gap: 16px;
    justify-content: center;
    margin: 24px auto;
}

.character-card {
    position: relative;
    text-align: center;
}

.character-image {
    max-width: 100%;
    height: auto;
    object-fit: contain;
    /* 保持图片比例 */
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    background: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s ease;
}

.character-card:hover .overlay {
    opacity: 1;
}

.not-owned-button {
    background-color: #f44336;
    color: white;
    border: none;
    cursor: pointer;
}

.character-name {
    margin-top: 8px;
    font-size: 14px;
    text-align: center;
    color: #333;
    font-weight: bold;
}
</style>