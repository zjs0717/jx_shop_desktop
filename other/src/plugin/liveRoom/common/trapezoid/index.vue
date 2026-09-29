<template>
    <div 
      class="trapezoid"
      :style="trapezoidStyle"
    >
      <slot></slot>
    </div>
  </template>
  
  <script>
  export default {
    name: 'trapezoid',
    props: {
      // 左侧宽度（rem）
      leftWidth: {
        type: Number | String,
        default: 0.5
      },
      // 右侧宽度（rem）
      rightWidth: {
        type: Number | String,
        default: 2
      },
      // 高度（rem）
      height: {
        type: Number | String,
        default: 1
      },
      // 背景颜色
      color: {
        type: String,
        default: '#3498db'
      },
      // 倾斜角度（度数）
      skewAngle: {
        type: Number | String,
        default: 15
      },
      clipPath: {
        type: String,
        default: 'polygon(100% 0, 100% 100%, 0% 80%, 0 20%)' // 初始裁剪路径
      }
    },
    computed: {
      trapezoidStyle() {
        const { leftWidth, rightWidth, height, color, skewAngle, clipPath } = this
        const angleRad = skewAngle * Math.PI / 180
        
        return {
          width: `${rightWidth}rem`,
          height: `${height}rem`,
          backgroundColor: color,
          transform: `
            perspective(1000px)
            rotateY(${angleRad}rad)
            translateZ(${-rightWidth/2}rem)
          `,
          transformOrigin: 'right center',
          position: 'relative',
          overflow: 'hidden',
          'clip-path': clipPath
        }
      }
    }
  }
  </script>
  
  <style scoped>
  /* 可选悬停动画 */
  .trapezoid {
    transition: transform 0.3s ease;
  }
  
  .trapezoid:hover {
    transform: perspective(10rem) rotateY(-10deg) translateZ(0);
  }
  </style>