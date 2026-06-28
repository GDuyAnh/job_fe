<template>
  <div class="page-job-upload">
    <div class="employer-post-shell">
      <header class="employer-page-head">
        <button
          type="button"
          class="employer-page-back"
          aria-label="Quay lại trang chủ"
          @click="goBack"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M15 6L9 12L15 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <h1 data-post-page-title>{{ $t('job.uploadJob.title') }}</h1>
      </header>

      <div
        class="employer-post-card"
        data-post-wizard
        data-post-wizard-mode="standalone"
        data-company-lookup-required="true"
      >
        <div class="employer-stepper" aria-label="Tiến trình đăng tin">
          <div class="employer-stepper-track" aria-hidden="true" />
          <div
            class="employer-step"
            :class="{ 'is-active': wizardStep === 0, 'is-done': wizardStep > 0 }"
            data-step-indicator="1"
          >
            <button
              v-if="wizardStep > 0"
              type="button"
              class="employer-step-icon employer-step-icon-btn"
              :aria-label="$t('job.uploadJob.stepCompanyInfo')"
              @click="goBackToCompanyStep()"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 4L19 8V19H5V8L12 4Z"
                  stroke="currentColor"
                  stroke-width="1.9"
                  stroke-linejoin="round"
                />
                <path
                  d="M9 19V12H15V19"
                  stroke="currentColor"
                  stroke-width="1.9"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <span v-else class="employer-step-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 4L19 8V19H5V8L12 4Z"
                  stroke="currentColor"
                  stroke-width="1.9"
                  stroke-linejoin="round"
                />
                <path
                  d="M9 19V12H15V19"
                  stroke="currentColor"
                  stroke-width="1.9"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <strong>{{ $t('job.uploadJob.stepCompanyInfo') }}</strong>
          </div>
          <div
            class="employer-step"
            :class="{ 'is-active': wizardStep === 1 }"
            data-step-indicator="2"
          >
            <span class="employer-step-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"
                  stroke="currentColor"
                  stroke-width="1.9"
                  stroke-linejoin="round"
                />
                <path
                  d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                  stroke="currentColor"
                  stroke-width="1.9"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <strong>{{ $t('job.uploadJob.stepPostDetail') }}</strong>
          </div>
        </div>

        <div class="upload-stepper-wrap">
        <UStepper
          ref="stepper"
          :items="steppers"
          class="w-full stepper-cus stepper-cus--compact"
          color="primary"
          size="lg"
          disabled
          :ui="{
            header: 'hidden',
            title: 'text-xs font-medium text-slate-600',
            wrapper: 'mt-0',
          }"
        >
          <template #school>
            <section class="employer-step-panel">
              <form class="employer-lookup-form" data-company-lookup-form @submit.prevent="findCompanyByMst()">
                <div class="employer-field-stack employer-field-full">
                  <label class="employer-input-label" for="company-mst">
                    {{ $t('job.uploadJob.mstLabel') }}
                    <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                  </label>
                  <div class="employer-inline-field">
                    <UInput
                      id="company-mst"
                      v-model="mstCompany"
                      variant="outline"
                      class="w-full min-w-0 flex-1 text-sm"
                      :ui="{ base: 'h-11 w-full rounded-xl' }"
                      :placeholder="$t('company.action.placeHolderMST')"
                      inputmode="numeric"
                      @input="onMstCompanyInput"
                      @keydown.enter="findCompanyByMst()"
                    />
                    <UButton
                      type="submit"
                      icon="i-lucide-search"
                      :label="isGettingCompanyByMst ? '...' : $t('job.uploadJob.lookupMst')"
                      variant="soft"
                      color="neutral"
                      class="job-upload-lookup-btn employer-secondary-btn h-11 shrink-0"
                      :loading="isGettingCompanyByMst"
                      @click.prevent="findCompanyByMst()"
                    />
                  </div>
                </div>
              </form>

              <div
                v-if="isDisplayInputCompany"
                class="employer-company-panel"
                data-company-panel
              >
                <div class="employer-company-found" role="status">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      d="M22 4 12 14.01l-3-3"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>{{ $t('job.uploadJob.lookupFoundTitle') }}</span>
                </div>

                <div class="employer-field-stack">
                  <label
                    class="employer-input-label"
                    for="company-name"
                  >
                    {{ $t('company.name') }}
                    <span aria-hidden="true" class="text-red-500">{{
                      $t('common.requiredMark')
                    }}</span>
                  </label>
                  <UInput
                    id="company-name"
                    v-model="companyAdd.name"
                    variant="outline"
                    :readonly="isDisplayInputCompany"
                    :ui="{
                      root: 'w-full',
                      base: [
                        'h-11 rounded-xl w-full',
                        companyErrors.name
                          ? 'ring-1 ring-inset ring-red-200/80 border border-red-500'
                          : companyFieldsLookupHighlight
                            ? 'ring-1 ring-inset ring-sky-200/80 border-sky-300/80'
                            : '',
                      ]
                        .filter(Boolean)
                        .join(' '),
                    }"
                    @input="companyErrors.name = ''"
                  />
                  <p
                    v-if="companyErrors.name"
                    class="mt-0.5 text-sm !text-red-500"
                  >
                    {{ companyErrors.name }}
                  </p>
                </div>

                <div class="employer-field-stack">
                  <label
                    class="employer-input-label"
                    for="company-tax-address"
                  >
                    Địa chỉ thuế
                  </label>
                  <UInput
                    id="company-tax-address"
                    v-model.trim="companyAdd.taxAddress"
                    :readonly="isDisplayInputCompany"
                    placeholder="Địa chỉ thuế"
                    :ui="{
                      root: 'w-full',
                      base: [
                        'h-11 rounded-xl w-full',
                        companyErrors.taxAddress
                          ? 'ring-1 ring-inset ring-red-200/80 border border-red-500'
                          : companyFieldsLookupHighlight
                            ? 'ring-1 ring-inset ring-sky-200/80 border-sky-300/80'
                            : '',
                      ]
                        .filter(Boolean)
                        .join(' '),
                    }"
                    @input="companyErrors.taxAddress = ''"
                  />
                  <p
                    v-if="companyErrors.taxAddress"
                    class="mt-0.5 text-sm !text-red-500"
                  >
                    {{ companyErrors.taxAddress }}
                  </p>
                </div>

                <!-- Social links and Video (removed for free-post) -->
                <!-- Logo uploader hidden in free-post -->
                <div v-if="false" class="pt-5">
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.form.logoTitle') }}
                    <span aria-hidden="true" class="text-black">{{
                      $t('common.requiredMark')
                    }}</span>
                  </label>

                  <div
                    class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition bg-gray-50"
                    :class="[
                      isDraggingLogo
                        ? 'ring-2 ring-blue-400 bg-blue-50'
                        : 'border-gray-400',
                      companyErrors.logo ? 'border-red-500' : ''
                    ]"
                    @click="logoFileEl?.click()"
                    @dragenter.prevent="onDragEnterLogo"
                    @dragover.prevent
                    @dragleave.prevent="onDragLeaveLogo"
                    @drop="onDropLogo"
                  >
                    <input
                      ref="logoFileEl"
                      type="file"
                      :accept="IMAGE_UPLOAD_ACCEPT"
                      class="hidden"
                      @change="onPickLogo"
                    />

                    <div v-if="logoPreview" class="flex flex-col gap-4">
                      <div class="flex justify-center">
                        <div
                          class="relative p-2 bg-white rounded-lg border shadow-sm inline-flex items-center justify-center"
                        >
                          <img
                            :src="logoPreview"
                            class="max-h-40 max-w-[260px] h-auto w-auto object-contain rounded-md"
                            draggable="false"
                          />
                          <span
                            class="absolute top-2 left-2 px-2 py-0.5 text-xs rounded bg-blue-600 text-white"
                          >
                            {{ $t('company.form.logoBadge') }}
                          </span>
                          <UButton
                            icon="i-lucide-crop"
                            color="primary"
                            size="xs"
                            variant="solid"
                            class="absolute top-8 left-2"
                            :aria-label="$t('common.cropImage')"
                            @click.stop="openCropModal"
                          />
                          <UButton
                            icon="i-lucide-trash-2"
                            color="error"
                            size="xs"
                            variant="solid"
                            class="absolute top-2 right-2"
                            :aria-label="$t('common.remove')"
                            @click.stop="removeLogo"
                          />
                        </div>
                      </div>
                    </div>

                    <div v-else class="text-gray-500">
                      {{ $t('company.form.dropHintLogo') }}
                    </div>
                  </div>
                  <p v-if="companyErrors.logo" class="!text-red-500 text-sm mt-1">
                    {{ companyErrors.logo }}
                  </p>
                </div>

                <!-- Banner Image hidden in free-post -->
                <div v-if="false" class="pt-5">
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.form.bannerTitle') }}
                  </label>

                  <div
                    class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition bg-gray-50"
                    :class="
                      isDraggingBanner
                        ? 'ring-2 ring-blue-400 bg-blue-50'
                        : 'border-gray-400'
                    "
                    @click="bannerFileEl?.click()"
                    @dragenter.prevent="onDragEnterBanner"
                    @dragover.prevent
                    @dragleave.prevent="onDragLeaveBanner"
                    @drop="onDropBanner"
                  >
                    <input
                      ref="bannerFileEl"
                      type="file"
                      :accept="IMAGE_UPLOAD_ACCEPT"
                      class="hidden"
                      @change="onPickBanner"
                    />

                    <div v-if="bannerPreview" class="flex flex-col gap-4">
                      <div class="flex justify-center">
                        <div
                          class="relative p-2 bg-white rounded-lg border shadow-sm inline-flex items-center justify-center"
                        >
                          <img
                            :src="bannerPreview"
                            class="max-h-60 max-w-full h-auto w-auto object-contain rounded-md"
                            draggable="false"
                          />
                          <UButton
                            icon="i-lucide-trash-2"
                            color="error"
                            size="xs"
                            variant="solid"
                            class="absolute top-2 right-2"
                            :aria-label="$t('common.remove')"
                            @click.stop="removeBanner"
                          />
                        </div>
                      </div>
                    </div>

                    <div v-else class="text-gray-500">
                      {{ $t('company.form.bannerDropHint') }}
                    </div>
                  </div>
                </div>

                <!-- Company images uploader hidden in free-post -->
                <div v-if="false" class="pt-5">
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.form.imagesTitleAdditional') }}
                  </label>

                  <div
                    class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition bg-gray-50"
                    :class="
                      isDraggingImages
                        ? 'ring-2 ring-blue-400 bg-blue-50'
                        : 'border-gray-400'
                    "
                    @click="imagesFileEl?.click()"
                    @dragenter.prevent="onDragEnterImages"
                    @dragover.prevent
                    @dragleave.prevent="onDragLeaveImages"
                    @drop="onDropImages"
                  >
                    <input
                      ref="imagesFileEl"
                      type="file"
                      :accept="IMAGE_UPLOAD_ACCEPT"
                      multiple
                      class="hidden"
                      @change="onPickImages"
                    />

                    <div
                      v-if="imagePreviews.length > 0"
                      class="flex flex-col gap-4"
                    >
                      <div class="flex flex-wrap gap-4">
                        <div
                          v-for="(src, idx) in imagePreviews"
                          :key="src + idx"
                          class="relative p-2 bg-white rounded-lg border shadow-sm inline-flex items-center justify-center"
                        >
                          <img
                            :src="src"
                            class="max-h-40 max-w-[260px] h-auto w-auto object-contain rounded-md"
                            draggable="false"
                          />
                          <UButton
                            icon="i-lucide-trash-2"
                            color="error"
                            size="xs"
                            variant="solid"
                            class="absolute top-2 right-2"
                            :aria-label="$t('common.remove')"
                            @click.stop="removeImage(idx)"
                          />
                        </div>
                      </div>
                      <div class="flex justify-center">
                        <UButton
                          size="xs"
                          variant="soft"
                          @click.stop="imagesFileEl?.click()"
                        >
                          {{ $t('company.form.addMore') }}
                        </UButton>
                      </div>
                    </div>

                    <div v-else class="text-gray-500">
                      {{ $t('company.form.dropHint') }}
                    </div>
                  </div>
                </div>

                <div class="employer-actions">
                  <button
                    type="button"
                    class="employer-primary-btn"
                    data-company-confirm
                    @click="confirmCreateSchool()"
                  >
                    {{ $t('job.uploadJob.continueNext') }}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      style="margin-left: 6px"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 12h14M12 5l7 7-7 7"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </section>
          </template>
          <template #detail>
            <section class="employer-step-panel employer-step-detail-wrap">
              <UCollapsible
                v-model:open="step2BasicOpen"
                :unmount-on-hide="false"
                class="employer-accordion w-full"
                :class="{ 'is-open': step2BasicOpen }"
                :ui="{
                  content:
                    'data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-visible',
                }"
              >
                <template #default="{ open }">
                  <button
                    type="button"
                    class="employer-accordion-head"
                    :aria-expanded="open"
                    data-accordion-toggle
                  >
                    <span class="employer-accordion-num">1</span>
                    <span class="employer-accordion-label">Thông tin cơ bản</span>
                    <svg class="employer-accordion-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </template>
                <template #content>
                  <div class="employer-accordion-body">
                    <div class="employer-field-stack">
                      <label for="job-title" class="employer-input-label">
                        {{ $t('job.uploadJob.nameJobLabel') }}
                        <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                      </label>
                      <UInput
                        id="job-title"
                        v-model="job.title"
                        :placeholder="$t('job.uploadJob.nameJobPlaceHolder')"
                        :ui="{
                          root: 'w-full',
                          base: 'h-11 w-full rounded-xl' + fieldErrorRingClass(jobErrors.title),
                        }"
                        @input="jobErrors.title = ''"
                      />
                      <p v-if="jobErrors.title" class="mt-1 text-sm !text-red-500">{{ jobErrors.title }}</p>
                    </div>

                    <div class="mt-4 employer-field-stack rich-text-output">
                      <label class="employer-input-label">
                        {{ $t('job.uploadJob.detailJobLabel') }}
                        <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                      </label>
                      <RichTextEditor
                        id="job-detail-description"
                        v-model="job.detailDescription"
                        class="w-full rich-text-content"
                        :class="{ 'ring-1 ring-red-300': jobErrors.detailDescription }"
                        placeholder="Nhập mô tả công việc"
                      />
                      <p v-if="jobErrors.detailDescription" class="mt-1 text-sm !text-red-500">{{ jobErrors.detailDescription }}</p>
                    </div>

                    <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div class="employer-field-stack">
                        <label class="employer-input-label">
                          {{ $t('job.uploadJob.categoryLabel') }}
                          <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                        </label>
                        <div
                          class="job-vselect w-full min-w-0"
                          :class="{ 'job-vselect--error': jobErrors.category }"
                        >
                          <v-select
                            v-model="categoryForSelect"
                            :options="categoryItemsSearchable"
                            :append-to-body="true"
                            :calculate-position="vueSelectCalculatePosition"
                            multiple
                            searchable
                            class="w-full text-sm"
                            :placeholder="$t('job.uploadJob.chooseCategory')"
                            label="label"
                            :clear-search-on-blur="() => true"
                            @open="onMultiSelectOpen"
                            @close="onMultiSelectClose"
                            @update:model-value="jobErrors.category = ''"
                          />
                        </div>
                        <p v-if="jobErrors.category" class="mt-1 text-sm !text-red-500">{{ jobErrors.category }}</p>
                      </div>
                      <div class="employer-field-stack">
                        <label class="employer-input-label">
                          {{ $t('job.uploadJob.typeJobLabel') }}
                          <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                        </label>
                        <USelect
                          :items="employmentTypeItems"
                          :model-value="job.typeOfEmployment?.toString()"
                          :placeholder="$t('job.uploadJob.chooseTypeOfEmployment')"
                          :ui="{
                            base: 'h-11 w-full rounded-xl' + fieldErrorRingClass(jobErrors.typeOfEmployment),
                          }"
                          class="w-full text-sm"
                          :content="{ side: 'bottom' }"
                          @update:model-value="
                            (val) => {
                              job.typeOfEmployment = Number(val ?? 0)
                              jobErrors.typeOfEmployment = ''
                            }
                          "
                        />
                        <p v-if="jobErrors.typeOfEmployment" class="mt-1 text-sm !text-red-500">{{ jobErrors.typeOfEmployment }}</p>
                      </div>
                    </div>

                    <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div class="employer-field-stack">
                        <label class="employer-input-label">
                          {{ $t('job.uploadJob.gradeLabel') }}
                          <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                        </label>
                        <USelect
                          :items="gradeItems"
                          :model-value="job.grade?.toString() || ''"
                          :content="{ side: 'bottom' }"
                          :placeholder="$t('job.uploadJob.chooseGradeLevel')"
                          :ui="{
                            base: 'h-11 w-full rounded-xl' + fieldErrorRingClass(jobErrors.grade),
                          }"
                          class="w-full text-sm"
                          @update:model-value="
                            (val) => {
                              job.grade = Number(val ?? 0)
                              jobErrors.grade = ''
                            }
                          "
                        />
                        <p v-if="jobErrors.grade" class="mt-1 text-sm !text-red-500">{{ jobErrors.grade }}</p>
                      </div>
                      <div id="job-deadline-field" class="employer-field-stack">
                        <label class="employer-input-label">
                          {{ $t('job.uploadJob.deadlineLabel') }}
                          <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                        </label>
                        <UPopover>
                          <UButton
                            :ui="{
                              base:
                                'h-11 w-full justify-start rounded-xl bg-white text-sm font-medium' +
                                fieldErrorRingClass(jobErrors.deadline),
                            }"
                            color="neutral"
                            variant="outline"
                          >
                            <span class="flex w-full items-center justify-between gap-3">
                              <span class="min-w-0 truncate font-medium">
                                <template v-if="job.deadline">
                                  {{ formatDateDeadline(job.deadline) }}
                                </template>
                                <template v-else>
                                  {{ $t('job.uploadJob.chooseDate') }}
                                </template>
                              </span>

                              <UIcon
                                name="i-lucide-calendar"
                                class="h-4 w-4 shrink-0 text-slate-500"
                                aria-hidden="true"
                              />
                            </span>
                          </UButton>
                          <template #content>
                            <UCalendar
                              v-model="deadlineCalendarDate"
                              class="p-2"
                              :min-value="minDeadlineDate"
                              :max-value="maxDeadlineDate"
                              :is-hidden="isDeadlineDateHidden"
                              @update:model-value="jobErrors.deadline = ''"
                            />
                          </template>
                        </UPopover>
                        <p v-if="jobErrors.deadline" class="mt-1 text-sm !text-red-500">{{ jobErrors.deadline }}</p>
                      </div>
                    </div>

                    <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div class="employer-field-stack">
                        <label class="employer-input-label">
                          {{ $t('job.uploadJob.currentSalaryLabel') }}
                          <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                        </label>
                        <USelect
                          id="job-salary-type"
                          :items="salaryTypeItems"
                          :model-value="job.salaryType?.toString()"
                          :content="{ side: 'bottom' }"
                          :placeholder="$t('job.uploadJob.chooseSalaryType')"
                          :ui="{
                            base: 'h-11 w-full rounded-xl' + fieldErrorRingClass(jobErrors.salaryType),
                          }"
                          class="w-full text-sm"
                          @update:model-value="
                            (val) => {
                              job.salaryType = Number(val ?? 0)
                              jobErrors.salaryType = ''
                            }
                          "
                        />
                        <p v-if="jobErrors.salaryType" class="mt-1 text-sm !text-red-500">{{ jobErrors.salaryType }}</p>
                      </div>
                      <div v-if="job.salaryType != 5" class="employer-field-stack">
                        <label class="employer-input-label">
                          {{ $t('job.uploadJob.minSalaryLabel') }}
                          <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                        </label>
                        <UInput
                          id="job-salary-min"
                          :model-value="formatCurrency(job.salaryMin)"
                          type="text"
                          :placeholder="$t('job.uploadJob.minSalary')"
                          :ui="{
                            root: 'w-full',
                            base: 'h-11 w-full rounded-xl' + fieldErrorRingClass(jobErrors.salaryMin),
                          }"
                          class="w-full text-sm"
                          @update:model-value="(val) => {
                            job.salaryMin = unformatCurrency(val)
                            jobErrors.salaryMin = ''
                          }"
                        />
                        <p v-if="jobErrors.salaryMin" class="mt-1 text-sm !text-red-500">{{ jobErrors.salaryMin }}</p>
                      </div>
                      <div v-if="job.salaryType != 5" class="employer-field-stack">
                        <label class="employer-input-label">
                          {{ $t('job.uploadJob.maxSalaryLabel') }}
                          <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                        </label>
                        <UInput
                          id="job-salary-max"
                          :model-value="formatCurrency(job.salaryMax)"
                          type="text"
                          :placeholder="$t('job.uploadJob.maxSalary')"
                          :ui="{
                            root: 'w-full',
                            base: 'h-11 w-full rounded-xl' + fieldErrorRingClass(jobErrors.salaryMax),
                          }"
                          class="w-full text-sm"
                          @update:model-value="(val) => {
                            job.salaryMax = unformatCurrency(val)
                            jobErrors.salaryMax = ''
                          }"
                        />
                        <p v-if="jobErrors.salaryMax" class="mt-1 text-sm !text-red-500">{{ jobErrors.salaryMax }}</p>
                      </div>
                    </div>

                    <div class="job-address-location-fields">
                      <div class="employer-field-stack rich-text-output">
                        <label class="employer-input-label">
                          {{ $t('job.uploadJob.addressJobLabel') }}
                          <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                        </label>
                        <RichTextEditor
                          id="job-address"
                          v-model="job.address"
                          class="w-full rich-text-content"
                          :class="{ 'ring-1 ring-red-300': jobErrors.address }"
                          :placeholder="$t('job.uploadJob.addressJobPlaceholder')"
                        />
                        <p v-if="jobErrors.address" class="mt-1 text-sm !text-red-500">{{ jobErrors.address }}</p>
                      </div>
                      <div class="employer-field-stack">
                        <label class="employer-input-label">
                          {{ $t('job.uploadJob.locationJobLabel') }}
                          <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                        </label>
                        <div
                          class="job-vselect w-full min-w-0"
                          :class="{ 'job-vselect--error': jobErrors.location }"
                        >
                          <v-select
                            id="job-location"
                            v-model="locationForSelect"
                            :options="locationSelectItems"
                            :append-to-body="true"
                            :calculate-position="vueSelectCalculatePosition"
                            multiple
                            searchable
                            class="w-full text-sm"
                            :placeholder="$t('job.uploadJob.chooseLocation')"
                            label="label"
                            :clear-search-on-blur="() => true"
                            @open="onMultiSelectOpen"
                            @close="onMultiSelectClose"
                            @update:model-value="jobErrors.location = ''"
                          />
                        </div>
                        <p v-if="jobErrors.location" class="mt-1 text-sm !text-red-500">{{ jobErrors.location }}</p>
                      </div>
                    </div>
                  </div>
                </template>
              </UCollapsible>

              <UCollapsible
                v-model:open="step2CandidateOpen"
                :unmount-on-hide="false"
                class="employer-accordion w-full"
                :class="{ 'is-open': step2CandidateOpen }"
                :ui="{
                  content:
                    'data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-visible',
                }"
              >
                <template #default="{ open }">
                  <button type="button" class="employer-accordion-head" :aria-expanded="open" data-accordion-toggle>
                    <span class="employer-accordion-num">2</span>
                    <span class="employer-accordion-label">Yêu cầu ứng viên</span>
                    <svg class="employer-accordion-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </template>
                <template #content>
                  <div class="employer-accordion-body">
                    <div class="employer-grid">
                        <div class="employer-field-stack">
                          <label class="employer-input-label">
                            {{ $t('job.uploadJob.requiredQualificationLabel') }}
                            <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                          </label>
                          <div
                            id="job-required-qualification"
                            class="job-vselect w-full min-w-0"
                            :class="{ 'job-vselect--error': jobErrors.requiredQualification }"
                          >
                            <v-select
                              v-model="requiredQualificationForSelect"
                              :options="requiredQualificationSelectItems"
                              :append-to-body="true"
                            :calculate-position="vueSelectCalculatePosition"
                              multiple
                              searchable
                              class="w-full text-sm"
                              :placeholder="$t('job.uploadJob.requiredQualificationLabel')"
                              label="label"
                              :clear-search-on-blur="() => true"
                              @open="onMultiSelectOpen"
                              @close="onMultiSelectClose"
                              @update:model-value="jobErrors.requiredQualification = ''"
                            />
                          </div>
                          <p v-if="jobErrors.requiredQualification" class="mt-1 text-sm !text-red-500">{{ jobErrors.requiredQualification }}</p>
                        </div>
                        <div class="employer-field-stack">
                          <label class="employer-input-label">
                            {{ $t('job.uploadJob.experienceLabel') }}
                            <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                          </label>
                          <USelect
                            :items="experienceLevelItems"
                            :model-value="job.experienceLevel?.toString()"
                            :content="{ side: 'bottom' }"
                            :placeholder="$t('job.uploadJob.chooseExperienceLevel')"
                            :ui="{
                              base: 'h-11 w-full rounded-xl' + fieldErrorRingClass(jobErrors.experienceLevel),
                            }"
                            class="w-full text-sm"
                            @update:model-value="
                              (val) => {
                                job.experienceLevel = Number(val ?? 0)
                                jobErrors.experienceLevel = ''
                              }
                            "
                          />
                          <p v-if="jobErrors.experienceLevel" class="mt-1 text-sm !text-red-500">{{ jobErrors.experienceLevel }}</p>
                        </div>
                        <div class="employer-field-stack">
                          <label class="employer-input-label">
                            {{ $t('job.uploadJob.genderLabel') }}
                            <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                          </label>
                          <div
                            class="job-vselect w-full min-w-0"
                            :class="{ 'job-vselect--error': jobErrors.gender }"
                          >
                            <v-select
                              id="job-gender"
                              v-model="genderForSelect"
                              :options="genderItems"
                              :append-to-body="true"
                            :calculate-position="vueSelectCalculatePosition"
                              multiple
                              searchable
                              class="w-full text-sm"
                              :placeholder="$t('job.uploadJob.chooseGender')"
                              label="label"
                              :clear-search-on-blur="() => true"
                              @open="onMultiSelectOpen"
                              @close="onMultiSelectClose"
                              @update:model-value="jobErrors.gender = ''"
                            />
                          </div>
                          <p v-if="jobErrors.gender" class="mt-1 text-sm !text-red-500">{{ jobErrors.gender }}</p>
                        </div>
                        <div class="employer-field-stack">
                          <label class="employer-input-label">
                            {{ $t('job.uploadJob.benefitLabel') }}
                            <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                          </label>
                          <div
                            class="job-vselect w-full min-w-0"
                            :class="{ 'job-vselect--error': jobErrors.benefits }"
                          >
                            <v-select
                              id="job-benefit"
                              v-model="benefitsForSelect"
                              :options="jobBenefitsSelectItems"
                              :append-to-body="true"
                            :calculate-position="vueSelectCalculatePosition"
                              multiple
                              searchable
                              class="w-full text-sm"
                              :placeholder="$t('job.uploadJob.chooseBenefitLevel')"
                              label="label"
                              :clear-search-on-blur="() => true"
                              @open="onMultiSelectOpen"
                              @close="onMultiSelectClose"
                              @update:model-value="jobErrors.benefits = ''"
                            />
                          </div>
                          <p v-if="jobErrors.benefits" class="mt-1 text-sm !text-red-500">{{ jobErrors.benefits }}</p>
                        </div>
                      </div>
                    </div>
                  </template>
                </UCollapsible>

              <UCollapsible
                v-model:open="step2ContactOpen"
                :unmount-on-hide="false"
                class="employer-accordion w-full"
                :class="{ 'is-open': step2ContactOpen }"
                :ui="{
                  content:
                    'data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-visible',
                }"
              >
                <template #default="{ open }">
                  <button type="button" class="employer-accordion-head" :aria-expanded="open" data-accordion-toggle>
                    <span class="employer-accordion-num">3</span>
                    <span class="employer-accordion-label">Thông tin liên hệ</span>
                    <svg class="employer-accordion-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </template>
                <template #content>
                  <div class="employer-accordion-body">
                    <div class="employer-grid">
                        <div class="employer-field-stack">
                          <label for="job-email" class="employer-input-label">
                            {{ $t('job.uploadJob.emailJobLabel') }}
                            <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                          </label>
                          <UInput
                            id="job-email"
                            v-model.trim="job.email"
                            type="email"
                            :placeholder="$t('job.uploadJob.emailJobPlaceholder')"
                            :ui="{
                              root: 'w-full',
                              base: 'h-11 w-full rounded-xl' + fieldErrorRingClass(jobErrors.email),
                            }"
                            class="w-full text-sm"
                            @input="jobErrors.email = ''"
                          />
                          <p v-if="jobErrors.email" class="mt-1 text-sm !text-red-500">{{ jobErrors.email }}</p>
                        </div>
                        <div class="employer-field-stack">
                          <label for="job-phone" class="employer-input-label">
                            {{ $t('job.uploadJob.phoneJobLabel') }}
                            <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                          </label>
                          <UInput
                            id="job-phone"
                            v-model.trim="job.phoneNumber"
                            type="tel"
                            :placeholder="$t('job.uploadJob.phoneJobPlaceholder')"
                            :ui="{
                              root: 'w-full',
                              base: 'h-11 w-full rounded-xl' + fieldErrorRingClass(jobErrors.phoneNumber),
                            }"
                            class="w-full text-sm"
                            @input="jobErrors.phoneNumber = ''"
                          />
                          <p v-if="jobErrors.phoneNumber" class="mt-1 text-sm !text-red-500">{{ jobErrors.phoneNumber }}</p>
                        </div>
                    </div>
                  </div>
                </template>
              </UCollapsible>

              <label class="auth-check auth-check-terms employer-terms">
                <input v-model="agreeChecked" type="checkbox" :disabled="loading" />
                <span>
                  {{ $t('job.uploadJob.agreeUploadJobLabel') }}
                  <NuxtLink to="/policy#terms">{{ $t('job.uploadJob.agreePolicy') }}</NuxtLink>
                  {{ $t('job.uploadJob.and') }}
                  <NuxtLink to="/policy#privacy">{{ $t('job.uploadJob.agreePrivacy') }}</NuxtLink>
                </span>
              </label>

              <div class="employer-actions employer-actions-end">
                <button
                  type="button"
                  class="employer-primary-btn employer-submit-btn"
                  :disabled="!agreeChecked || loading"
                  data-job-submit
                  @click="addJob()"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="margin-right: 6px" aria-hidden="true">
                    <path d="M22 2 11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="m22 2-7 20-4-9-9-4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                  </svg>
                  <span data-job-submit-label>{{ loading ? '...' : $t('job.uploadJob.uploadJobContent') }}</span>
                </button>
              </div>
            </section>
          </template>
        </UStepper>
        </div>
      </div>
    </div>

    <!-- Crop Modal -->
    <Teleport to="body">
      <div
        v-if="showCropModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="closeCropModal"
      >
        <div
          class="bg-white rounded-lg shadow-xl w-full sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          @click.stop
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between p-4 border-b border-gray-200"
          >
            <h3 class="text-lg font-semibold">{{ $t('common.cropImage') }}</h3>
            <UButton
              icon="i-heroicons-x-mark"
              variant="ghost"
              color="neutral"
              @click="closeCropModal"
            />
          </div>

          <!-- Body -->
          <div class="p-4 overflow-auto flex-1">
            <div
              ref="cropContainer"
              class="relative w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center"
              style="min-height: 400px; max-height: 600px"
            >
              <img
                v-if="cropImageSrc"
                ref="cropImage"
                :src="cropImageSrc"
                style="
                  display: block;
                  max-width: 100%;
                  max-height: 100%;
                  width: auto;
                  height: 379px;
                  object-fit: contain;
                "
                @load="initCrop"
              />
              <div
                v-if="showCropArea"
                ref="cropArea"
                class="absolute border-2 border-gray-700 cursor-move"
                style="background-color: rgba(55, 65, 81, 0.4)"
                :style="cropAreaStyle"
                @mousedown="startCropDrag"
                @touchstart="startCropDrag"
              >
                <div
                  class="absolute inset-0 flex items-center justify-center text-white text-xs font-medium"
                >
                  {{ $t('common.dragToMove') }}
                </div>
                <!-- Resize handles -->
                <div
                  class="absolute w-4 h-4 bg-gray-700 border-2 border-white rounded-full cursor-nwse-resize"
                  style="top: -6px; left: -6px"
                  @mousedown.stop="(e) => startResize('nw', e)"
                  @touchstart.stop="(e) => startResize('nw', e)"
                />
                <div
                  class="absolute w-4 h-4 bg-gray-700 border-2 border-white rounded-full cursor-nesw-resize"
                  style="top: -6px; right: -6px"
                  @mousedown.stop="(e) => startResize('ne', e)"
                  @touchstart.stop="(e) => startResize('ne', e)"
                />
                <div
                  class="absolute w-4 h-4 bg-gray-700 border-2 border-white rounded-full cursor-nwse-resize"
                  style="bottom: -6px; right: -6px"
                  @mousedown.stop="(e) => startResize('se', e)"
                  @touchstart.stop="(e) => startResize('se', e)"
                />
                <div
                  class="absolute w-4 h-4 bg-gray-700 border-2 border-white rounded-full cursor-nesw-resize"
                  style="bottom: -6px; left: -6px"
                  @mousedown.stop="(e) => startResize('sw', e)"
                  @touchstart.stop="(e) => startResize('sw', e)"
                />
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-2 p-4 border-t border-gray-200">
            <UButton
              variant="ghost"
              color="neutral"
              :label="$t('common.cancel')"
              @click="closeCropModal"
            />
            <UButton
              color="primary"
              :label="$t('common.confirm')"
              @click="applyCrop"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

