<template>
  <section class="legal-page">
    <div class="container legal-shell">
      <header class="legal-hero">
        <span class="legal-eyebrow">TuyenGiaoVien.vn</span>
        <h1>Điều khoản &amp; Chính sách quyền riêng tư</h1>
        <p>Chúng tôi cam kết bảo vệ và tôn trọng quyền riêng tư của mọi người dùng.</p>
        <time datetime="2025-10-20">Ngày cập nhật: 20/10/2025</time>
      </header>

      <nav class="legal-index" aria-label="Mục lục chính sách">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="`#${item.id}`"
          :class="{ 'is-active': activeSectionId === item.id }"
          @click.prevent="scrollToSection(item.id)"
        >
          {{ item.label }}
        </a>
      </nav>

      <article class="legal-card">
        <section class="legal-section" id="dieu-khoan-dieu-kien">
          <h2>Điều khoản &amp; Điều kiện</h2>
          <p>
            Bằng việc truy cập hoặc sử dụng TuyenGiaoVien.vn, bạn đồng ý tuân thủ các điều khoản được nêu
            dưới đây. Nếu bạn không đồng ý với bất kỳ nội dung nào, vui lòng ngừng sử dụng dịch vụ.
          </p>

          <h3>Phạm vi dịch vụ</h3>
          <p>
            TuyenGiaoVien.vn là nền tảng kết nối ứng viên trong lĩnh vực giáo dục với trường học, trung
            tâm và các đơn vị tuyển dụng. Chúng tôi cung cấp công cụ đăng tin, tìm kiếm việc làm, quản lý
            hồ sơ và nộp đơn ứng tuyển.
          </p>

          <h3>Tài khoản người dùng</h3>
          <ul>
            <li>
              Bạn chịu trách nhiệm về tính chính xác của thông tin cung cấp khi đăng ký hoặc sử dụng tài
              khoản.
            </li>
            <li>
              Bạn có trách nhiệm bảo mật thông tin đăng nhập và thông báo cho chúng tôi nếu phát hiện truy
              cập trái phép.
            </li>
            <li>
              Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản có hành vi gian lận, lạm dụng hoặc vi
              phạm pháp luật.
            </li>
          </ul>

          <h3>Trách nhiệm của ứng viên</h3>
          <ul>
            <li>Ứng viên cần cung cấp thông tin hồ sơ trung thực, đầy đủ và cập nhật.</li>
            <li>
              Ứng viên không được đăng tải nội dung giả mạo, xúc phạm, vi phạm bản quyền hoặc gây ảnh
              hưởng đến quyền lợi của bên thứ ba.
            </li>
          </ul>

          <h3>Trách nhiệm của nhà tuyển dụng</h3>
          <ul>
            <li>
              Nhà tuyển dụng cần đăng thông tin tuyển dụng chính xác, minh bạch và phù hợp với quy định
              pháp luật.
            </li>
            <li>
              Nhà tuyển dụng không được sử dụng dữ liệu ứng viên cho mục đích ngoài tuyển dụng nếu chưa có
              sự đồng ý phù hợp.
            </li>
          </ul>

          <h3>Thay đổi điều khoản</h3>
          <p>
            Chúng tôi có thể cập nhật Điều khoản &amp; Điều kiện theo thời gian. Phiên bản mới sẽ được
            công bố trên trang này và có hiệu lực kể từ ngày cập nhật.
          </p>
        </section>

        <section class="legal-section" id="chinh-sach-quyen-rieng-tu">
          <h2>Chính sách quyền riêng tư</h2>
          <p>Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản được nêu ra dưới đây.</p>

          <h3>Dữ liệu chúng tôi thu thập</h3>
          <h4>Đối với ứng viên</h4>
          <ul>
            <li>
              Thông tin cá nhân: Họ tên, ngày sinh, số điện thoại, địa chỉ email, địa chỉ thường trú.
            </li>
            <li>
              Hồ sơ xin việc: Sơ yếu lý lịch (CV), kinh nghiệm làm việc, học vấn, kỹ năng, chứng chỉ, ảnh
              đại diện.
            </li>
            <li>
              Thông tin khác: Các thông tin bạn cung cấp khi điền đơn ứng tuyển, tham gia khảo sát hoặc
              liên hệ với chúng tôi.
            </li>
          </ul>

          <h4>Đối với nhà tuyển dụng</h4>
          <ul>
            <li>Thông tin doanh nghiệp: Tên công ty, mã số thuế, địa chỉ, số điện thoại, email.</li>
            <li>Thông tin người liên hệ: Họ tên, chức vụ của người phụ trách tuyển dụng.</li>
            <li>Nội dung tuyển dụng: Thông tin về vị trí công việc, yêu cầu, mô tả công việc.</li>
          </ul>

          <h4>Đối với mọi người truy cập</h4>
          <ul>
            <li>
              Dữ liệu kỹ thuật: Địa chỉ IP, loại trình duyệt, hệ điều hành, thời gian truy cập, các trang
              bạn đã xem.
            </li>
            <li>Dữ liệu Cookie: Như được giải thích trong mục Cookie và Công nghệ Theo dõi bên dưới.</li>
          </ul>

          <h3>Mục đích sử dụng dữ liệu</h3>
          <ul>
            <li>
              Cung cấp và vận hành dịch vụ: Tạo và quản lý tài khoản, đăng tin tuyển dụng, nộp đơn ứng
              tuyển.
            </li>
            <li>
              Kết nối ứng viên và nhà tuyển dụng: Hiển thị hồ sơ ứng viên cho nhà tuyển dụng, gửi thông
              báo việc làm phù hợp cho ứng viên.
            </li>
            <li>
              Cải thiện dịch vụ: Phân tích dữ liệu để hiểu rõ hơn nhu cầu người dùng và nâng cao trải
              nghiệm trên website.
            </li>
            <li>
              Giao tiếp và hỗ trợ: Phản hồi các thắc mắc, gửi thông báo quan trọng về dịch vụ.
            </li>
            <li>
              Đảm bảo an toàn: Ngăn chặn các hành vi gian lận, lạm dụng và bảo vệ sự an toàn cho cộng
              đồng người dùng.
            </li>
          </ul>

          <h3>Chia sẻ và tiết lộ dữ liệu</h3>
          <p>
            Chúng tôi cam kết không bán, thuê hay cho thuê thông tin cá nhân của bạn cho bên thứ ba.
            Thông tin của bạn có thể được chia sẻ trong các trường hợp sau:
          </p>
          <ul>
            <li>
              Giữa ứng viên và nhà tuyển dụng: Hồ sơ của bạn, sau khi bạn ứng tuyển hoặc cho phép hiển thị
              công khai, sẽ được chia sẻ với nhà tuyển dụng đang có nhu cầu.
            </li>
            <li>
              Bên thứ ba cung cấp dịch vụ: Chúng tôi có thể sử dụng các đối tác để hỗ trợ vận hành, ví dụ
              dịch vụ lưu trữ web hoặc gửi email. Các đối tác này chỉ được quyền truy cập thông tin cần
              thiết để hoàn thành công việc và bị ràng buộc bởi nghĩa vụ bảo mật.
            </li>
            <li>
              Theo yêu cầu pháp luật: Khi có yêu cầu từ cơ quan chức năng có thẩm quyền hoặc để bảo vệ
              quyền lợi hợp pháp của chúng tôi.
            </li>
          </ul>

          <h3>Bảo mật dữ liệu</h3>
          <p>
            Chúng tôi áp dụng các biện pháp an toàn kỹ thuật và quản lý phù hợp để bảo vệ thông tin của
            bạn khỏi mất mát, truy cập trái phép, thay đổi hoặc tiết lộ không hợp pháp. Tuy nhiên, không có
            phương pháp nào là 100% an toàn trên internet.
          </p>

          <h3>Quyền của bạn</h3>
          <ul>
            <li>Truy cập: Yêu cầu một bản sao các dữ liệu cá nhân mà chúng tôi lưu trữ về bạn.</li>
            <li>Chỉnh sửa: Cập nhật hoặc sửa đổi các thông tin không chính xác trong tài khoản của bạn.</li>
            <li>Xóa bỏ: Yêu cầu xóa tài khoản và các dữ liệu cá nhân liên quan.</li>
            <li>Từ chối: Ngừng nhận các email thông tin, tuyển dụng từ chúng tôi.</li>
          </ul>
          <p>
            Để thực hiện các quyền này, bạn có thể trực tiếp chỉnh sửa trong phần cài đặt tài khoản hoặc
            gửi yêu cầu qua email
            <a href="mailto:hotro@tuyengiaovien.vn">hotro@tuyengiaovien.vn</a>.
          </p>

          <h3>Cookie và công nghệ theo dõi</h3>
          <p>
            Chúng tôi sử dụng Cookie để cải thiện trải nghiệm của bạn. Cookie là các file nhỏ được lưu
            trên trình duyệt, giúp chúng tôi nhận biết thiết bị của bạn khi quay lại truy cập, ghi nhớ các
            cài đặt và phân tích lưu lượng truy cập website. Bạn có thể chọn để chấp nhận hoặc từ chối
            Cookie thông qua cài đặt trình duyệt của mình.
          </p>
        </section>

        <section class="legal-section" id="lien-he-phap-ly">
          <h2>Liên hệ</h2>
          <p>
            Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về Điều khoản &amp; Chính sách quyền riêng tư này,
            vui lòng liên hệ với chúng tôi.
          </p>
          <dl class="legal-contact-list">
            <div>
              <dt>Email</dt>
              <dd><a href="mailto:hotro@tuyengiaovien.vn">hotro@tuyengiaovien.vn</a></dd>
            </div>
            <div>
              <dt>Website</dt>
              <dd><NuxtLink to="/">tuyengiaovien.vn</NuxtLink></dd>
            </div>
          </dl>
        </section>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const navItems = [
  { id: 'dieu-khoan-dieu-kien', label: 'Điều khoản & Điều kiện' },
  { id: 'chinh-sach-quyen-rieng-tu', label: 'Chính sách quyền riêng tư' },
  { id: 'lien-he-phap-ly', label: 'Liên hệ' },
] as const

