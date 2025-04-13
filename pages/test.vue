<template>
  <div class="container">
    <!-- 左邊區域 -->
    <div class="left">
      <client-only>
        <video src="~/assets/video/blackman.mp4" autoplay />
      </client-only>
    </div>

    <!-- 右邊區域 -->
    <div class="right">

      <!-- 右上區域 -->
      <div class="top-right">

      </div>

      <!-- 右下區域 -->
      <div class="down-right">
        <client-only>
        <camera :resolution="{ width: 400, height: 200 }" autoplay></camera>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineAsyncComponent } from 'vue'
//影片
    import 'nuxt-video-player/src/assets/css/main.css'
    const VideoPlayer = defineAsyncComponent(() => import('nuxt-video-player'))

//照相機
    const Camera = defineAsyncComponent(() => import('simple-vue-camera'))

</script>

<style scoped>
.container {
  display: flex; 
  height: 100vh;
}

.left {
  width: 50%; 
  display: flex;
  background-color: #f4f4f4;
  padding: 20px;
}

.right {
  width: 50%; 
  display: flex;
  flex-direction: column; /* 右側內部元素上下排列 */
}

.top-right {
  flex: 1; 
  background-color: #d4e2ff; /* 背景顏色 */
  padding: 20px;
}

.down-right {
  flex: 1;
  background-color: #ffefdb; /* 背景顏色 */
  padding: 20px;
}
</style>
