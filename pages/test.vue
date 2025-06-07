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
          <Button type="button" label="繼續" @click="nextRound()" />
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
  // partA前測
  import PretestPartA from '~/assets/video/partA/PartA_pretest.mp4'
  // partA正式測驗
  import PartATest from '~/assets/video/partA/PartA_test.mp4'

  // partB介紹
  import IntroducePartB from '~/assets/video/partB/partB_introduce.mp4'
  import ReadyPartB from '~/assets/video/partB/partB_ready.mp4'
  // partB前測
  import PretestPartB from '~/assets/video/partB/PartB_pretest.mp4'
  // partB正式測驗
  import PartBTest from '~/assets/video/partB/PartB_test.mp4'

  // partB介紹
  import IntroducePartC from '~/assets/video/partC/partC_introduce.mp4'
  import ReadyPartC from '~/assets/video/partC/partC_ready.mp4'
  // partB前測
  import PretestPartC from '~/assets/video/partC/PartC_pretest.mp4'
  // partB正式測驗
  import PartCTest from '~/assets/video/partC/PartC_test.mp4'

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
        next_part: 'part_A',
        next_order: 1
      },
      {
      name: 'part_A',
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
            exam_image: '',
            exam_video:IntroducePartA, // 待修改
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
        next_part: 'part_B',
        next_order: 2
      },
      {
      name: 'part_B',
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
            exam_image: '',
            exam_video:IntroducePartB,
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
        next_part: 'part_C',
        next_order: 3
      },
      {
      name: 'part_C',
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
            exam_image: '',
            exam_video:IntroducePartC,
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

  const interviewerVideo = ref<HTMLVideoElement | null>(null)
  const isVideo = ref(false)
  const testvideo = ref<HTMLVideoElement | null>(null)
  
  const FinishDialog = ref(false)

  // 影片播放控制
  const flowTopicStep = ref<number>(0) //測試1
  const flowIndexStep  = ref<number>(0) //測試3
  const examVideo = ref<string>(playList.value[flowTopicStep.value].content[flowIndexStep.value].exam_image)
  const introduceVideo = ref<string>(playList.value[flowTopicStep.value].content[flowIndexStep.value].introduce_video)

  const checkRound = async() => {
    FinishDialog.value = true
    
  }

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

  const playVideo = () => {
    const index = playList.value[flowTopicStep.value].content[flowIndexStep.value]
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
      if (flowTopicStep.value === 0) {
        await nextRound()
      }else{
        checkRound()
      }
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
</script>