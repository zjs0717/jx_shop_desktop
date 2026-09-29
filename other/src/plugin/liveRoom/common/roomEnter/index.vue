<template>
    <div class="roomEnter"
        @mousedown="enterClickMousedown(false)"
		@mouseup="enterClickMouseup(false)"
        v-dragDirective
        :style="{ 
            right: position.right , 
            top: position.top,
            width: size.width,
            height: size.height,
        }">
    </div>
</template>

<script>
export default {
    props: {
        // 位置属性
        position: {
            type: Object,
            default: () => ({ 
                right: '0', 
                top: '1rem'
            }),
        },

        // 宽高
        size: {
            type: Object,
            default: () => ({
                width: '0.80rem', 
                height: '0.84rem', 
            }),
        },
    },
    data() {
        return {
            clickDownUpTime: 0, // 点击按下和抬起的时间间隔，300ms内为点击，否则为拖拽
        };
    },
    methods: {
        enterClickMousedown() {
            this.clickDownUpTime = new Date().getTime();
        },
        enterClickMouseup(){
            let time = new Date().getTime();
			if (time - this.clickDownUpTime < 300) {
				this.clickDownUpTime = 0;
				this.$emit('enterClick');
			}
        }
    },
};
</script>

<style scoped lang="less">
.roomEnter {
    position: fixed;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('../../../static/img/roomIcon/liveRoom.png') no-repeat center center;
    background-size: cover;
    // transition: width 0.3s ease;
    transition: width 0.3s ease, height 0.3s ease;
    z-index: 9999;
    &:hover {
        width: 0.88rem!important;
        height: 0.92rem!important;
        // transform: scale(1.1);
    }
}

</style>