import { computed, nextTick, ref } from 'vue'
import { UButton } from '#components'
import type { StepperItem } from '@nuxt/ui'
import type {
  CompanyAddUpdateEntity,
  CompanyEntity,
  VietQRBusinessResponse,
} from '~/entities/company'
import type { JobModelAddUpdate } from '~/models/job'
import { CalendarDate, type DateValue } from '@internationalized/date'
import RichTextEditor from '~/components/RichTextEditor.vue'
import { handleMstInput } from '~/utils/mst'
import {
  resolveCompanySizeForSelect,
} from '~/constants/company-size'
import { normalizeCompanyLogo } from '~/utils/companyLogo'
import { IMAGE_UPLOAD_ACCEPT, validateImageUploadFile } from '~/utils/imageUploadValidation'
import { OrganizationType } from '~/enums/master-data'

/** Loại hình tổ chức mặc định khi ẩn field trên form free-post (Khác). */
const DEFAULT_COMPANY_ORGANIZATION_TYPE = OrganizationType.khac
const { t } = useI18n()
const { calculatePosition: vueSelectCalculatePosition } = useVueSelectFixedPosition()

useHead({
  title: computed(() => t('job.uploadJob.title')),
})
const stepper = useTemplateRef('stepper')
const wizardStep = ref(0)
const steppers = computed<StepperItem[]>(() => [
  {
    slot: 'school' as const,
    title: t('job.uploadJob.stepCompanyInfo'),
    icon: 'i-lucide-home',
  },
  {
    slot: 'detail' as const,
    title: t('job.uploadJob.stepPostDetail'),
    icon: 'i-lucide-file-text',
  },
])

