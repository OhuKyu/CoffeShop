<template>
  <div class="form-group">
    <label :for="id">
      <i :class="icon"></i>
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      required
      :class="{ 'error': hasError }"
    />
  </div>
</template>

<script>
export default {
  name: 'FormInput',
  props: {
    id: String,
    modelValue: String,
    icon: String,
    label: String,
    placeholder: String,
    type: {
      type: String,
      default: 'text'
    },
    hasError: Boolean
  },
  emits: ['update:modelValue']
}
</script>
