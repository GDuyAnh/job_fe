<template>
  <footer
    class="app-footer"
    style="
      background: radial-gradient(circle at 18% 0%, rgba(88, 128, 255, 0.08), transparent 28%),
        radial-gradient(circle at 82% 6%, rgba(137, 174, 255, 0.07), transparent 24%),
        linear-gradient(180deg, rgba(239, 246, 255, 0.94) 0%, rgba(248, 250, 255, 0.98) 20%, #ffffff 42%);
      border-top: 1px solid var(--line);
      padding: 8px 0 38px;
    "
  >
    <div class="app-footer__wrap">
      <div class="app-footer__grid">
        <!-- Left -->
        <div class="app-footer__left">
          <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
          <div class="app-footer__brand">
            TuyenGiaoVien<span class="text-[var(--blue)]">.vn</span>
          </div>
          <p class="app-footer__desc">
            Nền tảng kết nối giáo viên với trường học, trung tâm và các đơn vị giáo dục trên toàn quốc.
          </p>

          <div class="app-footer__contact">
            <div>+84 858 436 359</div>
            <div>hotro@tuyengiaovien.vn</div>
          </div>
          <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
        </div>

        <!-- About -->
        <div>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <h3 class="app-footer__title">Về chúng tôi</h3>
          <ul class="app-footer__list">
            <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
            <li><NuxtLink to="/about" class="app-footer__link">Giới thiệu</NuxtLink></li>
            <li><NuxtLink to="/policy#privacy" class="app-footer__link">Chính sách quyền riêng tư</NuxtLink></li>
            <li><NuxtLink to="/policy#terms" class="app-footer__link">Điều khoản sử dụng</NuxtLink></li>
            <li><NuxtLink to="/faq" class="app-footer__link">Câu hỏi thường gặp</NuxtLink></li>
            <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
          </ul>
        </div>

        <!-- Categories -->
        <div>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <h3 class="app-footer__title">Danh mục</h3>
          <ul class="app-footer__list">
            <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
            <li><NuxtLink to="/companies" class="app-footer__link">Công ty</NuxtLink></li>
            <li><NuxtLink to="/jobs/search" class="app-footer__link">Tìm việc làm</NuxtLink></li>
            <li><NuxtLink to="/blog" class="app-footer__link">Blog</NuxtLink></li>
            <li><NuxtLink to="/contact" class="app-footer__link">Liên hệ</NuxtLink></li>
            <li><NuxtLink to="/about" class="app-footer__link">Giới thiệu</NuxtLink></li>
            <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
          </ul>
        </div>
      </div>

      <div class="app-footer__divider" />
      <div class="app-footer__copy">
        <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
        © {{ new Date().getFullYear() }} tuyengiaovien.vn. All rights reserved.
        <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineComponent({
  name: 'AppFooter',
})
</script>

<style scoped>
.app-footer {
  width: 100%;
}

.app-footer__wrap {
  max-width: 80rem;
  margin: 0 auto;
  padding: 48px 32px 0;
}

.app-footer__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
}

.app-footer__left {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.app-footer__brand {
  font-weight: 800;
  color: #1d2433;
}

.app-footer__desc {
  font-size: 14px;
  color: rgba(29, 36, 51, 0.55);
  line-height: 1.6;
  max-width: 28rem;
}

.app-footer__title {
  font-size: 14px;
  font-weight: 700;
  color: #1d2433;
  margin-bottom: 16px;
}

.app-footer__contact {
  font-size: 14px;
  color: rgba(29, 36, 51, 0.65);
  display: grid;
  gap: 12px;
}

.app-footer__list {
  display: grid;
  gap: 12px;
  font-size: 14px;
  color: rgba(29, 36, 51, 0.65);
  list-style: none;
  padding: 0;
  margin: 0;
}

.app-footer__link {
  color: rgba(29, 36, 51, 0.65);
  text-decoration: none;
  transition: color 140ms ease;
}

.app-footer__link:hover {
  color: #1d2433;
}

.app-footer__divider {
  border-top: 1px solid var(--line);
  margin-top: 28px;
}

.app-footer__copy {
  padding: 24px 0;
  font-size: 13px;
  color: rgba(29, 36, 51, 0.55);
}

@media (min-width: 768px) {
  .app-footer__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