const step2BasicOpen = ref(true)
const step2CandidateOpen = ref(true)
const step2ContactOpen = ref(true)

// Scroll lock for vue-select — chặn scroll nền, giữ gutter để không giật layout
const vSelectOpenCount = ref(0)
let scrollLockSnapshot: {
  paddingRight: string
  scrollY: number
} | null = null

const setVSelectScrollLock = (locked: boolean) => {
  if (typeof document === 'undefined') return
  const body = document.body
  const docEl = document.documentElement

  if (locked) {
    if (body.classList.contains('vselect-scroll-lock')) return
    const scrollbarWidth = Math.max(0, window.innerWidth - docEl.clientWidth)
    scrollLockSnapshot = {
      paddingRight: body.style.paddingRight,
      scrollY: window.scrollY,
    }
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }
    body.classList.add('vselect-scroll-lock')
    return
  }

  if (!body.classList.contains('vselect-scroll-lock')) return
  body.classList.remove('vselect-scroll-lock')
  if (scrollLockSnapshot) {
    body.style.paddingRight = scrollLockSnapshot.paddingRight
    window.scrollTo(0, scrollLockSnapshot.scrollY)
    scrollLockSnapshot = null
  }
}

const onMultiSelectOpen = () => {
  vSelectOpenCount.value += 1
  if (vSelectOpenCount.value === 1) setVSelectScrollLock(true)
}

