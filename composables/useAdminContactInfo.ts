export type AdminContactInfo = {
  fullName: string
  email: string
  phoneNumber: string | null
}

function toTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('84')) return `tel:+${digits}`
  if (digits.startsWith('0')) return `tel:+84${digits.slice(1)}`
  return `tel:+${digits}`
}

export function useAdminContactInfo() {
  const { $api } = useNuxtApp()
  const contact = ref<AdminContactInfo | null>(null)
  const loading = ref(true)

  const load = async () => {
    loading.value = true
    try {
      contact.value = await $api.users.getPublicAdminContact()
    } catch {
      contact.value = null
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    load()
  })

  const email = computed(() => contact.value?.email?.trim() || '')
  const phoneNumber = computed(() => contact.value?.phoneNumber?.trim() || '')
  const fullName = computed(() => contact.value?.fullName?.trim() || '')
  const mailtoHref = computed(() => (email.value ? `mailto:${email.value}` : ''))
  const telHref = computed(() => (phoneNumber.value ? toTelHref(phoneNumber.value) : ''))

  return {
    contact,
    loading,
    email,
    phoneNumber,
    fullName,
    mailtoHref,
    telHref,
    reload: load,
  }
}
