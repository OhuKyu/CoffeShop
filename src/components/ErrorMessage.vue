<template>
  <p class="error-message">
    <i class="fas fa-exclamation-circle"></i>
    {{ message }}
  </p>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    message: String
  }
}
</script>