const onMultiSelectClose = () => {
  vSelectOpenCount.value = Math.max(0, vSelectOpenCount.value - 1)
  if (vSelectOpenCount.value === 0) setVSelectScrollLock(false)
}

/** UInput / USelect / UButton: viền đỏ khi lỗi (ring nằm ở `ui.base`, không ăn từ `class` bên ngoài). */
function fieldErrorRingClass(errorMsg: string | undefined | null) {
  return errorMsg ? ' !ring-1 !ring-inset !ring-red-500' : ''
}

// Removed tabs - only MST lookup now

// Enum
const {
  categoryItemsSearchable,
  employmentTypeItems,
  experienceLevelItems,
  locationItemsWithoutAll,
  jobBenefitsItems,
  salaryTypeItems,
  requiredQualificationItems,
  genderItems,
  gradeItems,
} = useJobFilters()

const requiredQualificationSelectItems = computed(() =>
  [...requiredQualificationItems.value].sort((a, b) =>
    a.label.localeCompare(b.label, 'vi', { sensitivity: 'base' }),
  ),
)

const jobBenefitsSelectItems = computed(() =>
  [...jobBenefitsItems.value].sort((a, b) =>
    a.label.localeCompare(b.label, 'vi', { sensitivity: 'base' }),
  ),
)

/** Tỉnh/thành: giữ "Toàn Quốc" đầu list, sort A→Z phần còn lại. */
const locationSelectItems = computed(() => {
  const items = locationItemsWithoutAll.value
  const nationwide = items.find((item) => item.value === '0')
  const provinces = items
    .filter((item) => item.value !== '0')
    .sort((a, b) => a.label.localeCompare(b.label, 'vi', { sensitivity: 'base' }))

  return nationwide ? [nationwide, ...provinces] : provinces
})

// Computed properties for USelectMenu (convert between string[] and object[])
const categoryForSelect = computed({
  get: () => {
    if (!job.value.category || !Array.isArray(job.value.category)) return []

    return job.value.category
      .filter(c => c)
      .map(c => {
        const value = typeof c === 'object' && c !== null && 'value' in c ? (c as { value: string }).value : String(c)

        return categoryItemsSearchable.value.find(item => item.value === value) || { label: value, value }
      })
  },
  set: (val: any[]) => {
    job.value.category = val
      ? val.map(v => typeof v === 'object' && v !== null && 'value' in v ? (v as { value: string }).value : String(v))
      : []
  }
})

const locationForSelect = computed({
  get: () => {
    if (!job.value.location || !Array.isArray(job.value.location)) return []

    return job.value.location
      .filter(l => l)
      .map(l => {
        const value = typeof l === 'object' && l !== null && 'value' in l ? (l as { value: string }).value : String(l)

        return locationSelectItems.value.find(item => item.value === value) || { label: value, value }
      })
  },
  set: (val: any[]) => {
    job.value.location = val
      ? val.map(v => typeof v === 'object' && v !== null && 'value' in v ? (v as { value: string }).value : String(v))
      : []
  }
})

// Computed property for v-select benefits (convert between string[] and object[])
const benefitsForSelect = computed({
  get: () => {
    if (!job.value.benefits || !Array.isArray(job.value.benefits)) return []

    return job.value.benefits
      .filter(b => b)
      .map(b => {
        const value = typeof b === 'object' && b !== null && 'value' in b ? (b as { value: string }).value : String(b)

        return jobBenefitsSelectItems.value.find(item => item.value === value) || { label: value, value }
      })
  },
  set: (val: any[]) => {
    job.value.benefits = val
      ? val.map(v => typeof v === 'object' && v !== null && 'value' in v ? (v as { value: string }).value : String(v))
      : []
  }
})

// Computed property for v-select required qualification (convert between string[] and object[])
const requiredQualificationForSelect = computed({
  get: () => {
    if (
      !job.value.requiredQualification ||
      !Array.isArray(job.value.requiredQualification)
    ) {
      return []
    }

    return job.value.requiredQualification
      .filter((q) => q)
      .map((q) => {
        const value =
          typeof q === 'object' && q !== null && 'value' in q
            ? (q as { value: string }).value
            : String(q)

        return (
          requiredQualificationSelectItems.value.find((item) => item.value === value) || {
            label: value,
            value,
          }
        )
      })
  },
  set: (val: any[]) => {
    job.value.requiredQualification = val
      ? val.map((v) =>
          typeof v === 'object' && v !== null && 'value' in v
            ? (v as { value: string }).value
            : String(v),
        )
      : []
  },
})

// Computed property for v-select gender (convert between string[] and object[])
const genderForSelect = computed({
  get: () => {
    if (!job.value.gender || !Array.isArray(job.value.gender)) return []

    return job.value.gender
      .filter(g => g)
      .map(g => {
        const value = typeof g === 'object' && g !== null && 'value' in g ? (g as { value: string }).value : String(g)

        return genderItems.value.find(item => item.value === value) || { label: value, value }
      })
  },
  set: (val: any[]) => {
    job.value.gender = val
      ? val.map(v => typeof v === 'object' && v !== null && 'value' in v ? (v as { value: string }).value : String(v))
      : []
  }
})

/** Logo state (REQUIRED) */
const logoFileEl = ref<HTMLInputElement | null>(null)
const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)
const isDraggingLogo = ref(false)

