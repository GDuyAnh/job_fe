<template>
  <main>
    <section class="blog-detail-hero">
      <div class="container">
        <div
          class="blog-detail-banner"
          :class="{ 'blog-featured-media-one': !blog?.image }"
          :style="bannerStyle"
          role="img"
          :aria-label="blog?.title || 'Ảnh bài viết'"
        />
        <div class="blog-detail-heading">
          <div v-if="preview" class="blog-detail-heading-top">
            <span class="detail-preview-badge">Nháp</span>
          </div>
          <h1>{{ blog?.title || '' }}</h1>
        </div>
      </div>
    </section>

    <section class="blog-detail-main">
      <div class="container">
        <div class="blog-detail-layout">
          <article class="blog-detail-article">
            <div v-if="loading" class="blog-detail-loading">
              Đang tải bài viết...
            </div>
            <template v-else-if="blog">
              <p v-if="blog.description" class="blog-detail-lead">
                {{ blog.description }}
              </p>
              <div
                v-if="processedContent"
                class="blog-detail-content rich-text-output"
                v-html="processedContent"
              />
            </template>
            <div v-else class="blog-detail-empty">
              Không tìm thấy bài viết.
            </div>
          </article>

          <aside v-if="showSidebar" class="blog-detail-sidebar">
            <div class="blog-detail-sidebar-card blog-detail-sidebar-card-primary">
              <span class="blog-detail-sidebar-kicker">Bạn đang tìm việc?</span>
              <h3>Tìm công việc giáo viên phù hợp</h3>
              <NuxtLink to="/jobs/search" class="primary-btn blog-detail-sidebar-btn">
                Xem việc làm
              </NuxtLink>
            </div>

            <div v-if="showRelated && relatedBlogs.length" class="blog-detail-sidebar-card">
              <h3>Bài viết liên quan</h3>
              <div class="blog-detail-related-list">
                <NuxtLink
                  v-for="r in relatedBlogs"
                  :key="r.id"
                  :to="`/blog/${r.id}`"
                  class="blog-detail-related-item"
                >
                  <span>{{ r.category || 'Blog' }}</span>
                  <strong>{{ r.title }}</strong>
                  <small>{{ readingTimeText(r) }}</small>
                </NuxtLink>
              </div>
            </div>

            <div class="blog-detail-sidebar-card blog-detail-sidebar-card-employer">
              <span class="blog-detail-sidebar-kicker">Nhà tuyển dụng</span>
              <h3>Đăng tin tuyển giáo viên</h3>
              <NuxtLink to="/jobs/upload" class="blog-detail-text-link">
                Đăng tin miễn phí
              </NuxtLink>
            </div>
          </aside>
        </div>

        <div v-if="showBackLink" class="blog-detail-back">
          <NuxtLink to="/blog">
            <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
            Quay lại danh sách blog
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { BlogEntity } from '~/entities/blog'

const props = withDefaults(
  defineProps<{
    blog: BlogEntity | null
    loading?: boolean
    relatedBlogs?: BlogEntity[]
    preview?: boolean
    showRelated?: boolean
    showSidebar?: boolean
    showBackLink?: boolean
  }>(),
  {
    loading: false,
    relatedBlogs: () => [],
    preview: false,
    showRelated: true,
    showSidebar: true,
    showBackLink: true,
  },
)

const blogRef = toRef(props, 'blog')
const { bannerStyle, processedContent, readingTimeText } = useBlogDetailView(blogRef)
</script>
