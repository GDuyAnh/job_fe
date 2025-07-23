<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 28 28"
    fill="none"
  >
    <g filter="url(#filter0_d_520_2928)">
      <path
        d="M23.9999 5.76103L21.2389 3L14.0001 10.2388L6.76107 3L4 5.76142L11.2389 13.0003L4 20.2391L6.76126 23.0001L14.0001 15.7613L21.2389 23.0001L23.9999 20.2391L16.7611 13.0003L23.9999 5.76103Z"
        :fill="color"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_520_2928"
        x="0"
        y="0"
        width="28"
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
          result="effect1_dropShadow_520_2928"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_520_2928"
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