/** Banner image state */
const bannerFileEl = ref<HTMLInputElement | null>(null)
const bannerFile = ref<File | null>(null)
const bannerPreview = ref<string | null>(null)
const isDraggingBanner = ref(false)

/** Crop modal state */
const showCropModal = ref(false)
const cropImageSrc = ref<string | null>(null)
const cropContainer = ref<HTMLElement | null>(null)
const cropImage = ref<HTMLImageElement | null>(null)
const cropArea = ref<HTMLElement | null>(null)
const showCropArea = ref(false)
const cropAreaStyle = ref({
  left: '10%',
  top: '10%',
  width: '80%',
  height: '80%',
})
const cropData = ref({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  imageWidth: 0,
  imageHeight: 0,
  containerWidth: 0,
  containerHeight: 0,
})
const isDragging = ref(false)
const isResizing = ref(false)
const resizeDirection = ref('')
const dragStart = ref({ x: 0, y: 0 })
const cropAreaStart = ref({ left: 0, top: 0, width: 0, height: 0 })

function onDragEnterLogo() {
  isDraggingLogo.value = true
}
function onDragLeaveLogo() {
  isDraggingLogo.value = false
}

function onDropLogo(e: DragEvent) {
  isDraggingLogo.value = false
  const files = e.dataTransfer?.files

  if (!files?.length) return

  const file = files[0]
  if (!file) return

  const validationError = validateImageUploadFile(file)
  if (validationError) {
    useNotify({ type: 'error', message: validationError })
    return
  }

  setLogoFile(file)
}

function onPickLogo(e: Event) {
  const files = (e.target as HTMLInputElement).files

  if (!files?.length) return

  const file = files[0]
  if (!file) return

  const validationError = validateImageUploadFile(file)
  if (validationError) {
    useNotify({ type: 'error', message: validationError })
    if (logoFileEl.value) logoFileEl.value.value = ''
    return
  }

  setLogoFile(file)
  if (logoFileEl.value) logoFileEl.value.value = ''
}

function setLogoFile(file: File) {
  // Revoke old preview URL if exists
  if (logoPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(logoPreview.value)
  }
  logoFile.value = file
  logoPreview.value = URL.createObjectURL(file)
}

function removeLogo() {
  if (logoPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(logoPreview.value)
  }
  logoFile.value = null
  logoPreview.value = null
}

function openCropModal() {
  if (!logoFile.value) return

  // Create a new FileReader to read the file
  const reader = new FileReader()

  reader.onload = (e) => {
    cropImageSrc.value = e.target?.result as string
    showCropModal.value = true
  }
  reader.readAsDataURL(logoFile.value)
}

function closeCropModal() {
  showCropModal.value = false
  cropImageSrc.value = null
  showCropArea.value = false
}

function initCrop() {
  if (!cropImage.value || !cropContainer.value) return

  nextTick(() => {
    const img = cropImage.value!
    const container = cropContainer.value!
    const containerRect = container.getBoundingClientRect()
    const imgRect = img.getBoundingClientRect()

    // Calculate initial crop area (80% of image, centered)
    const cropWidth = imgRect.width * 0.8
    const cropHeight = imgRect.height * 0.8
    const cropLeft =
      imgRect.left - containerRect.left + (imgRect.width - cropWidth) / 2
    const cropTop =
      imgRect.top - containerRect.top + (imgRect.height - cropHeight) / 2

    cropAreaStyle.value = {
      left: `${(cropLeft / containerRect.width) * 100}%`,
      top: `${(cropTop / containerRect.height) * 100}%`,
      width: `${(cropWidth / containerRect.width) * 100}%`,
      height: `${(cropHeight / containerRect.height) * 100}%`,
    }

    cropData.value = {
      x: cropLeft,
      y: cropTop,
      width: cropWidth,
      height: cropHeight,
      imageWidth: imgRect.width,
      imageHeight: imgRect.height,
      containerWidth: containerRect.width,
      containerHeight: containerRect.height,
    }

    showCropArea.value = true
  })
}

function startCropDrag(e: MouseEvent | TouchEvent) {
  e.preventDefault()
  e.stopPropagation()

  if (!cropContainer.value || !cropArea.value) return

  isDragging.value = true
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

  const containerRect = cropContainer.value.getBoundingClientRect()
  const areaRect = cropArea.value.getBoundingClientRect()

  dragStart.value = { x: clientX, y: clientY }
  cropAreaStart.value = {
    left: areaRect.left - containerRect.left,
    top: areaRect.top - containerRect.top,
    width: areaRect.width,
    height: areaRect.height,
  }

  document.addEventListener('mousemove', handleCropDrag, { passive: false })
  document.addEventListener('mouseup', stopCropDrag)
  document.addEventListener('touchmove', handleCropDrag, { passive: false })
  document.addEventListener('touchend', stopCropDrag)
}

function handleCropDrag(e: MouseEvent | TouchEvent) {
  if (!isDragging.value || !cropContainer.value) return

  e.preventDefault()
  e.stopPropagation()

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

  const deltaX = clientX - dragStart.value.x
  const deltaY = clientY - dragStart.value.y

  const containerRect = cropContainer.value.getBoundingClientRect()

  let newLeft = cropAreaStart.value.left + deltaX
  let newTop = cropAreaStart.value.top + deltaY

  // Constrain to container bounds
  newLeft = Math.max(
    0,
    Math.min(containerRect.width - cropAreaStart.value.width, newLeft),
  )
  newTop = Math.max(
    0,
    Math.min(containerRect.height - cropAreaStart.value.height, newTop),
  )

  cropAreaStyle.value = {
    ...cropAreaStyle.value,
    left: `${(newLeft / containerRect.width) * 100}%`,
    top: `${(newTop / containerRect.height) * 100}%`,
  }
}

function stopCropDrag(e?: MouseEvent | TouchEvent) {
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }

  isDragging.value = false
  document.removeEventListener('mousemove', handleCropDrag)
  document.removeEventListener('mouseup', stopCropDrag)
  document.removeEventListener('touchmove', handleCropDrag)
  document.removeEventListener('touchend', stopCropDrag)
}

function startResize(direction: string, e: MouseEvent | TouchEvent) {
  e.preventDefault()
  e.stopPropagation()

  if (!cropContainer.value || !cropArea.value) return

  isResizing.value = true
  resizeDirection.value = direction

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

  const containerRect = cropContainer.value.getBoundingClientRect()
  const areaRect = cropArea.value.getBoundingClientRect()

  dragStart.value = { x: clientX, y: clientY }
  cropAreaStart.value = {
    left: areaRect.left - containerRect.left,
    top: areaRect.top - containerRect.top,
    width: areaRect.width,
    height: areaRect.height,
  }

  document.addEventListener('mousemove', handleResize, { passive: false })
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('touchmove', handleResize, { passive: false })
  document.addEventListener('touchend', stopResize)
}

function handleResize(e: MouseEvent | TouchEvent) {
  if (!isResizing.value || !cropContainer.value) return

  e.preventDefault()
  e.stopPropagation()

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

  const deltaX = clientX - dragStart.value.x
  const deltaY = clientY - dragStart.value.y

  const containerRect = cropContainer.value.getBoundingClientRect()

  let newLeft = cropAreaStart.value.left
  let newTop = cropAreaStart.value.top
  let newWidth = cropAreaStart.value.width
  let newHeight = cropAreaStart.value.height

  const minSize = 50

  // Handle resize based on direction
  if (resizeDirection.value === 'n') {
    // Resize from top
    newHeight = Math.max(minSize, cropAreaStart.value.height - deltaY)
    newTop = cropAreaStart.value.top + (cropAreaStart.value.height - newHeight)
  } else if (resizeDirection.value === 's') {
    // Resize from bottom
    newHeight = Math.max(
      minSize,
      Math.min(
        containerRect.height - cropAreaStart.value.top,
        cropAreaStart.value.height + deltaY,
      ),
    )
  } else if (resizeDirection.value === 'w') {
    // Resize from left
    newWidth = Math.max(minSize, cropAreaStart.value.width - deltaX)
    newLeft = cropAreaStart.value.left + (cropAreaStart.value.width - newWidth)
  } else if (resizeDirection.value === 'e') {
    // Resize from right
    newWidth = Math.max(
      minSize,
      Math.min(
        containerRect.width - cropAreaStart.value.left,
        cropAreaStart.value.width + deltaX,
      ),
    )
  } else if (resizeDirection.value === 'nw') {
    // Resize from top-left corner
    newWidth = Math.max(minSize, cropAreaStart.value.width - deltaX)
    newHeight = Math.max(minSize, cropAreaStart.value.height - deltaY)
    newLeft = cropAreaStart.value.left + (cropAreaStart.value.width - newWidth)
    newTop = cropAreaStart.value.top + (cropAreaStart.value.height - newHeight)
  } else if (resizeDirection.value === 'ne') {
    // Resize from top-right corner
    newWidth = Math.max(
      minSize,
      Math.min(
        containerRect.width - cropAreaStart.value.left,
        cropAreaStart.value.width + deltaX,
      ),
    )
    newHeight = Math.max(minSize, cropAreaStart.value.height - deltaY)
    newTop = cropAreaStart.value.top + (cropAreaStart.value.height - newHeight)
  } else if (resizeDirection.value === 'se') {
    // Resize from bottom-right corner
    newWidth = Math.max(
      minSize,
      Math.min(
        containerRect.width - cropAreaStart.value.left,
        cropAreaStart.value.width + deltaX,
      ),
    )
    newHeight = Math.max(
      minSize,
      Math.min(
        containerRect.height - cropAreaStart.value.top,
        cropAreaStart.value.height + deltaY,
      ),
    )
  } else if (resizeDirection.value === 'sw') {
    // Resize from bottom-left corner
    newWidth = Math.max(minSize, cropAreaStart.value.width - deltaX)
    newHeight = Math.max(
      minSize,
      Math.min(
        containerRect.height - cropAreaStart.value.top,
        cropAreaStart.value.height + deltaY,
      ),
    )
    newLeft = cropAreaStart.value.left + (cropAreaStart.value.width - newWidth)
  }

  // Constrain to container bounds
  if (newLeft < 0) {
    newWidth += newLeft
    newLeft = 0
    if (newWidth < minSize) {
      newWidth = minSize
      newLeft = cropAreaStart.value.left + cropAreaStart.value.width - minSize
    }
  }
  if (newTop < 0) {
    newHeight += newTop
    newTop = 0
    if (newHeight < minSize) {
      newHeight = minSize
      newTop = cropAreaStart.value.top + cropAreaStart.value.height - minSize
    }
  }
  if (newLeft + newWidth > containerRect.width) {
    newWidth = containerRect.width - newLeft
    if (newWidth < minSize) {
      newWidth = minSize
      newLeft = containerRect.width - minSize
    }
  }
  if (newTop + newHeight > containerRect.height) {
    newHeight = containerRect.height - newTop
    if (newHeight < minSize) {
      newHeight = minSize
      newTop = containerRect.height - minSize
    }
  }

  // Ensure minimum size
  if (newWidth < minSize) {
    newWidth = minSize
  }
  if (newHeight < minSize) {
    newHeight = minSize
  }

  cropAreaStyle.value = {
    left: `${(newLeft / containerRect.width) * 100}%`,
    top: `${(newTop / containerRect.height) * 100}%`,
    width: `${(newWidth / containerRect.width) * 100}%`,
    height: `${(newHeight / containerRect.height) * 100}%`,
  }
}

