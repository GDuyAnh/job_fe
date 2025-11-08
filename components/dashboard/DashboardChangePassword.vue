<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ $t('dashboard.sidebar.changePassword') }}
      </h1>
      <p class="text-gray-600 mt-2">
        Thay đổi mật khẩu tài khoản của bạn
      </p>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 max-w-2xl">
      <div class="text-center py-8">
        <UIcon name="i-lucide-lock" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 text-lg">
          Tính năng đang được phát triển
        </p>
        <p class="text-gray-400 text-sm mt-2">
          Form thay đổi mật khẩu sẽ được hiển thị tại đây
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

