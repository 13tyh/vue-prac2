<script setup>
/**
 * フォーム項目のラッパー
 * ラベル・入力エリア（スロット）・エラーメッセージをまとめて表示する。
 */
import Label from './Label.vue'

defineProps({
  label: {
    type: String,
    default: '',
  },
  htmlFor: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div class="form-group">
    <Label v-if="label" :for="htmlFor">
      <slot name="label">{{ label }}</slot>
    </Label>
    <div class="form-group__input">
      <slot />
    </div>
    <p v-if="error" class="form-group__error" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: 1.25rem;
}

.form-group:last-of-type {
  margin-bottom: 1.5rem;
}

.form-group__input {
  margin-top: 0.25rem;
}

.form-group__error {
  margin: 0.375rem 0 0;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-error);
  line-height: 1.4;
}
</style>