function stopResize(e?: MouseEvent | TouchEvent) {
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }

  isResizing.value = false
  resizeDirection.value = ''
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', handleResize)
  document.removeEventListener('touchend', stopResize)
}

async function applyCrop() {
  if (
    !cropImageSrc.value ||
    !cropImage.value ||
    !cropArea.value ||
    !cropContainer.value
  )
    return

  try {
    // Create a new image to get actual dimensions
    const img = new Image()

    img.src = cropImageSrc.value

    await new Promise((resolve) => {
      img.onload = resolve
    })

    const areaRect = cropArea.value.getBoundingClientRect()
    const imgRect = cropImage.value.getBoundingClientRect()

    // Calculate crop coordinates relative to the actual image
    const scaleX = img.naturalWidth / imgRect.width
    const scaleY = img.naturalHeight / imgRect.height

    const cropX = (areaRect.left - imgRect.left) * scaleX
    const cropY = (areaRect.top - imgRect.top) * scaleY
    const cropWidth = areaRect.width * scaleX
    const cropHeight = areaRect.height * scaleY

    // Use ImageBitmap API to crop (no canvas needed)
    const croppedBlob = await cropImageUsingImageBitmap(
      cropImageSrc.value,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
    )

    // Create a new File from the cropped blob
    const croppedFile = new File(
      [croppedBlob],
      logoFile.value?.name || 'logo.png',
      {
        type: logoFile.value?.type || 'image/png',
      },
    )

    // Update logo file and preview
    if (logoPreview.value?.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview.value)
    }

    logoFile.value = croppedFile
    logoPreview.value = URL.createObjectURL(croppedBlob)

    closeCropModal()
  } catch (error) {
    console.error('Error cropping image:', error)
    useNotify({
      message: 'Có lỗi xảy ra khi cắt ảnh. Vui lòng thử lại.',
    })
  }
}

// Helper function to crop image using ImageBitmap API (no direct canvas code)
async function cropImageUsingImageBitmap(
  imageSrc: string,
  x: number,
  y: number,
  width: number,
  height: number,
): Promise<Blob> {
  // Create image element
  const img = new Image()

  img.src = imageSrc

  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
  })

  // Create ImageBitmap from the image
  const bitmap = await createImageBitmap(img, x, y, width, height)

  // Convert ImageBitmap to Blob using OffscreenCanvas (no visible canvas)
  const offscreen = new OffscreenCanvas(width, height)
  const ctx = offscreen.getContext('2d')

  if (!ctx) {
    throw new Error('Could not get 2d context')
  }

  ctx.drawImage(bitmap, 0, 0)

  const blob = await offscreen.convertToBlob({ type: 'image/png' })

  bitmap.close()

  return blob
}

/** Company images state (OPTIONAL) */
const imagesFileEl = ref<HTMLInputElement | null>(null)
const imageFiles = ref<File[]>([])
const imagePreviews = ref<string[]>([])
const isDraggingImages = ref(false)

function onDragEnterImages() {
  isDraggingImages.value = true
}
function onDragLeaveImages() {
  isDraggingImages.value = false
}

function onDropImages(e: DragEvent) {
  isDraggingImages.value = false
  const files = e.dataTransfer?.files

  if (!files?.length) return
  addImageFiles(Array.from(files))
}

function onPickImages(e: Event) {
  const files = (e.target as HTMLInputElement).files

  if (!files?.length) return
  addImageFiles(Array.from(files))
  if (imagesFileEl.value) imagesFileEl.value.value = ''
}

function addImageFiles(files: File[]) {
  for (const f of files) {
    const validationError = validateImageUploadFile(f)
    if (validationError) {
      useNotify({ type: 'error', message: validationError })
      continue
    }
    imageFiles.value.push(f)
    imagePreviews.value.push(URL.createObjectURL(f))
  }
}

function removeImage(idx: number) {
  const pv = imagePreviews.value[idx]

  if (pv?.startsWith('blob:')) URL.revokeObjectURL(pv)
  imagePreviews.value.splice(idx, 1)
  imageFiles.value.splice(idx, 1)
}

// Banner image handlers
function onDragEnterBanner() {
  isDraggingBanner.value = true
}
function onDragLeaveBanner() {
  isDraggingBanner.value = false
}
function onDropBanner(e: DragEvent) {
  isDraggingBanner.value = false
  const files = e.dataTransfer?.files

  if (!files?.length) return
  const file = files[0]
  if (!file) return

  const validationError = validateImageUploadFile(file)
  if (validationError) {
    useNotify({ type: 'error', message: validationError })
    return
  }

  if (bannerPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(bannerPreview.value)
  }
  bannerFile.value = file
  bannerPreview.value = URL.createObjectURL(file)
}
function onPickBanner(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files

  if (!files?.length) return
  const file = files[0]
  if (!file) return

  const validationError = validateImageUploadFile(file)
  if (validationError) {
    useNotify({ type: 'error', message: validationError })
    input.value = ''
    return
  }

  if (bannerPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(bannerPreview.value)
  }
  bannerFile.value = file
  bannerPreview.value = URL.createObjectURL(file)
  if (bannerFileEl.value) bannerFileEl.value.value = ''
}
function removeBanner() {
  if (bannerPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(bannerPreview.value)
  }
  bannerFile.value = null
  bannerPreview.value = null
  companyAdd.value.bannerImage = null
}

onBeforeUnmount(() => {
  // Cleanup logo preview
  if (logoPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(logoPreview.value)
  }
  // Cleanup banner preview
  if (bannerPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(bannerPreview.value)
  }
  // Cleanup image previews
  imagePreviews.value.forEach((pv) => {
    if (pv?.startsWith('blob:')) URL.revokeObjectURL(pv)
  })
})

// Route
const router = useRouter()
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const loading = ref(false)
const agreeChecked = ref(false)

// Confirm step states
type ConfirmStepState = 'incomplete' | 'success' | 'error'
const confirmStepState = ref<ConfirmStepState>('incomplete')
const job = ref<JobModelAddUpdate>({} as JobModelAddUpdate)

const companyAdd = ref<CompanyAddUpdateEntity>({
  id: undefined,
  name: '',
  mst: '',
  address: '',
  taxAddress: '',
  website: '',
  organizationType: DEFAULT_COMPANY_ORGANIZATION_TYPE,
  companySize: null,
  foundedYear: null,
  description: '',
  insight: '',
  overview: '',
  logo: '',
  facebookLink: '',
  twitterLink: '',
  instagramLink: '',
  linkedInLink: '',
  videoUrl: '',
  isWaiting: false,
  companyImages: [],
  bannerImage: null,
} as CompanyAddUpdateEntity)
const selectedCompany = ref<CompanyEntity | null>(null)
const companyByMST = ref<VietQRBusinessResponse | null>(null)

/** Validation errors */
const companyErrors = ref<Record<string, string>>({})
const jobErrors = ref<Record<string, string>>({})

// Initialize
onMounted(() => {
  // Nếu đã đăng nhập thì KHÔNG cho vào trang này: điều hướng về dashboard theo role
  if (authStore.user) {
    const userRole = authStore.user.role

    if (userRole === USER_ROLES.ADMIN) {
      router.push(ROUTE_PAGE.DASHBOARD.ADMIN)
      return
    }
    if (userRole === USER_ROLES.USER) {
      router.push(ROUTE_PAGE.DASHBOARD.USER)
      return
    }
    if (userRole === USER_ROLES.COMPANY) {
      router.push(ROUTE_PAGE.DASHBOARD.COMPANY + '?view=newJob')
      return
    }
  }

  // Cho phép người CHƯA đăng nhập sử dụng trang upload (free-post)
  job.value.postedDate = new Date()

  // No need to fetch all companies anymore
})

// Methods
const goBack = () => {
  router.back()
}

// Methods
const goToListJobUser = () => {
  router.push(ROUTE_PAGE.USER_JOB.LIST)
}

const mstCompany = ref('')

function onMstCompanyInput(event: Event) {
  handleMstInput(event, (value) => {
    mstCompany.value = value
  })
}

const isGettingCompanyByMst = ref(false)
const isAddCompany = ref(false)
const isExistCompany = ref(false)
const isDisplayInputCompany = ref(false)
const companyFieldsLookupHighlight = computed(
  () =>
    isDisplayInputCompany.value &&
    (isExistCompany.value || Boolean(companyByMST.value?.data)),
)

// Date picker for deadline
const parseDateString = (str: string | null): DateValue | null => {
  if (!str) return null
  const [year, month, day] = str.split('-').map(Number)

  if (!year || !month || !day) return null

  return new CalendarDate(year, month, day)
}

