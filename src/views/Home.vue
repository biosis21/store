<template>
  <div class="home">

    <viewer />

    <!--<products-list />-->

    <!--<subscription-form />-->

  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import ProductsList from "@/components/ProductsList.vue";
  import SubscriptionForm from "@/components/SubscriptionForm.vue";
  import Viewer from "@/components/Viewer/index.vue";

  @Component({
    components: {
      Viewer,
      ProductsList,
      SubscriptionForm
    },
  })
  export default class Home extends Vue {
  }
</script>
