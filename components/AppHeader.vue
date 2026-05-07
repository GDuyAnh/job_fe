<template>
  <header v-if="!headerStore.hideHeader" class="app-header">
    <div class="app-header__container">
      <div class="app-header__inner">
        <!-- Brand -->
        <NuxtLink to="/" class="app-header__brand" aria-label="Home">
          <span class="app-header__brandText">TuyenGiaoVien<span class="app-header__dot">.vn</span></span>
        </NuxtLink>

        <!-- Menu -->
        <nav class="app-header__nav" aria-label="Primary">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.to"
            :to="item.to"
            class="app-header__navItem"
            :class="{ 'is-active': isActive(item) }"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Actions -->
        <div class="app-header__actions">
          <template v-if="authStore.isLoggedIn">
            <UDropdownMenu
              :items="userDropdownItems"
              :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
              :ui="{ content: 'z-[70] w-56' }"
            >
              <UButton
                variant="ghost"
                color="neutral"
                class="app-header__userBtn"
                :label="authStore.user?.fullName || authStore.user?.email || 'User'"
                trailing-icon="i-lucide-chevron-down"
              />
            </UDropdownMenu>
          </template>
          <template v-else>
            <AuthModal
              v-model="authModalOpen"
              :initial-view="authModalView"
              @closed="onAuthModalClosed"
            >
              <UButton
                label="Đăng ký / Đăng nhập"
                color="primary"
                variant="solid"
                class="app-header__authBtn"
                @click="openAuthModal('login')"
              />
            </AuthModal>
          </template>

          <UButton
            v-if="showPostButton"
            :to="ROUTE_PAGE.PAGE"
            label="Đăng tin miễn phí"
            color="primary"
            variant="outline"
            class="app-header__postBtn"
          />
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

// Hide "Đăng tin miễn phí" for ADMIN/COMPANY
const showPostButton = computed(() => {
  if (!authStore.isLoggedIn) return true
  return !(isAdmin.value || isCompany.value)
})

const goDashboard = (path: string, query?: Record<string, any>) => {
  router.push({ path, query: query ?? {} })
}

const userDropdownItems = computed(() => {
  const items: any[] = []

  if (isAdmin.value) {
    items.push(
      [
        {
          label: 'Dashboard',
          icon: 'i-lucide-layout-dashboard',
          onSelect: () => goDashboard(ROUTE_PAGE.DASHBOARD.ADMIN, { view: 'adminDashboard' }),
        },
        {
          label: 'Công ty',
          icon: 'i-lucide-building',
          onSelect: () => goDashboard(ROUTE_PAGE.DASHBOARD.ADMIN, { view: 'adminCompanies' }),
        },
        {
          label: 'Quản lý công việc',
          icon: 'i-lucide-briefcase',
          onSelect: () => goDashboard(ROUTE_PAGE.DASHBOARD.ADMIN, { view: 'adminManageJobs' }),
        },
        {
          label: 'Ứng viên',
          icon: 'i-lucide-users',
          onSelect: () => goDashboard(ROUTE_PAGE.DASHBOARD.ADMIN, { view: 'adminCandidates' }),
        },
        {
          label: 'Users',
          icon: 'i-lucide-users-round',
          onSelect: () => goDashboard(ROUTE_PAGE.DASHBOARD.ADMIN, { view: 'adminUsers' }),
        },
        {
          label: 'Blogs',
          icon: 'i-lucide-file-text',
          onSelect: () => goDashboard(ROUTE_PAGE.DASHBOARD.ADMIN, { view: 'adminBlogs' }),
        },
        {
          label: 'Cài đặt',
          icon: 'i-lucide-settings',
          onSelect: () => goDashboard(ROUTE_PAGE.DASHBOARD.ADMIN, { view: 'adminSettings' }),
        },
      ],
    )
  } else if (isCompany.value) {
    items.push(
      [
        {
          label: 'Dashboard',
          icon: 'i-lucide-layout-dashboard',
          onSelect: () => goDashboard(ROUTE_PAGE.DASHBOARD.COMPANY),
        },
        {
          label: 'Hồ sơ công ty',
          icon: 'i-lucide-building',
          onSelect: () => goDashboard(ROUTE_PAGE.DASHBOARD.COMPANY, { view: 'editProfile' }),
        },
        {
          label: 'Quản lý tin đăng',
          icon: 'i-lucide-briefcase',
          onSelect: () => goDashboard(ROUTE_PAGE.DASHBOARD.COMPANY, { view: 'manageJobs' }),
        },
        {
          label: 'Quản lý ứng viên',
          icon: 'i-lucide-users',
          onSelect: () => goDashboard(ROUTE_PAGE.DASHBOARD.COMPANY, { view: 'candidates' }),
        },
      ],
    )
  } else {
    items.push(
      [
        {
          label: 'Tổng quan',
          icon: 'i-lucide-layout-dashboard',
          onSelect: () => goDashboard(ROUTE_PAGE.DASHBOARD.USER, { view: 'dashboard' }),
        },
        {
          label: 'Thông tin tài khoản',
          icon: 'i-lucide-user',
          onSelect: () => goDashboard(ROUTE_PAGE.DASHBOARD.USER, { view: 'editProfile' }),
        },
        {
          label: 'Hồ sơ ứng tuyển',
          icon: 'i-lucide-file-text',
          onSelect: () => goDashboard(ROUTE_PAGE.DASHBOARD.USER, { view: 'resume' }),
        },
        {
          label: 'Công việc đã ứng tuyển',
          icon: 'i-lucide-briefcase',
          onSelect: () => goDashboard(ROUTE_PAGE.DASHBOARD.USER, { view: 'applications' }),
        },
        {
          label: 'Đăng tin mới',
          icon: 'i-lucide-plus-circle',
          onSelect: () => router.push('/jobs/upload'),
        },
        {
          label: 'Thay đổi mật khẩu',
          icon: 'i-lucide-lock',
          onSelect: () => goDashboard(ROUTE_PAGE.DASHBOARD.USER, { view: 'changePassword' }),
        },
      ],
    )
  }

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
