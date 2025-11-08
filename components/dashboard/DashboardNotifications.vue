<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ $t('dashboard.sidebar.notifications') }}
      </h1>
      <p class="text-gray-600 mt-2">
        Xem tất cả thông báo của bạn
      </p>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div class="text-center py-8">
        <UIcon name="i-lucide-bell" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 text-lg">
          Chưa có thông báo nào
        </p>
        <p class="text-gray-400 text-sm mt-2">
          Các thông báo mới sẽ được hiển thị tại đây
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  back: []
}>()
</script>

