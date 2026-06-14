<template>
  <div class="candidate-dashboard-page">
    <div
      class="candidate-dashboard"
      data-candidate-dashboard=""
      data-home-url="/"
      :data-account-url="accountDashboardUrl"
    >
      <aside class="candidate-sidebar">
        <NuxtLink to="/" class="candidate-brand wordmark" aria-label="Trang chủ">
          <span class="wordmark-main">TuyenGiaoVien</span>
          <span class="wordmark-dot">.vn</span>
        </NuxtLink>

        <nav class="candidate-sidebar-nav" aria-label="Dashboard ứng viên">
          <NuxtLink
            :to="{ path: '/users/dashboard', query: { view: 'dashboard' } }"
            class="candidate-nav-link"
            :class="{ 'is-active': activeView === 'dashboard' }"
          >
            <span class="candidate-nav-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.5Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span>Tổng quan</span>
          </NuxtLink>

          <NuxtLink
            :to="{ path: '/users/dashboard', query: { view: 'resume' } }"
            class="candidate-nav-link"
            :class="{ 'is-active': activeView === 'resume' }"
          >
            <span class="candidate-nav-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 3.5h7.5L18 7v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path
                  d="M14.5 3.5V7H18M9 12h6M9 16h4"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span>Hồ sơ ứng tuyển</span>
          </NuxtLink>

          <NuxtLink
            :to="{ path: '/users/dashboard', query: { view: 'applications' } }"
            class="candidate-nav-link"
            :class="{ 'is-active': activeView === 'applications' }"
          >
            <span class="candidate-nav-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect
                  x="4"
                  y="7"
                  width="16"
                  height="13"
                  rx="2.5"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M9 7V5.5A2.5 2.5 0 0 1 11.5 3h1A2.5 2.5 0 0 1 15 5.5V7M4 12h16"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <span>Công việc đã ứng tuyển</span>
          </NuxtLink>

          <NuxtLink
            :to="{ path: '/users/dashboard', query: { view: 'editProfile' } }"
            class="candidate-nav-link"
            :class="{ 'is-active': activeView === 'editProfile' }"
          >
            <span class="candidate-nav-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 12.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M5 20a7 7 0 0 1 14 0"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <span>Thông tin Tài Khoản</span>
          </NuxtLink>

        </nav>
      </aside>

      <div class="candidate-main">
        <header class="candidate-topbar">
          <div />
          <div class="candidate-topbar-menu" data-candidate-menu="">
            <button
              type="button"
              class="candidate-topbar-user"
              data-candidate-menu-button=""
              aria-haspopup="menu"
              :aria-expanded="showUserDropdown"
              @click.stop="toggleUserDropdown"
            >
              <span class="candidate-avatar" data-candidate-avatar="">{{ avatarInitial }}</span>
              <span data-candidate-name="">{{ displayName }}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="m6 9 6 6 6-6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <div
              v-show="showUserDropdown"
              class="candidate-topbar-dropdown"
              data-candidate-menu-panel=""
              role="menu"
              @click.stop
            >
              <button
                type="button"
                class="candidate-topbar-dropdown-item"
                data-candidate-logout=""
                role="menuitem"
                @click="logout()"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M14 7V5.5A1.5 1.5 0 0 0 12.5 4h-6A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20h6A1.5 1.5 0 0 0 14 18.5V17"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10 12h10M17 8l3 4-3 4"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>{{ $t('common.logout') }}</span>
              </button>
            </div>
          </div>
        </header>

        <main class="candidate-content">
          <DashboardUserOverview
            v-if="activeView === 'dashboard'"
            ref="overviewRef"
            @view-all-applications="setActiveView('applications')"
            @view-job="handleViewJob"
          />

          <DashboardUserEditProfile
            v-else-if="activeView === 'editProfile'"
            @back="setActiveView('dashboard')"
          />

          <DashboardUserResume
            v-else-if="activeView === 'resume'"
            @back="setActiveView('dashboard')"
          />

          <DashboardUserApplications
            v-else-if="activeView === 'applications'"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import DashboardUserOverview from '~/components/dashboard/DashboardUserOverview.vue'
import DashboardUserEditProfile from '~/components/dashboard/DashboardUserEditProfile.vue'
import DashboardUserResume from '~/components/dashboard/DashboardUserResume.vue'
import DashboardUserApplications from '~/components/dashboard/DashboardUserApplications.vue'

definePageMeta({
  layout: 'blank',
})

useHead({
  title: 'Tài khoản ứng viên',
})

// Composables
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const accountDashboardUrl = '/users/dashboard?view=editProfile'

// Dashboard view types
type DashboardView = 'dashboard' | 'editProfile' | 'resume' | 'applications'

// Active view state
const activeView = ref<DashboardView>('dashboard')

// Reactive data
const showUserDropdown = ref(false)
const overviewRef = ref<InstanceType<typeof DashboardUserOverview> | null>(null)

const displayName = computed(() => {
  return authStore.user?.fullName?.trim() || authStore.user?.email || 'Ứng viên'
})

const avatarInitial = computed(() => {
  const name = authStore.user?.fullName?.trim()

  if (name) {
    return name.charAt(0).toUpperCase()
  }

  const em = authStore.user?.email

  if (em) {
    return em.charAt(0).toUpperCase()
  }

  return 'Ứ'
})

// Methods
const setActiveView = (view: DashboardView) => {
  activeView.value = view
  showUserDropdown.value = false
  
  // Update URL query parameter
  router.push({
    path: '/users/dashboard',
    query: { view }
  })
  
  // Scroll to top when changing view
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
}

// Navigation methods
const handleViewJob = (jobId: number) => {
  router.push(`/jobs/${jobId}`)
}

const logout = () => {
  showUserDropdown.value = false
  authStore.logout()
  router.push('/')
}

// Watch for route query changes (immediate để chạy ngay khi load)
watch(() => route.query.view, (newView) => {
  const raw = newView as string | undefined

  if (raw === 'settings' || raw === 'changePassword') {
    activeView.value = 'editProfile'
    router.replace({
      path: '/users/dashboard',
      query: { view: 'editProfile', expand: 'password' },
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  if (raw && ['dashboard', 'editProfile', 'resume', 'applications'].includes(raw)) {
    activeView.value = raw as DashboardView
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  if (!authStore.user) {
    router.push(ROUTE_PAGE.AUTH.LOGIN)

    return
  }

  // Add click outside listener for dropdown
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement

  if (!target.closest('.candidate-topbar-menu')) {
    showUserDropdown.value = false
  }
}

</script>
