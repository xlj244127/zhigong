<template>
  <!-- App -->
  <div id="app">
    <!-- Main Views -->
    <f7-views>
      <f7-view id="main-view" main>
        <f7-pages>
            <!--<home></home>-->
        </f7-pages>
      </f7-view>
    </f7-views>
  </div>
</template>

<script type="text/ecmascript-6">
    import home from './pages/Home.vue'
    export default {
        data() {
            return {

            }
        },
        components: {
            home
        },
        mounted() {

        },
        methods: {
        }
    }
</script>
