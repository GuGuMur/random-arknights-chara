<template>
    <div class="excluded-characters">
        <h2>未拥有的角色：</h2>
        <div class="small-grid" :style="gridStyle">
            <div v-for="(char, index) in characters" :key="char.name" class="small-card" :style="cardStyle">
                <div class="small-card-container" :style="containerStyle">
                    <img :src="char.avatar" :alt="char.name" class="small-image" :style="imageStyle" />
                    <div class="restore-overlay">
                        <el-button
                            class="restore-button"
                            type="success"
                            icon="Check"
                            @click="restoreCharacter(index)"
                            :style="buttonStyle"
                        >
                            恢复
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        characters: Array,
    },
    emits: ["restore-character"],
    data() {
        return {
            gridStyle: "",
            cardStyle: "",
            containerStyle: "",
            imageStyle: "",
            buttonStyle: "",
        };
    },
    methods: {
        restoreCharacter(index) {
            this.$emit("restore-character", index);
        },
        updateGridLayout() {
            const containerWidth = window.innerWidth; // 获取窗口宽度
            const gap = 16; // 卡片间的固定间距
            const maxCardWidth = 90; // 最大卡片宽度
            const minCardWidth = 30; // 最小卡片宽度

            // 计算每行的最大卡片数
            const availableWidth = containerWidth - gap; // 扣除间距后的宽度
            const columns = Math.floor(availableWidth / maxCardWidth);
            const adjustedColumns = Math.max(1, columns); // 至少 1 列

            // 计算卡片的实际宽度
            const cardWidth = Math.min(
                maxCardWidth,
                (availableWidth - gap * (adjustedColumns - 1)) / adjustedColumns
            );
            const adjustedCardWidth = Math.max(minCardWidth, cardWidth);

            // 动态样式
            this.gridStyle = `
                display: grid;
                grid-template-columns: repeat(${adjustedColumns}, ${adjustedCardWidth}px);
                gap: ${gap}px;
                justify-content: center;
            `;
            this.cardStyle = `
                width: ${adjustedCardWidth}px;
                height: auto;
                text-align: center;
            `;
            this.containerStyle = `
                width: ${adjustedCardWidth}px;
                height: ${adjustedCardWidth}px;
                position: relative;
            `;
            this.imageStyle = `
                max-width: 100%;
                height: auto;
                object-fit: contain;
            `;
            this.buttonStyle = `
                font-size: ${Math.max(8, adjustedCardWidth * 0.1)}px;
                padding: ${Math.max(2, adjustedCardWidth * 0.05)}px ${Math.max(4, adjustedCardWidth * 0.1)}px;
                border-radius: ${Math.max(2, adjustedCardWidth * 0.02)}px;
            `;
        },
    },
    mounted() {
        this.updateGridLayout();
        window.addEventListener("resize", this.updateGridLayout); // 监听窗口变化
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.updateGridLayout); // 移除监听器
    },
};
</script>

<style>
.excluded-characters {
    margin-top: 32px;
}

.small-grid {
    display: grid;
    justify-content: center;
    gap: 16px;
}

.small-card-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}

.restore-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.6);
    transition: opacity 0.3s ease;
}

.small-card-container:hover .restore-overlay {
    display: flex;
}

.restore-button {
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
}
</style>