type SectionId = (typeof navItems)[number]['id']

/** Hash cũ (#terms, #privacy, #contact) vẫn hoạt động */
const HASH_ALIASES: Record<string, SectionId> = {
  terms: 'dieu-khoan-dieu-kien',
  privacy: 'chinh-sach-quyen-rieng-tu',
  contact: 'lien-he-phap-ly',
  'dieu-khoan-dieu-kien': 'dieu-khoan-dieu-kien',
  'chinh-sach-quyen-rieng-tu': 'chinh-sach-quyen-rieng-tu',
  'lien-he-phap-ly': 'lien-he-phap-ly',
}

function resolveSectionId(rawHash: string): SectionId | null {
  const key = rawHash.replace(/^#/, '')
  if (!key) return null
  return HASH_ALIASES[key] ?? null
}

const activeSectionId = computed<SectionId>(() => {
  return resolveSectionId(route.hash || '') ?? 'dieu-khoan-dieu-kien'
})

function elementFor(id: SectionId) {
  if (typeof document === 'undefined') return null
  return document.getElementById(id)
}

function isPolicyPath() {
  const p = route.path.replace(/\/$/, '') || '/'
  return p === '/policy' || p.endsWith('/policy')
}

function scrollToSection(id: SectionId) {
  router.replace({ path: route.path, hash: `#${id}` })
}

onMounted(() => {
  const q = route.query.tab
  if (typeof q === 'string') {
    const mapped = resolveSectionId(q)
    if (mapped) {
      const newQuery = { ...route.query }
      delete (newQuery as Record<string, unknown>).tab
      router.replace({ path: route.path, query: newQuery, hash: `#${mapped}` })
    }
  }
})

watch(
  () => [isPolicyPath() ? 1 : 0, route.hash] as const,
  () => {
    if (!isPolicyPath()) return

    const id = resolveSectionId(route.hash || '')
    if (!id) return

    nextTick(() => {
      requestAnimationFrame(() => {
        const el = elementFor(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    })
  },
  { immediate: true, flush: 'post' },
)

useHead({
  title: 'Điều khoản & Chính sách quyền riêng tư',
  meta: [
    {
      name: 'description',
      content:
        'Điều khoản sử dụng, chính sách quyền riêng tư và thông tin liên hệ TuyenGiaoVien.vn',
    },
  ],
})
</script>

