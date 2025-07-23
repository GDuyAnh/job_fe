<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="26"
    viewBox="0 0 24 26"
    fill="none"
  >
    <g filter="url(#filter0_d_321_6233)">
      <path
        d="M9.55852 19.9413C9.76309 21.1343 10.7897 22 11.9995 22C13.2097 22 14.2366 21.1343 14.4412 19.9413L14.4537 19.8687H9.54602L9.55852 19.9413Z"
        :fill="color"
      />
      <path
        d="M20.3508 16.5305C20.1506 16.3302 19.9466 16.1608 19.7492 15.9968C18.919 15.3075 18.202 14.7121 18.202 12.2403V10.2796C18.202 7.39645 16.1763 4.8666 13.3735 4.2323C13.4858 4.01199 13.5428 3.78043 13.5428 3.54266C13.5428 2.69211 12.8506 2 11.9998 2C11.1491 2 10.4571 2.69211 10.4571 3.54266C10.4571 3.78059 10.514 4.01211 10.6264 4.2323C7.82348 4.8666 5.79789 7.39645 5.79789 10.2796V12.2403C5.79789 14.7121 5.08086 15.3075 4.2507 15.9968C4.05336 16.1607 3.8493 16.3302 3.64906 16.5305L3.63086 16.5487V18.4939H20.369V16.5487L20.3508 16.5305Z"
        :fill="color"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_321_6233"
        x="0.630859"
        y="0"
        width="22.7382"
        height="26"
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
        <feGaussianBlur stdDeviation="1.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_321_6233"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_321_6233"
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
