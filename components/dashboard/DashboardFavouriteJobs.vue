<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('dashboard.favouriteJobs.title') }}</h1>
      <p class="text-gray-600 mt-2">
        {{ $t('dashboard.favouriteJobs.description') }}
      </p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <p class="text-gray-500">{{ $t('dashboard.favouriteJobs.comingSoon') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'back'): void
}>()
</script>

