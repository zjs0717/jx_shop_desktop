<template>
    <div class="videoDom">

      <cm-video 
          ref="cmVideo"
          preload="none"
          src="http://qn-slice.resource.e-eduspace.com/02/01c23d83d19f4edab85926796c62c704/01c23d83d19f4edab85926796c62c704.m3u8"
          fallbackSrc="http://qn-video.resource.e-eduspace.com/02/3d1804ad44b44e088bb4fcda4525ce49.mp4"
          height="450px"
          width="100%"
          @error="handleError"
          @fatalError="handleHlsError"
          @ready="ready">
          
      </cm-video>
    </div>
</template>

<script>
export default {
    name: 'VideoPage',
    methods: {
        ready(player) {
            console.log('播放器已准备好:', player);
        },
        handleError(error) {
            console.error('播放器错误:', error);
        },
        handleHlsError(error) {
            console.error('HLS 错误:', error);
        },
    }
}
</script>