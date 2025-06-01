<template>
  <div class="flex flex-row h-screen w-full">
    <!-- 左邊區域 -->
    <div class="w-[90%] flex items-center justify-center bg-[#f4f4f4] p-3">
      <img v-if="!imgSwitchVideo" :src="`${imgList[imgFlow]}`" class="w-full h-auto object-cover">
      <video v-else :src="`${videoList[videoFlow]}`" autoplay class="w-full h-auto object-cover" />
    </div>

    <!-- 右邊區域 -->
    <div class="flex flex-col w-[50%] h-screen">

      <!-- 右上區域AI -->
      <div class="bg-[#d4e2ff] p-2 h-[50%] item-center justify-center overflow-hidden">
        <video ref="interviewerVideo" :src="`${interviewerList[interviewerFlow]}`" autoplay class="w-full" />
      </div>

      <!-- 右下區域攝影機 -->
      <div class="bg-[#ffefdb] p-2">
        <client-only>
        <FaceDetector />
        </client-only>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
  //import { useToast } from 'primevue/usetoast';

  import IntroduceImage from '~/assets/images/introduce.png'
  import Introduce2Image from '~/assets/images/introduce2.png'
  import IntroduceInterviewer from '~/assets/video/interviewer_introduce.mp4'
  import IntroduceRule from '~/assets/video/rule_introduce.mp4'
  import PartAImage from '~/assets/images/partA.png'
  import PartAVideo from '~/assets/video/partA.mp4'
  import Reciprocal10 from '~/assets/video/reciprocal10.mp4'
  import PartAtest from '~/assets/video/PartAtest.mp4'
  import Reciprocal60 from '~/assets/video/Reciprocal60.mp4'
  import AIpartready from '~/assets/video/AIpartready.mp4'
  import readyvideo from '~/assets/video/readyvideo.mp4'
  import PartBready from '~/assets/video/PartBready.mp4'
  import AIPartB1 from '~/assets/video/AIPartB1.mp4'
  import AIPartC1 from '~/assets/video/AIPartC1.mp4'
  import PartB from '~/assets/video/PartB.mp4'
  import PartBtest from '~/assets/video/PartBtest.mp4'
  import PartCready from '~/assets/video/PartCready.mp4'
  import PartC from '~/assets/video/PartC.mp4'
  import PartCtest from '~/assets/video/PartCtest.mp4'
  import FaceDetector from '~/components/FaceDetector.vue'
  import { peopleCount } from '@/utils/shared'

  //const video = ref<HTMLVideoElement | null>(null)
  const interviewerVideo = ref<HTMLVideoElement | null>(null)
  const imgFlow = ref(0)
  const videoFlow = ref(-1)
  const interviewerFlow = ref(0)

  const imgList = ref([IntroduceImage,Introduce2Image,PartAImage])
  const videoList = ref([PartAVideo,readyvideo,PartAtest,PartBready,PartB,readyvideo,PartBtest,PartCready,PartC,readyvideo,PartCtest])
  const interviewerList = ref([IntroduceInterviewer,IntroduceRule,Reciprocal10,AIpartready,Reciprocal60,AIPartB1,Reciprocal10,AIpartready,Reciprocal60,AIPartC1,Reciprocal10,AIpartready,Reciprocal60])

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
        } else if (interviewerFlow.value === 3){
          // 測驗正式開始
          interviewerFlow.value ++
          imgSwitchVideo.value = true
          videoFlow.value ++
        } else if (interviewerFlow.value === 4){
          // PartB規則
          interviewerFlow.value ++
          videoFlow.value ++
        } else if (interviewerFlow.value === 5){
          // PartB測驗測試
          interviewerFlow.value ++
          videoFlow.value ++
        } else if (interviewerFlow.value === 6){
          // PartB測驗測試結束換準備正式測驗
          interviewerFlow.value ++
          videoFlow.value ++
        } else if (interviewerFlow.value === 7){
          // 測驗正式開始
          interviewerFlow.value ++
          videoFlow.value ++
        } else if (interviewerFlow.value === 8){
          // PartC規則
          interviewerFlow.value ++
          videoFlow.value ++
        } else if (interviewerFlow.value === 9){
          // PartC測驗測試
          interviewerFlow.value ++
          videoFlow.value ++
        } else if (interviewerFlow.value === 10){
          // PartC測驗測試結束換準備正式測驗
          interviewerFlow.value ++
          videoFlow.value ++
        } else if (interviewerFlow.value === 11){
          // 測驗正式開始
          interviewerFlow.value ++
          videoFlow.value ++
        } else if (interviewerFlow.value === 12){
          // 測驗正式開始
          interviewerFlow.value ++
          videoFlow.value ++
        }
      })
    }
    watch(peopleCount, (newCount) => {
      if (newCount > 1 && interviewerVideo.value) {
      interviewerVideo.value.pause()
    }
})

})
</script>