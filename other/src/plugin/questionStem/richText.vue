<template>
    <span class="richTextContainer" :class="{'richText_html': showType || showLowerType}" v-html="strToUrlCmelement(stem)"></span>
</template>

<script>
export default {
    name: 'richText',
    props: {
        stem: {
            type: String,
            default: ''
        },
        showType: {
            type: Boolean,
            default: false
        },
        showLowerType: {
            type: Boolean,
            default: false
        }
    },
}
</script>

<style lang="less">
.richTextContainer {
    display: inline-block;
    line-height: initial;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 16px;
    // color: #3C3C3C;
    span {
        // font-size: 16px;
        // color: #3C3C3C;
    }
    p {
        font-size: 16px;
        // color: #3C3C3C;
    }
    /deep/ span {
        //font-size: 16px;
    }
    /deep/ p {
        font-size: 16px;
        margin: 0;
    }
    /deep/ img {
        vertical-align: middle;
    }
    
}


.richTextContainer_html {
    text-indent: 50px;
}

@media screen and (min-width: 760px) and (max-width: 850px) {
    /deep/ .richTextContainer {
        span {
            // font-size: 24px;
        }
        /deep/ .content_body {
            font-size: 24px;
            p,div {
                font-size: 24px;
            }
        }
    }
}
@media screen and (min-width: 850px) and (max-width: 1280px) {
    /deep/ .richTextContainer {
        span {
            //font-size: 19px;
        }
        .content_body {
            font-size: 19px;
            p,div {
                font-size: 19px;
            }
        }
    }
}
</style>