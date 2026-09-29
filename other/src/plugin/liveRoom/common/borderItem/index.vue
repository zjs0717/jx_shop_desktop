<template>
    <div 
        class="borderItem" 
        :class="{'offBorder': offBorder}"
        :style="{
        '--borderColor': borderColor,
        '--cornerColor': cornerColor,
        '--backgroundColor': backgroundColor,
        '--width': width,
        '--cornerWidth': cornerWidth,
        '--cornerHeight': cornerHeight,
    }">
        <div class="borderItem-container" :class="{'borderItem-content': showOtherCorner}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'cm-border-item',
    props: {
        // 边框颜色
        borderColor: {
            type: String,
            default: 'rgba(255, 210, 0, 0.5)'
        },
        // 边框圆角颜色
        cornerColor: {
            type: String,
            default: '#09153D'
        },
        // 背景颜色
        backgroundColor: {
            type: String,
            default: '#09153D'
        },
        // 是否关闭边框
        offBorder: {
            type: Boolean,
            default: false
        },
        // 宽度
        width: {
            type: String | Number,
            default: '100%'
        },
        // 是否剩余角落改良边框圆角
        showOtherCorner: {
            type: Boolean,
            default: false 
        },
        // 边框圆角宽度
        cornerWidth: {
            type: String | Number,
            default: '0.06rem' 
        },
        // 边框圆角高度
        cornerHeight: {
            type: String | Number,
            default: '0.06rem' 
        },

    }
}
</script>

<style lang="less" scoped>
    .borderItem {
        height: 100%;
        width: var(--width);
        border: 1px solid var(--borderColor);
        background-color: var(--backgroundColor);
        position: relative;
        box-sizing: border-box;
        &::before, &::after {
            content: '';
            position: absolute;
            width: var(--cornerWidth);
            height: var(--cornerHeight);
            border: 1px solid var(--cornerColor);  /* 高亮颜色与原图边框一致 */
        }

        &::before {
            top: -1px;
            left: -1px;
            border-right: none;
            border-bottom: none;
        }
        &::after {
            bottom: -1px;
            right: -1px;
            border-left: none;
            border-top: none;
        }
        .borderItem-container {
            height: 100%;
            width: 100%;
        }
        .borderItem-content {
            height: 100%;
            width: 100%;
            &::before, &::after {
                content: '';
                position: absolute;
                width: var(--cornerWidth);
                height: var(--cornerHeight);
                border: 1px solid var(--cornerColor);  /* 高亮颜色与原图边框一致 */
            }

            &::before {
                top: -1px;
                right: -1px;
                border-left: none;
                border-bottom: none;
            }
            &::after {
                bottom: -1px;
                left: -1px;
                border-right: none;
                border-top: none;
            }
        }
    }
    .offBorder {
        border: none;
        &::before, &::after {
            display: none;
        }
    }
</style>