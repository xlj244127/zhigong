<template>
    <div class="resetTitle">
      {{resetTitle}}
    </div>
</template>

<script>
    export default {
        name: "",
      props:['resetTitle'],
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style lang="scss" type="text/scss" scoped>
.resetTitle{
  font-size: 16px;
  line-height: 6;
  text-align: center;
  color: #666;
}
</style>
