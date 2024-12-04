<template>
    <div class="main-header">
      <h1 class="draw-title">角色抽取！没有的角色就点它替换！</h1>
      <el-button
        class="action-button"
        type="primary"
        size="large"
        @click="onAction"
        icon="Refresh"
      >
        {{ hasDrawn ? "重抽" : "抽取" }}
      </el-button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      hasDrawn: Boolean,
    },
    emits: ["action"],
    methods: {
      onAction() {
        this.$emit("action");
      },
    },
  };
  </script>
  
  <style>
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
    margin-top: 16px;
  }
  </style>