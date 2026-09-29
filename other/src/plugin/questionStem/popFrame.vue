vue
<template>
    <el-dialog
        :modal-append-to-body="modalAppendToBody"
        :close-on-press-escape="false"
        :close-on-click-modal="closeOnClickmodal"
        :show-close="false"
        class="popFrame"
        top="0"
        :visible.sync="isPopFrame"
        @closed="closeHandler">
        <div 
            class="popFrame_body" 
            @click="clickArbitrary && (isPopFrame = false)"
            >
            <slot>
            </slot>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'cm-pop-frame',
    props: {
        // 弹框控制条件
        isPopup: {
            type: Boolean,
            default: false
        },
        // 是否可以通过点击 modal 关闭 Dialog	
        closeModal: {
            type: Boolean,
            default: false
        },
        // 是否点击任意位置 关闭 Dialog	
        clickArbitrary: {
            type: Boolean,
            default: false
        },
        // 遮罩层是否插入至 body 元素上
        modalAppendToBody: {
            type: Boolean,
            default: false
        },

    },
    computed: {
        // 点击 modal 关闭 Dialog 控制条件
        closeOnClickmodal() {
            return this.closeModal || this.clickArbitrary
        }
    },
    data() {
        return {
            isPopFrame: false, // 弹框控制条件
        }
    },
    watch: {
        // 监听父级控制条件的改变
        isPopup: {
            handler(val) {
                this.isPopFrame = val;
            },
            immediate: true
        },
        // 监听组件控制条件的改变
        isPopFrame: {
            handler(val) {
                if(!val) {
                    this.$emit('update:isPopup', false)
                }
            },
            immediate: true
        }
    },
    created() {},
    mounted() {},
    methods: {

        /**
         *  Dialog 关闭动画结束时的回调	
         */
        closeHandler() {
            this.$emit('closed', true);
        }
    }
    
}
</script>

<style lang="scss" scoped>

.popFrame {
    /deep/ .el-dialog {
        margin: 0;
        margin-top: 0px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: transparent;
        box-shadow: none;
        width: fit-content;
        
        .el-dialog__header {
            display: none;
        }
        .el-dialog__body {
            padding: 0;
        }
    }
}

</style>