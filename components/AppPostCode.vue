<template>
  <app-form
    ref="formRef"
    :state="formValue"
    spacing
    :schema="schema"
    :disabled="disabled"
  >
    <app-form-field
      :label="$t('common.fields.postCode')"
      name="postalCode"
      class="w-full"
      required
    >
      <app-input
        v-model="formValue.postalCode"
        v-number
        :maxlength="CONSTANTS.MIN_LENGTH.POSTAL_CODE"
        :placeholder="$t('common.fields.postCode')"
        @update:model-value="handlePostCodeInput"
      />
    </app-form-field>

    <app-form-field
      :label="$t('common.fields.prefecture')"
      name="prefectureId"
      required
    >
      <app-select
        v-model="formValue.prefectureId"
        :placeholder="$t('common.fields.prefecture')"
        :items="prefecturesOptions"
      />
    </app-form-field>

    <app-form-field
      :label="$t('common.fields.municipalities')"
      name="municipalities"
      required
    >
      <app-input
        v-model="formValue.municipalities"
        :placeholder="$t('common.fields.municipalities')"
        :maxlength="CONSTANTS.MAX_LENGTH.MUNICIPALITIES"
      />
    </app-form-field>

    <app-form-field
      :label="$t('common.fields.address')"
      name="address"
      required
    >
      <app-input
        v-model.trim="formValue.address"
        :placeholder="$t('common.fields.address')"
        :maxlength="CONSTANTS.MAX_LENGTH.ADDRESS"
      />
    </app-form-field>
  </app-form>
</template>

<script setup lang="ts">
import type { PostalInfoType } from '~/constants/schema/postalInfo'
import type { MasterData } from '~/types/master-data'
import { postalInfoSchema } from '@/constants/schema/postalInfo'

const schema = postalInfoSchema()

const formValue = defineModel<PostalInfoType & Record<string, any>>(
  'modelValue',
  {
    required: true,
  },
)

const disabled = ref(false)

const prefecturesOptions = ref<MasterData[]>([])

const fetchPrefectures = async () => {
  prefecturesOptions.value = PREFECTURES.map((item) => ({
    value: String(item.id),
    label: item.label,
  }))
}

const formRef = ref()
// Initial value for comparing with postalCodeMasked
const handlePostCodeInput = async () => {
  if (
    String(formValue.value.postalCode).length ===
    CONSTANTS.MIN_LENGTH.POSTAL_CODE
  ) {
    const zipcode = formValue.value.postalCode

    try {
      disabled.value = true

      const response = await fetch(`${ROUTE_API.ZIPCODE}?zipcode=${zipcode}`)

      if (!response.ok) {
        console.error('Failed to fetch zipcode data')

        return
      }

      const data = await response.json()

      if (data.results) {
        formValue.value.prefectureId = String(data.results[0].prefcode)
        formValue.value.municipalities = data.results[0].address2
        formValue.value.address = data.results[0].address3
      } else {
        formValue.value.prefectureId = ''
        formValue.value.municipalities = ''
        formValue.value.address = ''
      }
      await nextTick()
      formRef.value?.clear()
    } catch (error) {
      console.error(error)
    } finally {
      disabled.value = false
    }
  }
}

defineExpose({
  validate: () => formValue.value?.validate(),
  resetFields: () => formValue.value?.resetFields(),
  clear: () => formRef.value?.clear(),
})

onMounted(() => {
  fetchPrefectures()
})
</script>
