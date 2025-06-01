<template>
  <video ref="video" autoplay playsinline class="w-full h-full transform scale-x-[-1]" />
    <div class="card flex justify-center">
        <Dialog v-model:visible="visible" header="警告" :style="{ width: '25rem',height:'11rem' }">
            <p class="text-center">畫面出現一人以上，測驗終止</p>
            <div class="flex justify-end gap-2">
              <Button type="button" label="確認" @click="visible = false" />
            </div>
        </Dialog>
        <Toast position="bottom-center" group="camera"/>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Dialog from 'primevue/dialog'
import { peopleCount } from '@/utils/shared'

//const videoRef = ref(null)
const visible = ref(false);
const faceCount = ref(0)
const video = ref<HTMLVideoElement | null>(null)
const toast = useToast()
const stream = ref<MediaStream | null>(null)

onMounted(async () => {
    try {
      //開攝影機
      stream.value = await navigator.mediaDevices.getUserMedia({ video: true })
      if (video.value !== null) {
        video.value.srcObject = stream.value
      }
      toast.removeGroup('camera')

      //載入判斷人臉套件
      const blazeface = await import('@tensorflow-models/blazeface')
      const tf = await import('@tensorflow/tfjs')
      const model = await blazeface.load()

      await new Promise((resolve) => {
        const checkReady = () => {
          if (video.value && video.value?.readyState >= 2) {
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
          peopleCount.value = predictions.length

          //人數超過1人，影片暫停
        if (peopleCount.value > 1 && !visible.value) {
          stream.value?.getTracks().forEach((track) => track.stop())
          visible.value = true
        }
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
        group: 'camera'
      })
    }
  })
</script>

