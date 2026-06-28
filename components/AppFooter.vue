<template>
  <footer id="contact" class="site-footer">
    <div class="container footer-links-grid footer-links-grid-compact">
      <div class="footer-brand-col">
        <NuxtLink to="/" class="footer-wordmark" aria-label="Trang chủ">
          <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
          <span class="wordmark-main">TuyenGiaoVien</span>
          <span class="wordmark-dot">.vn</span>
          <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
        </NuxtLink>
        <p class="footer-brand-note">
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          Nền tảng kết nối giáo viên với trường học, trung tâm và các đơn vị giáo dục trên toàn quốc.
        </p>
        <div class="footer-contact-list">
          <a
            v-if="phoneNumber"
            :href="telHref"
            class="footer-contact-item"
          >
            {{ phoneNumber }}
          </a>
          <a
            v-if="email"
            :href="mailtoHref"
            class="footer-contact-item"
          >
            {{ email }}
          </a>
        </div>
      </div>

      <div class="footer-link-col">
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <h4>Về chúng tôi</h4>
        <NuxtLink to="/about">Giới thiệu</NuxtLink>
        <NuxtLink to="/policy#chinh-sach-quyen-rieng-tu">Chính sách quyền riêng tư</NuxtLink>
        <NuxtLink to="/policy#dieu-khoan-dieu-kien">Điều khoản sử dụng</NuxtLink>
        <NuxtLink to="/faq">Câu hỏi thường gặp</NuxtLink>
      </div>

      <div class="footer-link-col">
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <h4>Danh mục</h4>
        <NuxtLink to="/companies">Công ty</NuxtLink>
        <NuxtLink to="/jobs/search">Tìm việc làm</NuxtLink>
        <NuxtLink to="/blog">Blog</NuxtLink>
        <NuxtLink to="/contact">Liên hệ</NuxtLink>
        <NuxtLink to="/about">Giới thiệu</NuxtLink>
      </div>
    </div>

    <div class="container footer-bottom">
      <p>
        <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
        © {{ currentYear }} tuyengiaovien.vn. All rights reserved.
        <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
const { email, phoneNumber, mailtoHref, telHref } = useAdminContactInfo()
</script>
