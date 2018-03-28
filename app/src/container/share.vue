<template>
  <div>share</div>
</template>

<script>
export default {
  name: 'share',
  mounted () {
    const url = window.location.href.split('#')[0]
    this.wxShare({
      title: '分享标题测试', // 分享标题
      desc: '分享描述测试', // 分享描述
      link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: 'http://os6x9ewy1.bkt.clouddn.com/icon_5.png', // 分享图标
      success: (mes) => {
        console.log(mes)
        alert(mes.desc)
      },
      cancel: (mes) => {
        console.log(mes)
        alert(mes.desc)
      }
    })
  }
}
</script>

<style>
</style>
