<template>
  <label class="file-select">
    <div class="select-button" onmouseover="this.style.background='gray';" onmouseout="this.style.background='black';">
      <span class="q-pa-xl" v-if="value">{{value.name}}</span>
      <span class="q-pa-xl" v-else>Select File</span>
    </div>
    <input type="file" @change="handleFileChange"/>
  </label>
</template>

<script>
export default {
  props: {
    value: File
  },

  methods: {
    handleFileChange (e) {
      this.$emit('input', e.target.files[0])
    }
  }
}
</script>

<style scoped>
.file-select > .select-button {
  padding: .12rem;

  color: white;
  background-color: black;

  border-radius: .3rem;
  border-style: solid;
  text-align: center;
  font-weight: bold;
}

.file-select > input[type="file"] {
  display: none;
}
</style>
