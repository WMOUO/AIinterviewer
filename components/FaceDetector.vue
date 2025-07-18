<template>
  <div class="relative">
    <video v-show="!stop" ref="video" autoplay playsinline class="w-full h-full transform scale-x-[-1]"/>
    <canvas v-show="stop" ref="canvas"  class="absolute top-0 left-0 w-full h-full" />
    
    <!-- <Dialog 
      v-model:visible="visible"
      :closable="false"
      :dismissable-mask="false"
      :close-on-escape="false"
      header="警告" :style="{ width: '25rem', height: '11rem' }">
      <p class="text-center">
        {{ warningCount < 2 ? `出現一人以上，警告3次將終止測驗，目前 ${warningCount+1} 次` : '警告3次，測驗即將終止' }}
      </p>
      <div class="flex justify-end gap-2">
        <Button type="button" label="確認" @click="handleDialogConfirm" />
      </div>
    </Dialog>

    <Toast position="bottom-center" group="camera" /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { useToast } from 'primevue/usetoast'
// import Dialog from 'primevue/dialog'

//傳人數到test
// const model = defineModel<number>('faceCount') // 加入人數偵測時使用
const emit = defineEmits(['terminate'])

const video = ref<HTMLVideoElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const stream = ref<MediaStream | null>(null)

// const toast = useToast() // 加入人數偵測時使用
// const visible = ref(false) // 加入人數偵測時使用
const stop = ref(false)
// const warningCount = ref(0) // 加入人數偵測時使用
const videoState = defineModel<'play' | 'paused'>('videoState')


onMounted(async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ video: true })
    if (video.value) {
      video.value.srcObject = stream.value
    }
    // 加入人數偵測時使用
    // toast.removeGroup('camera')
    // const blazeface = await import('@tensorflow-models/blazeface')
    // const tf = await import('@tensorflow/tfjs')
    // await tf.setBackend('webgl')  // 如果想用 CPU 可以改成 'cpu'
    // await tf.ready()
    // const modelInstance = await blazeface.load()

    await new Promise((resolve) => {
      const checkReady = () => {
        if (video.value && video.value.readyState >= 2) {
          resolve(true)
        } else {
          requestAnimationFrame(checkReady)
        }
      }
      checkReady()
    })

    // const detectFaces = async () => {
    //   if (video.value) {
    //     const predictions = await modelInstance.estimateFaces(video.value, false)
    //     model.value = predictions.length

    //     if (!visible.value) { // model.value > 1 加入人數偵測時使用
    //       stopFrame()
    //       stop.value = true
    //       visible.value = true
    //       videoState.value = 'paused'
    //     }
    //   }
    //   requestAnimationFrame(detectFaces)
    // }

    // detectFaces()

  } catch (err) {
    console.error('無法取得攝影機：', err)
    // toast.add({
    //   severity: 'warn',
    //   summary: '攝影機錯誤',
    //   detail: '無法啟動攝影機，請確認權限或設備狀態',
    //   life: 999999,
    //   group: 'camera'
    // })
  }
})

// const stopFrame = () => {
//   if (!video.value || !canvas.value) return
//   const ctx = canvas.value.getContext('2d')
//   if (!ctx) return
//   canvas.value.width = video.value.videoWidth
//   canvas.value.height = video.value.videoHeight
//   ctx.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)
// }

// const handleDialogConfirm = () => { // 加入人數偵測時使用
//   warningCount.value += 1
//   visible.value = false
//   stop.value = false
//   video.value?.play()
//   videoState.value = 'play'
//   if (warningCount.value >= 3) {
//     emit('terminate')  //結束測驗
//   }
// }
</script>
