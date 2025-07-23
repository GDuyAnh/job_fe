<template>
  <div
    class="px-[30px] py-4 margin-x-negative"
  >
    <component
      :is="tag"
      ref="headingRef"
      :class="['app-heading', `app-heading--${align}`, $attrs.class]"
      v-bind="$attrs"
    >
      <slot />
    </component>
    <p
      v-if="$slots.subheading"
      class="text-xs font-serif mt-2 pl-5 whitespace-pre-line"
    >
      <slot name="subheading" />
    </p>
  </div>
</template>

<script setup lang="ts">
defineComponent({
  name: 'AppHeading',
})
const { tag, align } = defineProps({
  tag: {
    type: String as PropType<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>,
    default: 'h5',
    required: false,
  },
  align: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'left',
    required: false,
  },
})

const headingRef = ref<HTMLElement | null>(null)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/components/app-heading.scss';
</style>
