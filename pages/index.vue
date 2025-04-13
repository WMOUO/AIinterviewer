<template>
  <div class="container">
  <div class="cursor" :style="{ left: `${mouseX}px`, top: `${mouseY}px` }"></div>

    <!-- 分割畫面 -->
    <div class="split-screen">

    <!-- 上層 -->
      <div class="up-panel">
      <div class="split-lr">
        <div class="left">
            <img src="~/assets/images/titletext.png" alt="titletext" class="image" />
        </div>

        <div class="right">
            <!-- 按鈕 -->
            <button @click="showInput = true" class="button-log">log in</button>
            <button @click="toggleModal" class="button-sign">sign in</button>
        </div>
      </div>
      </div>

    <!-- 中層 -->
      <div class="mid-panel">
        <div class="split-lr">
          <div class="left">
            <!-- 圖片 -->
            <img src="~/assets/images/interview.jpg" alt="aiinterview" style="width: 300px; height: auto;" class="image-container" />
          </div>
        
        <div class="right">
        <p>Because the website looks too empty, I put some irrelevant text in it.
        <br><br>
        Anyway, this is a website for online interviews. It uses artificial intelligence to conduct interviews.</p>
        </div>

      </div>
        </div>

        
    <!-- 下層 -->
      <div class="down-panel">
        <img src="~/assets/images/down.png" alt="titletext" class="image" />
      </div>

    </div>
  </div>

  <!-- 彈跳視窗 -->
     <div>
    <!-- 考試碼輸入框 -->
    <div v-if="showInput">
      <label for="examCode">請輸入考試碼：</label>
      <input type="text" id="examCode" v-model="examCode" autocomplete="off"/>

      <!-- 提交按鈕 -->
      <button @click="check">確認</button>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router';

const mouseX = ref(0);
const mouseY = ref(0);

const updateCursor = (e) => {
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;
  console.log("滑鼠位置:", mouseX.value, mouseY.value);
};

onMounted(() => {
  window.addEventListener("mousemove", updateCursor);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", updateCursor);
});



// 用來控制是否顯示輸入框
const showInput = ref(false);

// 用來綁定考試碼的變數
const examCode = ref('');

const router = useRouter();
// 提交考試碼
const check = () => {
  if (examCode.value === '123456') {  // 判斷考試碼是否正確
    showInput.value = false; // 提交後關閉框
    router.push('/main'); // 使用 router.push 跳轉到主頁面
  } else {
    console.log('考試碼錯誤');
    alert('考試碼錯誤，請重新輸入');
  }
};
</script>


<style scoped>
.container {
  font-family: Arial, sans-serif;
}

.split-screen {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.up-panel, .mid-panel, .down-panel {
  flex: 1;
  padding: 1px;
}

.up-panel {
  height: 30vh;
  background-color: #d6e2ef;
}

.mid-panel {
  height: 60vh;
  background-color: #d6e2ef;
}

.down-panel {
  height: 10vh;
  background-color: #9ccafb;
}

.split-lr {
  display: flex;
  flex-direction: row;
  flex: 1; /* 讓左右分割填滿下半部 */
}

.left {
  flex: 1; /* 讓左邊佔 1 比例 */
  display: flex;
  align-items: left;
  justify-content: left;
  text-align: left;
}

.right {
  flex: 1; /* 讓右邊佔 1 比例 */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* 按鈕區 */
.button-log {
  border: 2px solid black; /* 設定邊框顏色 & 粗細 */
  border-radius: 20px; /* 圓角邊框 */
  padding: 10px 20px; /* 內邊距 */
  background-color: #d6e2ef; /* 背景顏色 */
  color: black; /* 文字顏色 */
  font-size: 16px; /* 文字大小 */
  cursor: pointer; /* 滑鼠游標 */
}

.button-sign {
  border: 0px solid; /* 設定邊框顏色 & 粗細 */
  border-radius: 20px; /* 圓角邊框 */
  padding: 10px 20px; /* 內邊距 */
  background-color: #89858f; /* 按鈕背景顏色 */
  color: #ffffff; /* 文字顏色 */
  font-size: 16px; /* 文字大小 */
  cursor: pointer; /* 滑鼠游標 */
}

.button-log:hover {
  /* border-color: blue; 滑鼠移動到按鈕邊框變色 */
  background-color:rgb(177, 209, 243); /* 背景變淺藍色 */
}

.button-sign:hover {
  /* border-color: blue; 滑鼠移動到按鈕邊框變藍色 */
  background-color: #b9bdc6; /* 背景變淺灰色 */
  color: black;
}

/* 圖片區 */
.image-container {
  display: grid;
  place-items: center;/* 讓圖片水平&垂直置中 但沒用*/
  background-color: lightgray;
}

.image {
  max-width: 80%;
  width: auto;
  height: auto;
}


html, body {
  cursor: none;/* 隱藏使用者的鼠標 但失敗了*/
  margin: 0;
  padding: 0;
  height: 100%;
}

/* 光環效果 */
.cursor {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(115, 108, 108, 0.6);
  pointer-events: none;
  z-index: 9999;
  transition: all 0.1s ease;
  box-shadow: 0 0 15px 15px rgba(114, 105, 105, 0.6); /* 光暈效果 */
}

</style>