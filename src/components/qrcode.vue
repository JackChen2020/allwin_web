<template>
    <div id="qrCode" ref="qrCodeDiv"></div>
</template>

<script>
    import QRCode from 'qrcodejs2';
    export default {
        name: "qrCode",
        props:{
          url:String
        },
        data() {
            return {}
        },
        mounted: function () {
            console.log(this.url)
            this.$nextTick(function () {
                this.bindQRCode();
            })
        },
        methods: {
            bindQRCode: function () {
                new QRCode(this.$refs.qrCodeDiv, {
                    text: this.url,
                    width: 200,
                    height: 200,
                    colorDark: "#333333", //二维码颜色
                    colorLight: "#ffffff", //二维码背景色
                    correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
                })
            }
        }
    }
</script>