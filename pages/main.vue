<template>
  <div>
    <h1>主畫面</h1>
    <!-- 測驗按鈕 -->
    <button @click="goToTest" class="button">測驗</button>
    
    <!-- 成績查詢按鈕 -->
    <button @click="goToScore" class="button">成績查詢</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 跳轉到測驗頁面
const goToTest = () => {
  router.push('/exam');
};

// 跳轉到成績查詢頁面
const goToScore = () => {
  router.push('/score');
};
</script>

<style scoped>
.button {
  border: 2px solid black; /* 設定邊框顏色 & 粗細 */
  border-radius: 20px; /* 圓角邊框 */
  padding: 10px 20px; /* 內邊距 */
  background-color: #d6e2ef; /* 背景顏色 */
  color: black; /* 文字顏色 */
  font-size: 16px; /* 文字大小 */
  cursor: pointer; /* 滑鼠游標 */
}


</style>