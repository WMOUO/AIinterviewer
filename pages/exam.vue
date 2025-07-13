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
      <div class="bg-gradient-to-b from-[#dfe4ea] to-[#afd1f5] p-2 h-[50%] item-center justify-center overflow-hidden">
        <video ref="interviewerVideo" :src="introduceVideo" autoplay class="w-full" />
      </div>

      <!-- 右下區域攝影機 -->
      <div class="bg-gradient-to-b from-[#afd1f5] to-[#9ccafb] p-2">
        <client-only>
        <FaceDetector
          v-model:face-count="faceCount"
          v-model:video-state="videoState"
          @terminate="endTest"/>
        </client-only>
      </div>
    </div>

    <Dialog v-model:visible="LoadingDialog" :closable="false" class="min-w-[10vw]">
      <div class="flex flex-col justify-center items-center gap-5">
        <p class="text-lg">評分中...</p>
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="6" fill="transparent" animationDuration=".9s" aria-label="Custom ProgressSpinner" />
      </div>
    </Dialog>

    <Dialog v-model:visible="FinishDialog" :closable="false">
      <div class="flex flex-col gap-0 items-center justify-center">
        <p class="text-lg">{{dialogContentChinese}}</p>
        <p>{{dialogContentEnglish}}</p>
      </div>
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
  const Reciprocal10 = '/video/reciprocal10.mp4'
  const Reciprocal60 = '/video/Reciprocal60.mp4'
  const TestIntroduce = '/video/pretest_introduce.mp4'

  const IntroduceImage = '/images/introduce_new.png'
  const IntroduceRuleImage = '/images/exam_rule_new.png'
  const IntroduceInterviewer = '/video/introduce_new.mp4'
  const IntroduceRule = '/video/rule.mp4'

  // partA 介紹
  const IntroducePartA = '/video/partA/PartA_introduce.mp4'
  const ReadyPartA = '/video/partA/PartA_ready.mp4'
  const PartAImg = '/video/partA/PartA.jpg'
  // partA 前測
  const PretestPartA = '/video/partA/PartA_pretest.mp4'
  // partA 正式測驗
  const PartATest = '/video/partA/PartA_test.mp4'

  // partB 介紹
  const IntroducePartB = '/video/partB/PartB_Introduce.mp4'
  const ReadyPartB = '/video/partB/PartB_ready.mp4'
  const PartBImg = '/video/partB/PartB.jpg'
  // partB 前測
  const PretestPartB = '/video/partB/PartB_pretest.mp4'
  // partB 正式測驗
  const PartBTest = '/video/partB/PartB_test.mp4'

  // partC 介紹
  const IntroducePartC = '/video/partC/PartC_Introduce.mp4'
  const ReadyPartC = '/video/partC/PartC_ready.mp4'
  const PartCImg = '/video/partC/PartC.jpg'
  // partC 前測
  const PretestPartC = '/video/partC/PartC_pretest.mp4'
  // partC 正式測驗
  const PartCTest = '/video/partC/PartC_test.mp4'

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
        next_part: 'end_exam',
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

  // A跟C評分
  const scoreStore = useScoreStore()
  const checkAns = (studentAns:string) => {
    const partAAnswers = ['t', 'u', 'a', 'g', 'j', 'p', 'c', 'w', 'm', 'f', 'i', 'x', 'v', 'r', 'e', 'h', 'm', 'o', 'l', 'y', 'q', 'd', 's', 'b', 'z', 'n', 'v', 'f', 'q', 'i']
    const partCAnswers = ['why', 'hot', 'black', 'rounter', 'left', 'chat', 'food', 'paper', 'cos', 'appear', 'and', 'egg', 'have', 'rain', 'by', 'vote', 'is', 'late', 'under', 'focus', 'next', 'because', 'equity', 'stock', 'case', 'of', 'profit', 'file', 'tablet', 'agent']
    const studentAnswers = studentAns
      .split('\n')
      .map((ans:string) => ans.trim())
      .filter((ans:string) => ans !== '')
    let score = 0
    if (flowTopicStep.value === 1) {
      for (let i = 0; i < studentAnswers.length; i++) {
        if (studentAnswers[i] === partAAnswers[i]) {
          score++
        }
      }
      scoreStore.setScore('partA', score)
      console.log(studentAnswers)
      console.log(score)
    }
    else if (flowTopicStep.value === 3) {
      for (let i = 0; i < studentAnswers.length; i++) {
        if (studentAnswers[i] === partCAnswers[i]) {
          score++
        }
      }
      scoreStore.setScore('partC', score)
      console.log(studentAnswers)
      console.log(score)
    }
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
        await checkAns(response.text as '')
        // 未加入錯誤處理 音檔無內容需跳錯誤
        console.log(`Audio uploaded for ${partName}`)
      } catch (err) {
        console.error('Upload error', err)
      }
    } else if(flowTopicStep.value === 3) {
      try {
        const response = await $fetch('/api/translateWord', {
          method: 'POST',
          body: formData
        })
        await checkAns(response.text as '')
        console.log(`Audio uploaded for ${partName}`)
      } catch (err) {
        console.error('Upload error', err)
      }
    }
  }

  // Dialog
  const FinishDialog = ref(false)
  const dialogContentChinese = ref('')
  const dialogContentEnglish = ref('')
  const dialogButtonLabel = ref('')
  
  const LoadingDialog = ref(false)

  const checkRound = async() => {
    LoadingDialog.value = true
    if (flowTopicStep.value === 3) {
      dialogButtonLabel.value = 'End the Test'
    }else {
      dialogButtonLabel.value = `Start ${playList.value[flowTopicStep.value+1].name}`
    }

    if (flowTopicStep.value === 0) {
      dialogContentChinese.value = '測驗介紹已完成'
      dialogContentEnglish.value = 'The test introduction has been completed.'
    } else if (flowTopicStep.value === 1) {
      dialogContentChinese.value = `Part A 已完成`
      dialogContentEnglish.value = `Part A has been completed.`
    } else if (flowTopicStep.value === 2) {
      dialogContentChinese.value = `Part B 已完成`
      dialogContentEnglish.value = `Part B has been completed.`
    } else {
      dialogContentChinese.value = `Part C 已完成`
      dialogContentEnglish.value = `Part C has been completed.`
    }
    
    if (flowTopicStep.value !== 0) {
      const audioBlob = await stopRecording()
      await uploadAudio(audioBlob, playList.value[flowTopicStep.value].name)
    }
    LoadingDialog.value = false
    FinishDialog.value = true
  }
  
  // 轉下一個part
  const nextRound = async() => {
    FinishDialog.value= false
    if (flowTopicStep.value === playList.value.length - 1) {
      router.push('/endexam')
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
    router.push('/endexam')
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