<template>
  <div>
    <h1>Index Page</h1>
    <button @click="huh(test)" />
    <TestCamera />
  </div>
</template>

<script lang="js" setup>
  const test = "Hello World"

  const huh = a => {
    console.log(a)
  }
</script>
