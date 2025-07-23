<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <g filter="url(#filter0_d_316_2628)">
      <path
        d="M12.152 22.304C13.3405 22.304 14.304 21.3405 14.304 20.152C14.304 18.9635 13.3405 18 12.152 18C10.9635 18 10 18.9635 10 20.152C10 21.3405 10.9635 22.304 12.152 22.304Z"
        :fill="color"
      />
      <path
        d="M20 22.304C21.1885 22.304 22.152 21.3405 22.152 20.152C22.152 18.9635 21.1885 18 20 18C18.8115 18 17.848 18.9635 17.848 20.152C17.848 21.3405 18.8115 22.304 20 22.304Z"
        :fill="color"
      />
      <path
        d="M27.848 22.304C29.0365 22.304 30 21.3405 30 20.152C30 18.9635 29.0365 18 27.848 18C26.6595 18 25.696 18.9635 25.696 20.152C25.696 21.3405 26.6595 22.304 27.848 22.304Z"
        :fill="color"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_316_2628"
        x="6"
        y="15"
        width="28"
        height="12.304"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_316_2628"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_316_2628"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
</template>

<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: 'var(--color-gray)',
  },
})
</script>

<style scoped></style>