const formatDateToString = (date: DateValue | null): string => {
  if (!date) return ''

  const year = date.year
  const month = String(date.month).padStart(2, '0')
  const day = String(date.day).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// Format currency with commas
const formatCurrency = (value: string | undefined | null): string => {
  if (!value) return ''

  // Remove all non-digit characters
  const numericValue = String(value).replace(/\D/g, '')

  if (!numericValue) return ''

  // Format with commas
  return Number(numericValue).toLocaleString('en-US')
}

// Unformat currency (remove commas)
const unformatCurrency = (value: string): string => {
  if (!value) return ''

  // Remove all non-digit characters
  return String(value).replace(/\D/g, '')
}

const formatDateDeadline = (dateStr: string): string => {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

// Calendar date binding
const deadlineCalendarDate = computed({
  get: () => parseDateString(job.value.deadline || null),
  set: (val: DateValue | null) => {
    job.value.deadline = formatDateToString(val)
  },
})

const {
  minDeadlineDate,
  maxDeadlineDate,
  isDeadlineDateHidden,
  isDeadlineTooEarly,
} = useJobDeadlineDate()

const findCompanyByMst = async () => {
  isGettingCompanyByMst.value = true
  loading.value = true
  isDisplayInputCompany.value = false
  isExistCompany.value = false

  // Reset logo and images when searching new company
  removeLogo()
  imageFiles.value.forEach((_, idx) => {
    if (imagePreviews.value[idx]?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews.value[idx])
    }
  })
  imageFiles.value = []
  imagePreviews.value = []

  try {
    if (!mstCompany.value || mstCompany.value.trim().length === 0) {
      useNotify({
        message: 'Vui lòng nhập mã số thuế để tra cứu.',
      })

      return
    }

    // Step 1: Check if MST exists in database first
    let existingCompany: CompanyEntity | null = null

    try {
      // Try to get company from database by MST using checkExistMst endpoint
      existingCompany = await $api.company.checkExistMst(mstCompany.value)
    } catch (_error: any) {
      // If 404 or any error, company doesn't exist in DB
      console.log('Company not found in DB, trying VietQR lookup...')
      existingCompany = null
    }

    if (existingCompany) {
      // Company exists in DB - show readonly
      isExistCompany.value = true
      isDisplayInputCompany.value = true
      isAddCompany.value = false

      // Set company for job
      selectedCompany.value = existingCompany
      job.value.companyId = existingCompany.id

      // Fill form with existing data (readonly)
      if (!companyAdd.value) {
        companyAdd.value = {
          videoUrl: '',
          bannerImage: null,
        } as CompanyAddUpdateEntity
      }
      companyAdd.value.id = existingCompany.id ?? null
      companyAdd.value.name = existingCompany.name ?? ''
      companyAdd.value.address = existingCompany.address ?? ''
      companyAdd.value.taxAddress = existingCompany.taxAddress ?? ''
      companyAdd.value.mst = existingCompany.mst ?? null
      companyAdd.value.logo = normalizeCompanyLogo(existingCompany.logo) ?? ''
      companyAdd.value.organizationType =
        existingCompany.organizationType ?? DEFAULT_COMPANY_ORGANIZATION_TYPE
      companyAdd.value.facebookLink = existingCompany.facebookLink ?? ''
      companyAdd.value.twitterLink = existingCompany.twitterLink ?? ''
      companyAdd.value.linkedInLink = existingCompany.linkedInLink ?? ''
      companyAdd.value.website = existingCompany.website ?? ''
      companyAdd.value.companySize = resolveCompanySizeForSelect(existingCompany.companySize)
      companyAdd.value.foundedYear = existingCompany.foundedYear ?? null
      companyAdd.value.description = existingCompany.description ?? ''
      companyAdd.value.insight = existingCompany.insight ?? ''
      companyAdd.value.overview = existingCompany.overview ?? ''
      companyAdd.value.videoUrl = existingCompany.videoUrl ?? ''
      companyAdd.value.bannerImage = existingCompany.bannerImage ?? null
      // Load banner image preview if exists
      if (existingCompany.bannerImage) {
        bannerPreview.value = existingCompany.bannerImage
        bannerFile.value = null
      } else {
        bannerPreview.value = null
        bannerFile.value = null
      }
      companyAdd.value.companyImages = existingCompany.companyImages ?? []
    } else {
      // Company doesn't exist - lookup from VietQR
      isExistCompany.value = false

      try {
        const response = await $api.company.getCompanyByMst(mstCompany.value)

        if (response && response.code == '00') {
          isDisplayInputCompany.value = true
          companyByMST.value = response
          isAddCompany.value = true
          if (!companyAdd.value) {
            companyAdd.value = {
              videoUrl: '',
              bannerImage: null,
            } as CompanyAddUpdateEntity
          }

          // Fill data from VietQR
          companyAdd.value.name = companyByMST.value.data.name ?? ''
          companyAdd.value.address = ''
          companyAdd.value.taxAddress = companyByMST.value.data.address ?? '' // Địa chỉ thuế từ VietQR
          companyAdd.value.mst = companyByMST.value.data.id ?? ''

          // Init default data for new company
          companyAdd.value.logo = ''
          companyAdd.value.organizationType = DEFAULT_COMPANY_ORGANIZATION_TYPE
          companyAdd.value.isWaiting = true
          companyAdd.value.facebookLink = ''
          companyAdd.value.twitterLink = ''
          companyAdd.value.linkedInLink = ''
          companyAdd.value.website = ''
          companyAdd.value.companySize = null
          companyAdd.value.foundedYear = null
          companyAdd.value.description = ''
          companyAdd.value.insight = ''
          companyAdd.value.overview = ''
          companyAdd.value.companyImages = []
        } else {
          isDisplayInputCompany.value = false

          useNotify({
            message:
              'Không tìm thấy thông tin trường học với mã số thuế đã nhập.',
          })
        }
      } catch (vietQRError: any) {
        isDisplayInputCompany.value = false
        console.error('VietQR lookup failed:', vietQRError)
        useNotify({
          message:
            'Không tìm thấy thông tin trường học với mã số thuế đã nhập.',
        })
      }
    }
  } catch (error: any) {
    isDisplayInputCompany.value = false

    console.error('Get Company By Mst failed:', error)
    useNotify({
      message: Array.isArray(error.message) ? error.message[0] : error.message,
    })
  } finally {
    loading.value = false
    isGettingCompanyByMst.value = false
  }
}

const confirmCreateSchool = () => {
  if (!isDisplayInputCompany.value) {
    useNotify({
      message: 'Vui lòng tra cứu mã số thuế để tiếp tục.',
    })

    return
  }

  console.log(isExistCompany.value)
  console.log(companyAdd.value.id)

  if (isExistCompany.value) {
    // Company exists in DB - just proceed
    if (companyAdd.value && companyAdd.value.id) {
      if (stepper.value?.hasNext) {
        stepper.value.next()
        wizardStep.value = 1
      }
    } else {
      useNotify({
        message: 'Vui lòng tra cứu mã số thuế để tiếp tục.',
      })
    }
  } else {
    // New company - validate and proceed
    isAddCompany.value = true
    const isValidCompany = validateCompanyFields()

    if (!isValidCompany) {
      return
    }

    if (stepper.value?.hasNext) {
      stepper.value.next()
      wizardStep.value = 1
    }
  }
}

const goBackToCompanyStep = () => {
  if (stepper.value?.hasPrev) {
    stepper.value.prev()
    wizardStep.value = 0
  }
}

const addJob = async () => {
  // Validate job fields
  const isValidJob = validateJobFields()

  if (!isValidJob) {
    return
  }

  // If not check display msg
  if (!agreeChecked.value) {
    useNotify({ message: 'Hãy xác nhận điều khoản và chính sách' })

    return
  }

  loading.value = true
  let isAddCompanySuccess = false
  let isAddJobSuccess = false

  // Check add Company
  if (isAddCompany.value && companyAdd.value) {
    // Public flow: không đụng tới ảnh; chỉ validate các trường text/số cần thiết
    const isValidCompany = validateCompanyFields()

    if (!isValidCompany) {
      loading.value = false

      return
    }

    // Public flow: không upload ảnh, không tạo company tại FE
    isAddCompanySuccess = true
  } else {
    isAddCompanySuccess = true
  }

  // Add job via public free-post
  if (isAddCompanySuccess) {
    try {
      const payload = {
        email: job.value.email || '',
        mst: mstCompany.value || '',
        company: {
          name: companyAdd.value?.name || '',
          mst: companyAdd.value?.mst || mstCompany.value || '',
          address: companyAdd.value?.address || '',
          taxAddress: companyAdd.value?.taxAddress || '',
          organizationType:
            companyAdd.value?.organizationType ?? DEFAULT_COMPANY_ORGANIZATION_TYPE,
          website: companyAdd.value?.website || '',
        },
        job: {
          title: job.value.title,
          detailDescription: job.value.detailDescription ?? '',
          category: Array.isArray(job.value.category)
            ? job.value.category.filter(Boolean).map(String).join(',')
            : String(job.value.category ?? ''),
          location: Array.isArray(job.value.location)
            ? job.value.location.filter(Boolean).map(String).join(',')
            : String(job.value.location ?? ''),
          typeOfEmployment: Number(job.value.typeOfEmployment ?? 0),
          experienceLevel: job.value.experienceLevel ?? null,
          requiredQualification: Array.isArray(job.value.requiredQualification)
            ? job.value.requiredQualification.filter(Boolean).map(String).join(',')
            : String(job.value.requiredQualification ?? ''),
          gender: Array.isArray(job.value.gender)
            ? job.value.gender.filter(Boolean).map(String).join(',')
            : (job.value.gender as any) ?? null,
          grade: job.value.grade ?? null,
          postedDate: job.value.postedDate
            ? new Date(job.value.postedDate).toISOString()
            : new Date().toISOString(),
          deadline: new Date(job.value.deadline as any).toISOString(),
          salaryMin:
            job.value.salaryType === 5
              ? 0
              : Number(unformatCurrency(job.value.salaryMin as any) ?? 0),
          salaryMax:
            job.value.salaryType === 5
              ? 0
              : Number(unformatCurrency(job.value.salaryMax as any) ?? 0),
          salaryType: Number(job.value.salaryType ?? 0),
          phoneNumber: job.value.phoneNumber ?? '',
          email: job.value.email || '',
          address: job.value.address || '',
          benefits: Array.isArray(job.value.benefits)
            ? job.value.benefits.filter(Boolean).map(String).join(',')
            : String(job.value.benefits ?? ''),
        },
      }

      const response = await $api.job.freePostPublic(payload as any)

      console.log('=== FREE POST RESPONSE ===')
      console.log('Response:', response)
      console.log('Access token:', response?.accessToken)
      console.log('User:', response?.user)
      console.log('=========================')

      if (response?.success) {
        isAddJobSuccess = true

        const accessToken = response.access_token || response.accessToken

        // User mới tạo trong flow free-post: tự đăng nhập và vào dashboard
        if (accessToken && response.user) {
          const token = useToken(CONSTANTS.COOKIE_TOKEN_OPTION as any)
          token.set(accessToken)
          authStore.setUser(response.user)

          useNotify({
            message: response.message || 'Đăng tin thành công!',
            type: 'success',
          })

          loading.value = false
          await router.push(
            response.redirectUrl || '/companies/dashboard?view=manageJobs',
          )
          return
        }

        useNotify({ message: response.message, type: 'success' })
      } else {
        throw new Error(response?.message || 'Đăng tải công việc thất bại. Vui lòng thử lại.')
      }
    } catch (error: any) {
      console.error('Add job failed:', error)
      useNotify({
        message:
          Array.isArray(error?.message) ? error.message[0] : (error?.message || 'Đăng tải công việc thất bại. Vui lòng thử lại.'),
      })
    }
  }

  loading.value = false
  if (isAddCompany.value && !isAddCompanySuccess) {
    confirmStepState.value = 'error'
    useNotify({
      message: 'Đăng ký trường học thất bại. Vui lòng thử lại.',
    })

    return
  } else if (!isAddJobSuccess) {
    confirmStepState.value = 'error'
    useNotify({
      message: 'Đăng tải công việc thất bại. Vui lòng thử lại.',
    })

    return
  }

  confirmStepState.value = 'success'

  // Free-post: đã mở dashboard ở tab mới; quay về trang chủ
  router.push(ROUTE_PAGE.HOME)
}

/** Helper function to scroll to first error field */
function scrollToFirstError(errors: Record<string, string>, fieldIdMap: Record<string, string>) {
  const firstErrorField = Object.keys(errors)[0]
  
  if (firstErrorField && fieldIdMap[firstErrorField]) {
    const elementId = fieldIdMap[firstErrorField]
    const element = document.getElementById(elementId) || 
                    document.querySelector(`[id="${elementId}"]`) ||
                    document.querySelector(`input[id*="${elementId}"], select[id*="${elementId}"], textarea[id*="${elementId}"]`)
    
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Focus the element if it's an input
        if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
          element.focus()
        }
      }, 100)
    }
  }
}

