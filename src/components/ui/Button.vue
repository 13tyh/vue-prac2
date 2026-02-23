<script setup>
/**
 * ボタン
 * variant: primary / secondary / outline / danger。loading でスピナー、fullWidth で幅100%。
 */
defineProps({
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'outline', 'danger'].includes(v),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="button"
    :class="[`button--${variant}`, {'button--full': fullWidth}]"
  >
    <span v-if="loading" class="button__spinner" aria-hidden="true" />
    <span class="button__text" :class="{'button__text--hidden': loading}">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: inherit;
  letter-spacing: 0.02em;
  line-height: 1.4;
  border-radius: var(--radius-md, 14px);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.button:active:not(:disabled) {
  transform: scale(0.98);
}

.button--full {
  width: 100%;
}

.button--primary {
  color: #fff;
  background: linear-gradient(180deg, var(--form-accent) 0%, var(--form-accent-hover) 100%);
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 10px rgba(109, 40, 217, 0.3);
}

.button--primary:hover:not(:disabled) {
  background: linear-gradient(180deg, var(--form-accent-hover) 0%, #4c1d95 100%);
  box-shadow: 0 4px 14px rgba(109, 40, 217, 0.4);
  transform: translateY(-1px);
}

.button--secondary {
  color: var(--form-label);
  background-color: var(--form-bg);
  border-color: var(--form-border);
}

.button--secondary:hover:not(:disabled) {
  background-color: #eeecf5;
  border-color: var(--form-border-hover);
}

.button--outline {
  color: var(--form-accent);
  background-color: transparent;
  border-color: var(--form-accent);
}

.button--outline:hover:not(:disabled) {
  background-color: var(--form-accent-soft);
  border-color: var(--form-accent-hover);
}

.button--danger {
  color: #fff;
  background: linear-gradient(180deg, #dc2626 0%, #b91c1c 100%);
  border-color: rgba(0, 0, 0, 0.08);
}

.button--danger:hover:not(:disabled) {
  background: linear-gradient(180deg, #b91c1c 0%, #991b1b 100%);
  transform: translateY(-1px);
}

.button__spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: button-spin 0.6s linear infinite;
}

.button__text--hidden {
  visibility: hidden;
  position: absolute;
}

@keyframes button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
