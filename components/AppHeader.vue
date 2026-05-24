<template>
  <header v-if="!headerStore.hideHeader" class="app-header">
    <div class="app-header__container">
      <div class="app-header__inner">
        <!-- Cụm trái: Logo -->
        <div class="app-header__cluster app-header__cluster--start">
          <NuxtLink to="/" class="wordmark" aria-label="Home">
            <span class="wordmark-main">TuyenGiaoVien</span>
            <span class="wordmark-dot">.vn</span>
          </NuxtLink>
        </div>

        <!-- Cụm giữa: Nav -->
        <nav class="site-nav" data-mobile-nav aria-label="Primary">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.to"
            :to="item.to"
            :class="{ 'is-active': isActive(item) }"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Cụm phải: Buttons -->
        <div class="topbar-actions app-header__cluster app-header__cluster--end">
          <template v-if="authStore.isLoggedIn">
            <UDropdownMenu
              :items="userDropdownItems"
              :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
              :ui="{ content: 'z-[70] w-56' }"
            >
              <button type="button" class="primary-btn small-btn topbar-actions__user">
                <span class="topbar-actions__userLabel">
                  {{ authStore.user?.fullName || authStore.user?.email || 'User' }}
                </span>
                <UIcon name="i-lucide-chevron-down" class="size-4 shrink-0" />
              </button>
            </UDropdownMenu>
          </template>
          <template v-else>
            <AuthModal
              v-model="authModalOpen"
              :initial-view="authModalView"
              @closed="onAuthModalClosed"
            >
              <button
                type="button"
                class="primary-btn small-btn"
                data-auth-open
                data-auth-view-target="login"
                @click="openAuthModal('login')"
              >
                Đăng ký / Đăng nhập
              </button>
            </AuthModal>
          </template>

          <button
            v-if="showPostButton"
            type="button"
            class="white-btn small-btn"
            @click="handlePostJobFree"
          >
            Đăng tin miễn phí
          </button>
        </div>
      </div>
    </div>

  </header>
</template>

<script setup lang="ts">
defineComponent({
  name: 'AppHeader',
})

import { USER_ROLES } from '~/constants/roles'

const headerStore = useHeaderStore()
const authStore = useAuthStore()
const router = useRouter()

const authModalOpen = ref(false)
const authModalView = ref<'login' | 'register'>('login')
const suppressAuthModalOpenUntil = ref(0)

const openAuthModal = (view: 'login' | 'register') => {
  if (Date.now() < suppressAuthModalOpenUntil.value) return
  authModalView.value = view
  authModalOpen.value = true
}

const onAuthModalClosed = () => {
  // Prevent immediate reopen from click-through
  suppressAuthModalOpenUntil.value = Date.now() + 250
}

const menuItems = computed(() => [
  { label: 'Công ty', to: ROUTE_PAGE.COMPANY.GET },
  { label: 'Tìm việc làm', to: ROUTE_PAGE.SEARCH },
  { label: 'Blog', to: '/blog' },
  { label: 'Liên hệ', to: '/contact' },
])

const isActive = (item: { to: string }) => {
  return router.currentRoute.value.path === item.to
}

const userRole = computed(() => authStore.user?.role)
const isAdmin = computed(() => userRole.value === USER_ROLES.ADMIN)
const isCompany = computed(() => userRole.value === USER_ROLES.COMPANY)

// Chỉ hiển thị khi chưa đăng nhập
const showPostButton = computed(() => !authStore.isLoggedIn)

const handlePostJobFree = () => {
  router.push(ROUTE_PAGE.PAGE)
}

const goDashboard = (path: string, query?: Record<string, any>) => {
  router.push({ path, query: query ?? {} })
}

const overviewDashboardTarget = computed(() => {
  if (isAdmin.value) {
    return { path: ROUTE_PAGE.DASHBOARD.ADMIN, query: { view: 'adminDashboard' } }
  }
  if (isCompany.value) {
    return { path: ROUTE_PAGE.DASHBOARD.COMPANY, query: { view: 'dashboard' } }
  }
  return { path: ROUTE_PAGE.DASHBOARD.USER, query: { view: 'dashboard' } }
})

const userDropdownItems = computed(() => {
  const items: any[] = []

  items.push([
    {
      label: 'Tổng quan',
      icon: 'i-lucide-layout-dashboard',
      onSelect: () =>
        goDashboard(overviewDashboardTarget.value.path, overviewDashboardTarget.value.query),
    },
  ])

  items.push([
    {
      label: 'Đăng xuất',
      icon: 'i-lucide-log-out',
      onSelect: () => authStore.logout(),
    },
  ])

  return items
})
</script>

<style lang="scss">
@use '@/assets/styles/components/app-header.scss';
</style>