function validateCompanyFields(): boolean {
  companyErrors.value = {}

  let isValid = true

  // Free post: chỉ validate các trường bắt buộc hiển thị trên UI
  if (!companyAdd.value.name?.trim()) {
    companyErrors.value.name = t('company.form.errName')
    isValid = false
  }

  if (!isValid) {
    const companyFieldIdMap: Record<string, string> = {
      name: 'company-name',
    }

    // Hiển thị toast notification
    useNotify({
      type: 'error',
      message: 'Vui lòng nhập đúng các thông tin.',
    })

    scrollToFirstError(companyErrors.value, companyFieldIdMap)
  }

  return isValid
}

function validateJobFields(): boolean {
  jobErrors.value = {}

  let isValid = true

  if (!job.value.title || job.value.title.trim().length === 0) {
    jobErrors.value.title = 'Tên công việc không được để trống.'
    isValid = false
  }

  const detailHtml = job.value.detailDescription || ''
  const cleanDetail = detailHtml.replace(/<[^>]*>/g, '').trim()

  if (cleanDetail.length === 0) {
    jobErrors.value.detailDescription = 'Mô tả công việc không được để trống.'
    isValid = false
  }

  if (!job.value.deadline) {
    jobErrors.value.deadline = 'Vui lòng chọn hạn nộp hồ sơ.'
    isValid = false
  } else if (isDeadlineTooEarly(job.value.deadline)) {
    jobErrors.value.deadline = 'Hạn nộp không được sớm hơn ngày đăng.'
    isValid = false
  }

  if (!job.value.category || (Array.isArray(job.value.category) && job.value.category.length === 0)) {
    jobErrors.value.category = 'Vui lòng chọn ngành nghề.'
    isValid = false
  }

  if (!job.value.typeOfEmployment) {
    jobErrors.value.typeOfEmployment = 'Vui lòng chọn loại hình công việc.'
    isValid = false
  }

  if (!job.value.location) {
    jobErrors.value.location = 'Vui lòng chọn địa điểm làm việc.'
    isValid = false
  }

  if (!job.value.salaryType) {
    jobErrors.value.salaryType = 'Vui lòng chọn mức lương hiện tại.'
    isValid = false
  }

  // Validate salary min/max only if salary type is not "Thỏa thuận" (5)
  if (job.value.salaryType != 5) {
    if (!job.value.salaryMin || unformatCurrency(job.value.salaryMin).trim() === '') {
      jobErrors.value.salaryMin = 'Vui lòng nhập mức lương tối thiểu.'
      isValid = false
    }
    if (!job.value.salaryMax || unformatCurrency(job.value.salaryMax).trim() === '') {
      jobErrors.value.salaryMax = 'Vui lòng nhập mức lương tối đa.'
      isValid = false
    }
  }

  // Check if address is empty or only contains empty HTML tags
  const addressHtml = job.value.address || ''
  const cleanAddress = addressHtml.replace(/<[^>]*>/g, '').trim()

  if (cleanAddress.length === 0) {
    jobErrors.value.address = 'Địa chỉ công việc không được để trống.'
    isValid = false
  }

  if (isExistCompany.value && !job.value.companyId) {
    jobErrors.value.companyId = 'Vui lòng chọn trường học.'
    isValid = false
  }

  // Email validation - required
  if (!job.value.email || job.value.email.trim().length === 0) {
    jobErrors.value.email = 'Email không được để trống.'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(job.value.email.trim())) {
    jobErrors.value.email = 'Email không đúng định dạng.'
    isValid = false
  }

  // Phone number validation - required
  if (!job.value.phoneNumber || job.value.phoneNumber.trim().length === 0) {
    jobErrors.value.phoneNumber = 'Số điện thoại không được để trống.'
    isValid = false
  }

  // Required qualification validation - required
  if (
    !job.value.requiredQualification ||
    !Array.isArray(job.value.requiredQualification) ||
    job.value.requiredQualification.length === 0
  ) {
    jobErrors.value.requiredQualification = 'Vui lòng chọn bằng cấp.'
    isValid = false
  }

  // Experience level validation - required
  if (!job.value.experienceLevel || job.value.experienceLevel === 0) {
    jobErrors.value.experienceLevel = 'Vui lòng chọn mức độ kinh nghiệm.'
    isValid = false
  }

  // Benefits validation - required
  if (!job.value.benefits || (Array.isArray(job.value.benefits) && job.value.benefits.length === 0)) {
    jobErrors.value.benefits = 'Vui lòng chọn ít nhất một phúc lợi.'
    isValid = false
  }

  // Gender validation - required
  if (!job.value.gender || (Array.isArray(job.value.gender) && job.value.gender.length === 0)) {
    jobErrors.value.gender = 'Vui lòng chọn giới tính yêu cầu.'
    isValid = false
  }

  // Grade validation - required
  if (!job.value.grade || job.value.grade === 0) {
    jobErrors.value.grade = 'Vui lòng chọn cấp bậc.'
    isValid = false
  }

  // Kiểm tra độ dài
  if (job.value.title && job.value.title.length > 255) {
    jobErrors.value.title = 'Tên công việc không được vượt quá 255 ký tự.'
    isValid = false
  }

  // Kiểm tra lương (nếu có và không phải "Thỏa thuận")
  if (
    job.value.salaryType != 5 &&
    job.value.salaryMin &&
    job.value.salaryMax &&
    Number(unformatCurrency(job.value.salaryMin)) > Number(unformatCurrency(job.value.salaryMax))
  ) {
    jobErrors.value.salaryMin = 'Lương tối thiểu không được lớn hơn lương tối đa.'
    isValid = false
  }

  if (!isValid) {
    const jobFieldIdMap: Record<string, string> = {
      title: 'job-title',
      detailDescription: 'job-detail-description',
      deadline: 'job-deadline',
      category: 'job-category',
      typeOfEmployment: 'job-type-employment',
      location: 'job-location',
      salaryType: 'job-salary-type',
      salaryMin: 'job-salary-min',
      salaryMax: 'job-salary-max',
      address: 'job-address',
      email: 'job-email',
      phoneNumber: 'job-phone',
      requiredQualification: 'job-required-qualification',
      experienceLevel: 'job-experience-level',
      benefits: 'job-benefit',
      gender: 'job-gender',
      grade: 'job-grade',
      companyId: 'company-name',
    }

    // Hiển thị toast notification
    useNotify({
      type: 'error',
      message: 'Vui lòng nhập đúng các thông tin.',
    })

    scrollToFirstError(jobErrors.value, jobFieldIdMap)
  }

  return isValid
}
</script>

<style scoped>
:global(body.vselect-scroll-lock) {
  overflow: hidden !important;
  overscroll-behavior: none;
}

.page-job-upload :deep(.job-vselect .v-select .vs__dropdown-menu) {
  max-height: 200px;
  overflow-y: auto;
  z-index: 9999;
  border: 1px solid rgba(200, 214, 236, 0.9);
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(31, 49, 93, 0.1);
  padding: 4px 0;
  margin-top: 6px;
}

:deep(.vs__dropdown-option) {
  margin: 2px 6px;
  padding: 6px 8px;
  border-radius: 0.75rem;
  font-size: 0.75rem; /* text-xs */
  color: #1f2937;
  cursor: pointer;
}

:deep(.vs__dropdown-option:hover) {
  background-color: #f7f9fc;
}

:deep(.vs__dropdown-option--selected) {
  background-color: #e0f2fe;
  color: #1f2937;
}

:deep(.vs__dropdown-option--highlight) {
  background-color: #f7f9fc;
}

:deep(.vs__search::placeholder),
:deep(.vs__placeholder) {
  font-size: 0.875rem;
  color: var(--ui-text-dimmed);
}

/* Step 2 v-select: vue-select không merge class lên root — bọc .job-vselect ở ngoài */
.page-job-upload :deep(.job-vselect .v-select .vs__dropdown-toggle) {
  min-height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.55);
  padding: 4px 10px;
  background: #ffffff;
}

.page-job-upload :deep(.job-vselect .v-select.vs--open .vs__dropdown-toggle),
.page-job-upload :deep(.job-vselect .v-select .vs__dropdown-toggle:focus),
.page-job-upload :deep(.job-vselect .v-select .vs__dropdown-toggle:focus-within) {
  border-color: rgba(148, 163, 184, 0.55);
  box-shadow: none !important;
  outline: none !important;
}

.page-job-upload :deep(.job-vselect--error .v-select .vs__dropdown-toggle) {
  border-color: rgb(248 113 113);
  box-shadow: 0 0 0 1px rgba(248, 113, 113, 0.35);
}

.page-job-upload :deep(.job-vselect .v-select .vs__selected) {
  border-radius: 9999px;
  background: rgba(239, 246, 255, 0.9);
  border: 1px solid rgba(147, 197, 253, 0.85);
  color: #0f172a;
  font-size: 0.8125rem;
  line-height: 1rem;
  padding: 4px 10px;
  margin: 3px 6px 3px 0;
}

.page-job-upload :deep(.job-vselect .v-select .vs__search) {
  margin: 3px 0;
  font-size: 0.875rem;
  color: #0f172a;
}

.page-job-upload :deep(.job-vselect .v-select .vs__search:focus) {
  outline: none !important;
  box-shadow: none !important;
}

.page-job-upload :deep(.job-vselect .v-select .vs__actions) {
  padding-left: 6px;
}
</style>
