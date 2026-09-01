<template>
  <div
    class="bg-blue text-white text-center pa-4 d-flex align-center justify-center"
    style="width: 100%; height: 100vh"
  >
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">Oops. Nothing here...</div>

      <v-btn
        class="mt-12 text-blue"
        color="white"
        variant="elevated"
        to="/"
        text="Go Home"
      ></v-btn>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound',
})
</script>