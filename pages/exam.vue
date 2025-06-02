<template>
  <div class="flex flex-row h-screen w-full">
    <!-- 左邊區域 -->
    <div class="w-[90%] flex items-center justify-center bg-[#f4f4f4] p-3">
      <img v-if="!isVideo" :src="examVideo" class="w-full h-auto object-cover">
      <video v-else  ref="testvideo" :src="examVideo" autoplay class="w-full h-auto object-cover" />
    </div>

    <!-- 右邊區域 -->
    <div class="flex flex-col w-[50%] h-screen">

      <!-- 右上區域AI -->
      <div class="bg-[#d4e2ff] p-2 h-[50%] item-center justify-center overflow-hidden">
        <video ref="interviewerVideo" :src="introduceVideo" autoplay class="w-full" />
      </div>

      <!-- 右下區域攝影機 -->
      <div class="bg-[#ffefdb] p-2">
        <client-only>
        <FaceDetector
        v-model:face-count="faceCount"
        v-model:video-state="videoState"
        @terminate="endTest"/>
        </client-only>
      </div>
    </div>
    <Dialog v-model:visible="FinishDialog" :closable="false">
      <p>該測驗部分已完成</p>
      <template #footer>
        <div class="flex w-full justify-center items-center">
          <Button type="button" :label="dialogButtonLabel" @click="nextRound()" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  //import { useToast } from 'primevue/usetoast';

  //通用
  import Reciprocal10 from '~/assets/video/reciprocal10.mp4'
  import Reciprocal60 from '~/assets/video/Reciprocal60.mp4'
  import TestIntroduce from '~/assets/video/pretest_Introduce.mp4'

  import IntroduceImage from '~/assets/images/introduce.png'
  import IntroduceRuleImage from '~/assets/images/exam_rule.png'
  import IntroduceInterviewer from '~/assets/video/introduce.mp4'
  import IntroduceRule from '~/assets/video/rule.mp4'

  // partA介紹
  import IntroducePartA from '~/assets/video/partA/partA_introduce.mp4'
  import ReadyPartA from '~/assets/video/partA/partA_ready.mp4'
  import PartAImg from '~/assets/video/partA/partA.jpg'
  // partA前測
  import PretestPartA from '~/assets/video/partA/PartA_pretest.mp4'
  // partA正式測驗
  import PartATest from '~/assets/video/partA/PartA_test.mp4'

  // partB介紹
  import IntroducePartB from '~/assets/video/partB/partB_introduce.mp4'
  import ReadyPartB from '~/assets/video/partB/partB_ready.mp4'
  import PartBImg from '~/assets/video/partB/partB.jpg'
  // partB前測
  import PretestPartB from '~/assets/video/partB/PartB_pretest.mp4'
  // partB正式測驗
  import PartBTest from '~/assets/video/partB/PartB_test.mp4'

  // partC介紹
  import IntroducePartC from '~/assets/video/partC/partC_introduce.mp4'
  import ReadyPartC from '~/assets/video/partC/partC_ready.mp4'
  import PartCImg from '~/assets/video/partC/partC.jpg'
  // partC前測
  import PretestPartC from '~/assets/video/partC/PartC_pretest.mp4'
  // partC正式測驗
  import PartCTest from '~/assets/video/partC/PartC_test.mp4'

  // 測驗流程
  const playList = ref([{
      name: 'interviewer',
      content:[
          {
            step: 0,
            exam_image: IntroduceImage,
            exam_video: '',
            introduce_video:IntroduceInterviewer,
            next: 1,
          },
          {
            step: 1,
            exam_image: IntroduceRuleImage,
            exam_video: '',
            introduce_video:IntroduceRule,
            next: -1,
          },
        ],
        next_part: 'partA',
        next_order: 1
      },
      {
      name: 'partA',
      content: [
          {
            step: 0,
            exam_image: '',
            exam_video:ReadyPartA,
            introduce_video:IntroducePartA,
            next: 1,
          },
          {
            step: 1,
            exam_image: '',
            exam_video:PretestPartA,
            introduce_video:Reciprocal10,
            next: 2,
          },
          {
            step: 2,
            exam_image: PartAImg,
            exam_video: '', // 待修改
            introduce_video:TestIntroduce,
            next: 3,
          },
          {
            step: 3,
            exam_image: '',
            exam_video:PartATest,
            introduce_video:Reciprocal60,
            next: -1,
          },
        ],
        next_part: 'partB',
        next_order: 2
      },
      {
      name: 'partB',
      content: [
          {
            step: 0,
            exam_image: '',
            exam_video:ReadyPartB,
            introduce_video:IntroducePartB,
            next: 1,
          },
          {
            step: 1,
            exam_image: '',
            exam_video:PretestPartB,
            introduce_video:Reciprocal10,
            next: 2,
          },
          {
            step: 2,
            exam_image: PartBImg,
            exam_video: '',
            introduce_video:TestIntroduce,
            next: 3,
          },
          {
            step: 3,
            exam_image: '',
            exam_video:PartBTest,
            introduce_video:Reciprocal60,
            next: -1,
          },
        ],
        next_part: 'partC',
        next_order: 3
      },
      {
      name: 'partC',
      content: [
          {
            step: 0,
            exam_image: '',
            exam_video:ReadyPartC,
            introduce_video:IntroducePartC,
            next: 1,
          },
          {
            step: 1,
            exam_image: '',
            exam_video:PretestPartC,
            introduce_video:Reciprocal10,
            next: 2,
          },
          {
            step: 2,
            exam_image: PartCImg,
            exam_video:'',
            introduce_video:TestIntroduce,
            next: 3,
          },
          {
            step: 3,
            exam_image: '',
            exam_video:PartCTest,
            introduce_video:Reciprocal60,
            next: -1,
          },
        ],
        next_part: 'end_test',
        next_order: 4
      },
    ]) 
  
  // 流程控制
  const interviewerVideo = ref<HTMLVideoElement | null>(null)
  const isVideo = ref(false)
  const testvideo = ref<HTMLVideoElement | null>(null)

  // 影片播放控制
  const flowTopicStep = ref<number>(0)
  const flowIndexStep  = ref<number>(0)
  const examVideo = ref<string>(playList.value[flowTopicStep.value].content[flowIndexStep.value].exam_image)
  const introduceVideo = ref<string>(playList.value[flowTopicStep.value].content[flowIndexStep.value].introduce_video)

  // 錄音控制
  const mediaRecorder = ref<MediaRecorder | null>(null)
  const audioChunks = ref<Blob[]>([])
  const isRecording = ref(false)

  // 開始錄音
  const startRecording = async () => {
    if (isRecording.value) return
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    audioChunks.value = []
    recorder.ondataavailable = (e) => {
      audioChunks.value.push(e.data)
    }
    recorder.start()
    mediaRecorder.value = recorder
    isRecording.value = true
    console.log('開始錄音')
  }

  // 停止錄音，回傳 Blob
  const stopRecording = (): Promise<Blob> => {
    console.log('停止錄音')
    return new Promise((resolve) => {
      if (!mediaRecorder.value) return resolve(new Blob())
      mediaRecorder.value.onstop = () => {
        const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' })
        isRecording.value = false
        resolve(audioBlob)
      }
      mediaRecorder.value.stop()
    })
  }

  // call gemini語音轉文字api
  const uploadAudio = async (audioBlob: Blob, partName: string) => {
    const formData = new FormData()
    formData.append('audio', audioBlob, `${partName}.webm`)
    if (flowTopicStep.value === 1){
      try {
        const response = await $fetch('/api/translateLetter', {
          method: 'POST',
          body: formData
        })
        console.log(`Audio uploaded for ${partName}`)
        console.log('Gemini 回傳內容：', response.text);
      } catch (err) {
        console.error('Upload error', err)
      }
    } else if(flowTopicStep.value === 3) {
      try {
        const response = await $fetch('/api/translateWord', {
          method: 'POST',
          body: formData
        })
        console.log(`Audio uploaded for ${partName}`)
        console.log('Gemini 回傳內容：', response.text);
      } catch (err) {
        console.error('Upload error', err)
      }
    }
  }

  // Dialog
  const FinishDialog = ref(false)
  const dialogButtonLabel = ref('')
  
  const checkRound = async() => {
    FinishDialog.value = true
    if (flowTopicStep.value === 3) {
      dialogButtonLabel.value = '結束測驗'
    }else {
      dialogButtonLabel.value = `開始${playList.value[flowTopicStep.value+1].name}`
    }
    if (flowTopicStep.value !== 0) {
      const audioBlob = await stopRecording()
      await uploadAudio(audioBlob, playList.value[flowTopicStep.value].name)
    }
  }
  
  // 轉下一個part
  const nextRound = async() => {
    FinishDialog.value= false
    if (flowTopicStep.value === playList.value.length - 1) {
      router.push('/endtest')
      return
    }
    flowTopicStep.value += 1
    flowIndexStep.value = 0
    playVideo()
  }
  
  // 播放影片
  const playVideo = () => {
    const index = playList.value[flowTopicStep.value].content[flowIndexStep.value]
    // 判斷是影片還是相片
    if ( index.exam_image !== '') {
      isVideo.value = false
      examVideo.value = index.exam_image
    } else {
      isVideo.value = true
      examVideo.value = index.exam_video
    }
    console.log(index.exam_image)
    introduceVideo.value = index.introduce_video
  }

  const controlVideo = async() => {
    if ( playList.value[flowTopicStep.value].content[flowIndexStep.value].next === -1 ) {
      checkRound()
    } else {
      flowIndexStep.value += 1
    }
    playVideo()
  }


  const faceCount = ref(0)
  const router = useRouter()

  const endTest = () => {
    alert('偵測三次違規，測驗終止')
    router.push('/endtest')
  }

  onMounted(async () => {
    if (interviewerVideo.value !== null) {
      interviewerVideo.value.addEventListener('ended',controlVideo)
    }
  })

  //影片撥放停止
  const videoState = ref<'play' | 'paused'>('play')
  watch(videoState, (state) => {
    if (state === 'paused') {
      interviewerVideo.value?.pause()
      testvideo.value?.pause()
    } else if (state === 'play') {
      interviewerVideo.value?.play()
      testvideo.value?.play()
    }
  })

  watch(flowIndexStep, async(oldVal,newVal) => {
    if (flowIndexStep.value === 3) {
      await startRecording()
    }
  })
</script>