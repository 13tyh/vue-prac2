<script setup>
/**
 * フォーム用ラベル（for で入力欄と紐付け）
 */
defineProps({
  for: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <label :for="for" class="label">
    <slot />
  </label>
</template>

<style scoped>
.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--form-label);
  margin-bottom: 0.375rem;
  letter-spacing: 0.02em;
}
</style>
