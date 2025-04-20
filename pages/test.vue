<template>
  <div class="flex flex-row h-screen w-full">
    <!-- 左邊區域 -->
    <div class="w-[90%] flex items-center justify-center bg-[#f4f4f4] p-3">
      <img v-if="!imgSwitchVideo" :src="`${imgList[imgFlow]}`" class="w-full h-auto object-cover">
      <video v-else :src="`${videoList[videoFlow]}`" autoplay class="w-full h-auto object-cover" />
    </div>

    <!-- 右邊區域 -->
    <div class="flex flex-col w-[50%] h-screen">

      <!-- 右上區域 -->
      <div class="bg-[#d4e2ff] p-2 h-[50%] item-center justify-center overflow-hidden">
        <video ref="interviewerVideo" :src="`${interviewerList[interviewerFlow]}`" autoplay class="w-full" />
      </div>

      <!-- 右下區域 -->
      <div class="bg-[#ffefdb] p-2">
        
        <video ref="video" autoplay playsinline class="w-full h-full transform scale-x-[-1]" />
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
  import { useToast } from 'primevue/usetoast';

  import IntroduceImage from '~/assets/images/introduce.png'
  import Introduce2Image from '~/assets/images/introduce2.png'
  import IntroduceInterviewer from '~/assets/video/interviewer_introduce.mp4'
  import IntroduceRule from '~/assets/video/rule_introduce.mp4'
  import PartAImage from '~/assets/images/partA.png'
  import PartAVideo from '~/assets/video/partA.mp4'
  import Reciprocal10 from '~/assets/video/reciprocal10.mp4'
  import PartAtest from '~/assets/video/PartAtest.mp4'
  import Reciprocal60 from '~/assets/video/Reciprocal60.mp4'
  import readyai from '~/assets/video/readyai.mp4'
  import readyvideo from '~/assets/video/readyvideo.mp4'

  const toast = useToast();
  const video = ref<HTMLVideoElement | null>(null)
  const interviewerVideo = ref<HTMLVideoElement | null>(null)
  const imgFlow = ref(0)
  const videoFlow = ref(-1)
  const interviewerFlow = ref(0)

  const imgList = ref([IntroduceImage,Introduce2Image,PartAImage])
  const videoList = ref([PartAVideo,readyvideo,PartAtest])
  const interviewerList = ref([IntroduceInterviewer,IntroduceRule,Reciprocal10,readyai,Reciprocal60])

  const imgSwitchVideo = ref(false)

  onMounted(async () => {
    if (interviewerVideo.value) {
      interviewerVideo.value.addEventListener('ended', () => {
        if (interviewerFlow.value === 0) {
          // interviewer介紹完換介紹測驗規則
          interviewerFlow.value ++
          imgFlow.value ++
        } else if(interviewerFlow.value === 1) {
          // 規則介紹結束換測驗測試
          interviewerFlow.value ++
          imgSwitchVideo.value = true
          videoFlow.value ++
        } else if (interviewerFlow.value === 2){
          // 測驗測試結束換準備正式測驗
          interviewerFlow.value ++
          imgSwitchVideo.value = true
          videoFlow.value ++
        }else if (interviewerFlow.value === 3){
          // 測驗正式開始
          interviewerFlow.value ++
          imgSwitchVideo.value = true
          videoFlow.value ++
        }
      })
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if(video.value !== null) {
          video.value.srcObject = stream
        }
        toast.removeGroup('camera')
    } catch (err) {
        console.error('無法取得攝影機：', err)
        toast.add({
          severity: 'success',
          summary: '登入成功',
          detail: '歡迎回來！',
          life: 999999,
          group: 'cameraNotPrepare'
        });
    }
  })
</script>