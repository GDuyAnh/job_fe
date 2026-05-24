import type { CompanyEntity } from '~/entities/company'

export function useCompanyDetailView(company: Ref<CompanyEntity | null>) {
  const { organizationTypesLabel } = useJobFilters()

  const logoFallback = computed(() =>
    (company.value?.name || 'CT').slice(0, 2).toUpperCase(),
  )

  const companyLocationText = computed(() => {
    const raw = (company.value?.address || company.value?.provinceName || '').toString()
    if (!raw) return ''
    return raw.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  })

  function getOrganizationTypeLabel(type: number) {
    return organizationTypesLabel[type] ?? type
  }

  const heroMetaPrimary = computed(() => {
    if (company.value?.organizationType) {
      return getOrganizationTypeLabel(company.value.organizationType)
    }
    return company.value?.overview?.trim() || ''
  })

  const heroMetaLocation = computed(() => companyLocationText.value)

  const sidebarLocationText = computed(() => {
    if (company.value?.provinceName) return company.value.provinceName
    return companyLocationText.value
  })

  const openPositionsText = computed(() => {
    const count = Number(company.value?.openPositions ?? company.value?.jobs?.length ?? 0)
    return `${count} việc làm`
  })

  const galleryModalImages = computed(() => {
    if (!company.value) return [] as { url: string; alt: string }[]
    const urls = (company.value.companyImages || [])
      .map((img) => img.url)
      .filter(Boolean)
    if (!urls.length && company.value.bannerImage) {
      return [{ url: company.value.bannerImage, alt: `Ảnh ${company.value.name}` }]
    }
    return urls.map((url, idx) => ({
      url,
      alt: `Hình ảnh môi trường làm việc ${company.value!.name} ${idx + 1}`,
    }))
  })

  const galleryDisplayImages = computed(() => galleryModalImages.value.slice(0, 5))

  const videoPosterUrl = computed(() => {
    return (
      company.value?.bannerImage ||
      galleryModalImages.value[0]?.url ||
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80'
    )
  })

  const videoEmbedUrl = computed(() => {
    const raw = (company.value?.videoUrl || '').trim()
    if (!raw) return ''
    const ytMatch = raw.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/i)
    if (ytMatch?.[1]) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`
    if (raw.includes('youtube.com/embed/')) return raw
    return ''
  })

  const videoOpen = ref(false)
  const galleryModalOpen = ref(false)
  const galleryIndex = ref(0)

  function openGallery(index: number) {
    galleryIndex.value = index
    galleryModalOpen.value = true
  }

  function closeGallery() {
    galleryModalOpen.value = false
  }

  function galleryPrev() {
    const total = galleryModalImages.value.length
    if (!total) return
    galleryIndex.value = (galleryIndex.value - 1 + total) % total
  }

  function galleryNext() {
    const total = galleryModalImages.value.length
    if (!total) return
    galleryIndex.value = (galleryIndex.value + 1) % total
  }

  function openVideo() {
    if (!company.value?.videoUrl) return
    videoOpen.value = true
  }

  function resetMediaState() {
    galleryIndex.value = 0
    galleryModalOpen.value = false
    videoOpen.value = false
  }

  return {
    logoFallback,
    heroMetaPrimary,
    heroMetaLocation,
    sidebarLocationText,
    openPositionsText,
    galleryModalImages,
    galleryDisplayImages,
    videoPosterUrl,
    videoEmbedUrl,
    videoOpen,
    galleryModalOpen,
    galleryIndex,
    getOrganizationTypeLabel,
    openGallery,
    closeGallery,
    galleryPrev,
    galleryNext,
    openVideo,
    resetMediaState,
  }
}
