<script setup>
/**
 * テキスト系入力欄（v-model 対応）
 * type で text / email / password など指定。invalid でエラー時の見た目。
 */
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  id: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  invalid: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

// v-model 用: 入力のたびに親へ値を渡す
function onInput(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <input
    :id="id"
    :type="type"
    :name="name"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :aria-invalid="invalid"
    class="input"
    :class="{ 'input--invalid': invalid }"
    @input="onInput"
  >
</template>

<style scoped>
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.5;
  color: var(--color-text);
  background-color: var(--form-bg);
  border: 1px solid var(--form-border);
  border-radius: var(--radius-md, 14px);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.input::placeholder {
  color: var(--form-placeholder);
}

.input:hover:not(:disabled) {
  border-color: var(--form-border-hover);
  background-color: var(--form-bg-focus);
}

.input:focus {
  outline: none;
  border-color: var(--form-accent);
  box-shadow: 0 0 0 3px var(--form-accent-soft);
  background-color: var(--form-bg-focus);
}

.input:disabled {
  background-color: #eeecf5;
  cursor: not-allowed;
  opacity: 0.8;
}

.input--invalid {
  border-color: #f87171;
  background-color: var(--color-error-bg);
}

.input--invalid:focus {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.15);
}
</style>
