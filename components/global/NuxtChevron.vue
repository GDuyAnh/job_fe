<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="28"
    viewBox="0 0 21 28"
    fill="none"
  >
    <g filter="url(#filter0_d_520_2926)">
      <path
        d="M16.9028 20.1949L9.70869 13.0007L16.9028 5.80586L14.097 3L4.09697 13.0007L14.097 23L16.9028 20.1949Z"
        :fill="color"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_520_2926"
        x="0.0969238"
        y="0"
        width="20.8059"
        height="28"
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
          result="effect1_dropShadow_520_2926"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_520_2926"
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
