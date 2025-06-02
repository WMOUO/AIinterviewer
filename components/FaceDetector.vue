<template>
  <div class="relative">
    <video ref="video" autoplay playsinline class="w-full h-full transform scale-x-[-1]" v-show="!stop" />
    <canvas ref="canvas" class="absolute top-0 left-0 w-full h-full" v-show="stop" />
    
    <Dialog 
      v-model:visible="visible"
      :closable="false"
      :dismissableMask="false"
      :closeOnEscape="false"
      header="警告" :style="{ width: '25rem', height: '11rem' }">
      <p class="text-center">
        {{ warningCount < 2 ? `出現一人以上，警告3次將終止測驗，目前 ${warningCount+1} 次` : '警告3次，測驗即將終止' }}
      </p>
      <div class="flex justify-end gap-2">
        <Button type="button" label="確認" @click="handleDialogConfirm" />
      </div>
    </Dialog>

    <Toast position="bottom-center" group="camera" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Dialog from 'primevue/dialog'

//傳人數到test
const model = defineModel<number>('faceCount')
const emit = defineEmits(['terminate'])

const video = ref<HTMLVideoElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const stream = ref<MediaStream | null>(null)

const toast = useToast()
const visible = ref(false)
const stop = ref(false)
const warningCount = ref(0)
const videoState = defineModel<'play' | 'paused'>('videoState')


onMounted(async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ video: true })
    if (video.value) {
      video.value.srcObject = stream.value
    }

    toast.removeGroup('camera')

    const blazeface = await import('@tensorflow-models/blazeface')
    const tf = await import('@tensorflow/tfjs')
    const modelInstance = await blazeface.load()

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

    const detectFaces = async () => {
      if (video.value) {
        const predictions = await modelInstance.estimateFaces(video.value, false)
        model.value = predictions.length

        if (model.value > 1 && !visible.value) {
          stopFrame()
          stop.value = true
          visible.value = true
          videoState.value = 'paused'
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

const stopFrame = () => {
  if (!video.value || !canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return
  canvas.value.width = video.value.videoWidth
  canvas.value.height = video.value.videoHeight
  ctx.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)
}

const handleDialogConfirm = () => {
  warningCount.value += 1
  visible.value = false
  stop.value = false
  video.value?.play()
  videoState.value = 'play'
  if (warningCount.value >= 3) {
    emit('terminate')  //結束測驗
  }
}
</script>
