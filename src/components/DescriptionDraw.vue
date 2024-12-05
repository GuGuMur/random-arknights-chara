<template>
    <div class="description-draw">
        <el-button @click="goBack" type="primary" icon="el-icon-back" class="back-button">返回</el-button>
        <h2>按描述抽取</h2>
        <el-button type="primary" @click="generateDescription">生成描述</el-button>
        <p class="description">{{ currentDescription }}</p>
        <el-button type="primary" @click="drawCharacters">抽取参考干员</el-button>
        <CharacterGrid v-if="drawnCharacters.length > 0" :characters="drawnCharacters" @mark-not-owned="markNotOwned" />
        <ExcludedCharacters :characters="excludedCharacters" @restore-character="restoreCharacter" />
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import CharacterGrid from './CharacterGrid.vue';
import ExcludedCharacters from './ExcludedCharacters.vue';
import { ElMessage } from 'element-plus';

export default {
    components: {
        CharacterGrid,
        ExcludedCharacters,
    },
    props: {
        characters: Array,
        excludedCharacters: Array,
    },
    emits: ['update:excludedCharacters'],
    setup(props, { emit }) {
        const router = useRouter();
        const currentDescription = ref('');
        const drawnCharacters = ref([]);

        const fields = ['职业', '标志', '出身地', '种族', '阻挡数', '攻击速度', '性别', '位置', '标签', '获得方式', '物理强度', '战场机动', '生理耐受', '战术规划', '战术技巧', '国家'];

        const goBack = () => {
            router.push('/');
        };

        const generateDescription = () => {
            const selectedFields = [];
            while (selectedFields.length < 3) {
                const field = fields[Math.floor(Math.random() * fields.length)];
                if (!selectedFields.includes(field)) {
                    selectedFields.push(field);
                }
            }

            currentDescription.value = selectedFields.map(field => {
                const value = props.characters[Math.floor(Math.random() * props.characters.length)][field];
                return `${field}为${value}`;
            }).join('，');
        };

        const availableCharacters = computed(() => {
            if (!currentDescription.value) return [];
            const excludedNames = props.excludedCharacters.map(char => char.name);
            const conditions = currentDescription.value.split('，');
            return props.characters.filter(char =>
                conditions.every(condition => {
                    const [field, value] = condition.split('为');
                    return char[field] === value;
                }) && !excludedNames.includes(char.name)
            );
        });

        const drawCharacters = () => {
            if (availableCharacters.value.length === 0) {
                ElMessage.warning('没有符合条件的角色，请重新生成描述');
                return;
            }
            drawnCharacters.value = availableCharacters.value.slice(0, Math.min(12, availableCharacters.value.length));
        };

        const markNotOwned = (name) => {
            const char = props.characters.find(c => c.name === name);
            if (char) {
                const newExcludedCharacters = [...props.excludedCharacters, char];
                emit('update:excludedCharacters', newExcludedCharacters);
                const indexToReplace = drawnCharacters.value.findIndex(c => c.name === name);
                if (indexToReplace !== -1) {
                    const replacementChar = availableCharacters.value.find(c =>
                        !drawnCharacters.value.includes(c) &&
                        c.name !== name &&
                        !newExcludedCharacters.some(ec => ec.name === c.name)
                    );
                    if (replacementChar) {
                        drawnCharacters.value[indexToReplace] = replacementChar;
                    } else {
                        drawnCharacters.value.splice(indexToReplace, 1);
                        ElMessage.warning('没有更多符合条件的干员可供替换');
                    }
                }
            }
        };

        const restoreCharacter = (index) => {
            const newExcludedCharacters = [...props.excludedCharacters];
            newExcludedCharacters.splice(index, 1);
            emit('update:excludedCharacters', newExcludedCharacters);
        };

        return {
            currentDescription,
            drawnCharacters,
            generateDescription,
            drawCharacters,
            markNotOwned,
            restoreCharacter,
            goBack,
            excludedCharacters: props.excludedCharacters,
        };
    },
};
</script>

<style scoped>
.description-draw {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.back-button {
    position: absolute;
    top: 20px;
    right: 20px;
}

.description {
    margin: 20px 0;
    font-size: 18px;
    font-weight: bold;
}
</style>
