<template>
  <video ref="video" autoplay playsinline class="w-full h-full transform scale-x-[-1]" />
  <p class="absolute top-2 left-2 bg-black text-white p-2 rounded-lg text-sm">
      畫面中有 {{ faceCount }} 個人臉
  </p>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

const faceCount = ref(0)
const video = ref<HTMLVideoElement | null>(null)
const toast = useToast()

onMounted(async () => {
  if (process.client) {
    try {
      //開攝影機
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (video.value !== null) {
        video.value.srcObject = stream
      }
      toast.removeGroup('camera')

      //載入套件
      const blazeface = await import('@tensorflow-models/blazeface')
      const tf = await import('@tensorflow/tfjs')
      const model = await blazeface.load()

      await new Promise((resolve) => {
        const checkReady = () => {
          if (video.value?.readyState >= 2) {
            resolve(true)
          } else {
            requestAnimationFrame(checkReady)
          }
        }
        checkReady()
      })

      //偵測人臉
      const detectFaces = async () => {
        if (video.value) {
          const predictions = await model.estimateFaces(video.value, false)
          faceCount.value = predictions.length
        }
        requestAnimationFrame(detectFaces)
      }

      detectFaces()

    } catch (err) {
      console.error('無法取得攝影機：', err)
      toast.add({
        severity: 'warn',
        summary: '攝影機錯誤',
        detail: '無法啟動攝影機，請確認權限或設備狀態',
        life: 999999,
        group: 'cameraNotPrepare'
      })
    }
  }
})
</script>

