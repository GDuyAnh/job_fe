<template>
  <div ref="jobFormRootRef" class="page-dashboard-newjob page-job-upload">
    <!-- Trang standalone: title + description (drawer có header riêng) -->
    <div v-if="!embeddedInDrawer" class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ $t('dashboard.sidebar.newJob') }}
      </h1>
      <p class="text-gray-600 mt-2">
        {{ $t('dashboard.newJob.description') }}
      </p>
    </div>
    <!-- Form Content — đồng bộ upload step 2 (employer-step-detail-wrap) -->
    <section class="employer-step-panel employer-step-detail-wrap">
      <UCollapsible
        v-model:open="sectionBasicOpen"
        :unmount-on-hide="false"
        class="employer-accordion w-full"
        :class="{ 'is-open': sectionBasicOpen }"
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
            <div data-job-field="title" class="space-y-1.5">
              <label for="job-title" class="employer-input-label">
                {{ $t('job.uploadJob.nameJobLabel') }}
                <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
              </label>
              <UInput
                id="job-title"
                v-model="job.title"
                :placeholder="$t('job.uploadJob.nameJobPlaceHolder')"
                :disabled="isFormDisabled"
                :ui="{
                  root: 'w-full',
                  base: jobControlUiBase + fieldErrorRingClass(jobErrors.title),
                }"
                class="w-full text-sm"
                @input="jobErrors.title = ''"
              />
              <p v-if="jobErrors.title" class="mt-1 text-sm !text-red-500">{{ jobErrors.title }}</p>
            </div>

            <div data-job-field="detailDescription" class="mt-4 space-y-1.5 rich-text-output">
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
                :disabled="isFormDisabled"
                :readonly="isFormDisabled"
                @update:model-value="jobErrors.detailDescription = ''"
              />
              <p v-if="jobErrors.detailDescription" class="mt-1 text-sm !text-red-500">{{ jobErrors.detailDescription }}</p>
            </div>

            <div
              class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
              data-job-field-row="category-type"
            >
              <div data-job-field="category" class="space-y-1.5">
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
                    :disabled="isFormDisabled"
                    :clear-search-on-blur="() => true"
                    @open="onMultiSelectOpen"
                    @close="onMultiSelectClose"
                    @update:model-value="jobErrors.category = ''"
                  />
                </div>
                <p v-if="jobErrors.category" class="mt-1 text-sm !text-red-500">
                  {{ jobErrors.category }}
                </p>
              </div>

              <div data-job-field="typeOfEmployment" class="space-y-1.5">
                <label class="employer-input-label">
                  {{ $t('job.uploadJob.typeJobLabel') }}
                  <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                </label>
                <USelect
                  :items="employmentTypeItems"
                  :model-value="job.typeOfEmployment?.toString()"
                  :placeholder="$t('job.uploadJob.chooseTypeOfEmployment')"
                  :ui="{
                    base: jobControlUiBase + fieldErrorRingClass(jobErrors.typeOfEmployment),
                    content: 'z-[9999]',
                  }"
                  class="w-full text-sm"
                  :content="{ side: 'bottom' }"
                  :disabled="isFormDisabled"
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
              <div data-job-field="grade" class="space-y-1.5">
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
                    base: jobControlUiBase + fieldErrorRingClass(jobErrors.grade),
                    content: 'z-[9999]',
                  }"
                  class="w-full text-sm"
                  :disabled="isFormDisabled"
                  @update:model-value="
                    (val) => {
                      job.grade = Number(val ?? 0)
                      jobErrors.grade = ''
                    }
                  "
                />
                <p v-if="jobErrors.grade" class="mt-1 text-sm !text-red-500">{{ jobErrors.grade }}</p>
              </div>
              <div id="job-deadline-field" data-job-field="deadline" class="space-y-1.5">
                <label class="employer-input-label">
                  {{ $t('job.uploadJob.deadlineLabel') }}
                  <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                </label>
                <UPopover
                  :disabled="isFormDisabled"
                  :content="{
                    side: 'bottom',
                    align: 'start',
                    sideOffset: 8,
                    avoidCollisions: false,
                  }"
                  :ui="{ content: 'z-[9999]' }"
                >
                  <UButton
                    :ui="{
                      base:
                        jobDeadlineButtonUiBase + fieldErrorRingClass(jobErrors.deadline),
                    }"
                    color="neutral"
                    variant="outline"
                    class="w-full"
                    :disabled="isFormDisabled"
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
                      :disabled="isFormDisabled"
                      @update:model-value="jobErrors.deadline = ''"
                    />
                  </template>
                </UPopover>
                <p v-if="jobErrors.deadline" class="mt-1 text-sm !text-red-500">{{ jobErrors.deadline }}</p>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div data-job-field="salaryType" class="space-y-1.5">
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
                    base: jobControlUiBase + fieldErrorRingClass(jobErrors.salaryType),
                    content: 'z-[9999]',
                  }"
                  class="w-full text-sm"
                  :disabled="isFormDisabled"
                  @update:model-value="
                    (val) => {
                      job.salaryType = Number(val ?? 0)
                      jobErrors.salaryType = ''
                    }
                  "
                />
                <p v-if="jobErrors.salaryType" class="mt-1 text-sm !text-red-500">{{ jobErrors.salaryType }}</p>
              </div>
              <div v-if="job.salaryType != 5" data-job-field="salaryMin" class="space-y-1.5">
                <label class="employer-input-label">
                  {{ $t('job.uploadJob.minSalaryLabel') }}
                  <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                </label>
                <UInput
                  id="job-salary-min"
                  :model-value="formatCurrency(job.salaryMin)"
                  type="text"
                  :placeholder="salaryMinPlaceholder"
                  :ui="{
                    root: 'w-full',
                    base: jobControlUiBase + fieldErrorRingClass(jobErrors.salaryMin),
                  }"
                  class="w-full text-sm"
                  :disabled="isFormDisabled"
                  @update:model-value="(val) => {
                    job.salaryMin = unformatCurrency(val)
                    jobErrors.salaryMin = ''
                  }"
                />
                <p v-if="jobErrors.salaryMin" class="mt-1 text-sm !text-red-500">{{ jobErrors.salaryMin }}</p>
              </div>
              <div v-if="job.salaryType != 5" data-job-field="salaryMax" class="space-y-1.5">
                <label class="employer-input-label">
                  {{ $t('job.uploadJob.maxSalaryLabel') }}
                  <span class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                </label>
                <UInput
                  id="job-salary-max"
                  :model-value="formatCurrency(job.salaryMax)"
                  type="text"
                  :placeholder="salaryMaxPlaceholder"
                  :ui="{
                    root: 'w-full',
                    base: jobControlUiBase + fieldErrorRingClass(jobErrors.salaryMax),
                  }"
                  class="w-full text-sm"
                  :disabled="isFormDisabled"
                  @update:model-value="(val) => {
                    job.salaryMax = unformatCurrency(val)
                    jobErrors.salaryMax = ''
                  }"
                />
                <p v-if="jobErrors.salaryMax" class="mt-1 text-sm !text-red-500">{{ jobErrors.salaryMax }}</p>
              </div>
            </div>

            <div class="job-address-location-fields">
              <div data-job-field="address" class="space-y-1.5 rich-text-output">
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
                  :disabled="isFormDisabled"
                  :readonly="isFormDisabled"
                  @update:model-value="jobErrors.address = ''"
                />
                <p v-if="jobErrors.address" class="mt-1 text-sm !text-red-500">{{ jobErrors.address }}</p>
              </div>
              <div data-job-field="location" class="space-y-1.5">
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
                    :disabled="isFormDisabled"
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
        v-model:open="sectionCandidateOpen"
        :unmount-on-hide="false"
        class="employer-accordion w-full"
        :class="{ 'is-open': sectionCandidateOpen }"
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
              <div data-job-field="requiredQualification" class="space-y-1.5">
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
                    :disabled="isFormDisabled"
                    :clear-search-on-blur="() => true"
                    @open="onMultiSelectOpen"
                    @close="onMultiSelectClose"
                    @update:model-value="jobErrors.requiredQualification = ''"
                  />
                </div>
                <p v-if="jobErrors.requiredQualification" class="mt-1 text-sm !text-red-500">{{ jobErrors.requiredQualification }}</p>
              </div>
              <div data-job-field="experienceLevel" class="space-y-1.5">
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
                    base: jobControlUiBase + fieldErrorRingClass(jobErrors.experienceLevel),
                    content: 'z-[9999]',
                  }"
                  class="w-full text-sm"
                  :disabled="isFormDisabled"
                  @update:model-value="
                    (val) => {
                      job.experienceLevel = Number(val ?? 0)
                      jobErrors.experienceLevel = ''
                    }
                  "
                />
                <p v-if="jobErrors.experienceLevel" class="mt-1 text-sm !text-red-500">{{ jobErrors.experienceLevel }}</p>
              </div>
              <div data-job-field="gender" class="space-y-1.5">
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
                    :disabled="isFormDisabled"
                    :clear-search-on-blur="() => true"
                    @open="onMultiSelectOpen"
                    @close="onMultiSelectClose"
                    @update:model-value="jobErrors.gender = ''"
                  />
                </div>
                <p v-if="jobErrors.gender" class="mt-1 text-sm !text-red-500">{{ jobErrors.gender }}</p>
              </div>
              <div data-job-field="benefits" class="space-y-1.5">
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
                    :disabled="isFormDisabled"
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
        v-model:open="sectionContactOpen"
        :unmount-on-hide="false"
        class="employer-accordion w-full"
        :class="{ 'is-open': sectionContactOpen }"
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
              <div data-job-field="email" class="space-y-1.5">
                <label for="job-email" class="employer-input-label">
                  {{ $t('job.uploadJob.emailJobLabel') }}
                  <span v-if="!isAdminJobContext" class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                </label>
                <UInput
                  id="job-email"
                  v-model.trim="job.email"
                  type="email"
                  :placeholder="$t('job.uploadJob.emailJobPlaceholder')"
                  :disabled="isFormDisabled"
                  :ui="{
                    root: 'w-full',
                    base: jobControlUiBase + fieldErrorRingClass(jobErrors.email),
                  }"
                  class="w-full text-sm"
                  @input="jobErrors.email = ''"
                />
                <p v-if="jobErrors.email" class="mt-1 text-sm !text-red-500">{{ jobErrors.email }}</p>
              </div>
              <div data-job-field="phoneNumber" class="space-y-1.5">
                <label for="job-phone" class="employer-input-label">
                  {{ $t('job.uploadJob.phoneJobLabel') }}
                  <span v-if="!isAdminJobContext" class="text-red-500">{{ $t('job.uploadJob.mandatoryChar') }}</span>
                </label>
                <UInput
                  id="job-phone"
                  v-model.trim="job.phoneNumber"
                  type="tel"
                  :placeholder="$t('job.uploadJob.phoneJobPlaceholder')"
                  :disabled="isFormDisabled"
                  :ui="{
                    root: 'w-full',
                    base: jobControlUiBase + fieldErrorRingClass(jobErrors.phoneNumber),
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

      <!-- Drawer: không dùng UCollapsible (animation đo chiều cao gây màn trắng khi đổi loại tin) -->
      <div
        v-if="isAdminJobContext && embeddedInDrawer"
        class="employer-accordion w-full is-open"
      >
        <div class="employer-accordion-head" aria-expanded="true">
          <span class="employer-accordion-num">4</span>
          <span class="employer-accordion-label">Action by admin</span>
          <svg class="employer-accordion-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="employer-accordion-body employer-admin-action-body">
          <AdminJobActionFields
            v-model:job-status-option="jobStatusOption"
            v-model:post-type-option="postTypeOption"
            :is-edit-mode="isEditMode"
            :is-form-disabled="isFormDisabled"
            :job-status-options="jobStatusOptions"
            :post-type-options="postTypeOptions"
          />
        </div>
      </div>

      <UCollapsible
        v-else-if="isAdminJobContext"
        v-model:open="sectionAdminActionOpen"
        :unmount-on-hide="false"
        class="employer-accordion w-full"
        :class="{ 'is-open': sectionAdminActionOpen }"
        :ui="{
          content:
            'data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-visible',
        }"
      >
        <template #default="{ open }">
          <button type="button" class="employer-accordion-head" :aria-expanded="open" data-accordion-toggle>
            <span class="employer-accordion-num">4</span>
            <span class="employer-accordion-label">Action by admin</span>
            <svg class="employer-accordion-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </template>
        <template #content>
          <div class="employer-accordion-body employer-admin-action-body">
            <AdminJobActionFields
              v-model:job-status-option="jobStatusOption"
              v-model:post-type-option="postTypeOption"
              :is-edit-mode="isEditMode"
              :is-form-disabled="isFormDisabled"
              :job-status-options="jobStatusOptions"
              :post-type-options="postTypeOptions"
            />
          </div>
        </template>
      </UCollapsible>

      <label v-if="!isAdminJobContext" class="auth-check auth-check-terms employer-terms">
        <input v-model="agreeChecked" type="checkbox" :disabled="isFormDisabled" />
        <span>
          {{ $t('job.uploadJob.agreeUploadJobLabel') }}
          <NuxtLink to="/policy#terms">{{ $t('job.uploadJob.agreePolicy') }}</NuxtLink>
          {{ $t('job.uploadJob.and') }}
          <NuxtLink to="/policy#privacy">{{ $t('job.uploadJob.agreePrivacy') }}</NuxtLink>
        </span>
      </label>

      <div class="employer-actions employer-actions-end">
        <button
          v-if="isAdminJobContext"
          type="button"
          class="employer-primary-btn employer-submit-btn"
          :disabled="loading || isFormDisabled"
          data-job-submit
          @click="addJob()"
        >
          {{ loading ? '...' : (isEditMode ? $t('job.uploadJob.updateJobContent') : $t('job.uploadJob.uploadJobContent')) }}
        </button>
        <button
          v-else
          type="button"
          class="employer-primary-btn employer-submit-btn"
          :disabled="!agreeChecked || loading || isFormDisabled"
          data-job-submit
          @click="addJob()"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="margin-right: 6px" aria-hidden="true">
            <path d="M22 2 11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="m22 2-7 20-4-9-9-4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
          </svg>
          <span data-job-submit-label>{{ loading ? '...' : (isEditMode ? $t('job.uploadJob.updateJobContent') : $t('job.uploadJob.uploadJobContent')) }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { JobModelAddUpdate } from '~/models/job'
import type { CompanyEntity } from '~/entities/company'
import { CalendarDate, type DateValue } from '@internationalized/date'
import RichTextEditor from '~/components/RichTextEditor.vue'
import AdminJobActionFields from '~/components/dashboard/AdminJobActionFields.vue'
import { onUnmounted } from 'vue'
import { useVueSelectFixedPosition } from '~/composables/useVueSelectFixedPosition'

// Props
const props = defineProps<{
  companyData: CompanyEntity | null
  jobToEdit?: import('~/models/job').JobModel | null
  /** Form admin (Quản lý công việc / company-management): hiện Action by admin, optional email/phone */
  adminMode?: boolean
  /** Khi true (drawer admin add): bắt buộc chọn công ty trước khi gửi */
  requireCompanySelection?: boolean
  /** Form trong drawer — không khóa scroll body (tránh màn trắng + dropdown bị chặn) */
  embeddedInDrawer?: boolean
}>()

// Emits
const emit = defineEmits<{
  jobCreated: []
}>()

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const router = useRouter()

const loading = ref(false)
const agreeChecked = ref(false)
const jobErrors = ref<Record<string, string>>({})
const jobFormRootRef = ref<HTMLElement | null>(null)
const sectionBasicOpen = ref(true)
const sectionCandidateOpen = ref(true)
const sectionContactOpen = ref(true)
const sectionAdminActionOpen = ref(true)

// Scroll lock for vue-select (multi select) to match USelect behavior
const vSelectOpenCount = ref(0)
let lockedDrawerScrollEl: HTMLElement | null = null

const preventScrollOutsideVSelect = (e: Event) => {
  const target = e.target as HTMLElement | null
  if (target?.closest?.('.vs__dropdown-menu')) return
  e.preventDefault()
}

const bindScrollLockListeners = (locked: boolean) => {
  const targets: HTMLElement[] = []
  if (lockedDrawerScrollEl) targets.push(lockedDrawerScrollEl)
  if (!props.embeddedInDrawer) targets.push(document.body)

  for (const el of targets) {
    if (locked) {
      el.addEventListener('wheel', preventScrollOutsideVSelect, { passive: false })
      el.addEventListener('touchmove', preventScrollOutsideVSelect, { passive: false })
    } else {
      el.removeEventListener('wheel', preventScrollOutsideVSelect as EventListener)
      el.removeEventListener('touchmove', preventScrollOutsideVSelect as EventListener)
    }
  }

  if (locked) {
    if (!props.embeddedInDrawer) {
      window.addEventListener('wheel', preventScrollOutsideVSelect, { passive: false })
      window.addEventListener('touchmove', preventScrollOutsideVSelect, { passive: false })
    }
  } else {
    window.removeEventListener('wheel', preventScrollOutsideVSelect as EventListener)
    window.removeEventListener('touchmove', preventScrollOutsideVSelect as EventListener)
  }
}

function isScrollableElement(node: HTMLElement) {
  const { overflowY } = window.getComputedStyle(node)
  return (
    (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay')
    && node.scrollHeight > node.clientHeight + 1
  )
}

function findScrollableParent(element: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = element.parentElement
  while (node) {
    if (isScrollableElement(node)) return node
    node = node.parentElement
  }
  return null
}

function getDrawerScrollContainer(fromElement?: HTMLElement | null): HTMLElement | null {
  if (!props.embeddedInDrawer || typeof document === 'undefined') return null

  if (fromElement) {
    const scrollable = findScrollableParent(fromElement)
    if (scrollable) return scrollable
  }

  const formRoot = jobFormRootRef.value
  if (!formRoot) return null

  const candidates = [
    formRoot.closest<HTMLElement>('.employer-company-job-drawer-body'),
    formRoot.closest<HTMLElement>('.ui-drawer-body-vh'),
    formRoot.closest<HTMLElement>('.employer-admin-job-drawer-body'),
    formRoot.closest<HTMLElement>('.employer-job-drawer-body-inner'),
  ].filter(Boolean) as HTMLElement[]

  return candidates.find((node) => isScrollableElement(node)) ?? candidates[0] ?? null
}

const setVSelectScrollLock = (locked: boolean) => {
  if (typeof document === 'undefined') return

  const drawerScroll = getDrawerScrollContainer()

  if (locked) {
    lockedDrawerScrollEl = drawerScroll
    if (props.embeddedInDrawer && drawerScroll) {
      drawerScroll.classList.add('vselect-scroll-lock')
      document.body.classList.remove('vselect-scroll-lock')
    } else {
      document.body.classList.add('vselect-scroll-lock')
      drawerScroll?.classList.remove('vselect-scroll-lock')
      lockedDrawerScrollEl = null
    }
    bindScrollLockListeners(true)
    return
  }

  bindScrollLockListeners(false)
  lockedDrawerScrollEl?.classList.remove('vselect-scroll-lock')
  lockedDrawerScrollEl = null
  getDrawerScrollContainer()?.classList.remove('vselect-scroll-lock')
  document.body.classList.remove('vselect-scroll-lock')
}

const onMultiSelectOpen = () => {
  vSelectOpenCount.value += 1
  if (vSelectOpenCount.value === 1) setVSelectScrollLock(true)
}

const onMultiSelectClose = () => {
  vSelectOpenCount.value = Math.max(0, vSelectOpenCount.value - 1)
  if (vSelectOpenCount.value === 0) setVSelectScrollLock(false)
}

const salaryMinPlaceholder = 'VD: 8,000,000'
const salaryMaxPlaceholder = 'VD: 15,000,000'

/** UInput / USelect / UButton: viền đỏ khi lỗi (ring nằm ở `ui.base`, không ăn từ `class` bên ngoài). */
function fieldErrorRingClass(errorMsg: string | undefined | null) {
  return errorMsg ? ' !ring-1 !ring-inset !ring-red-500' : ''
}

/** Chiều cao 44px qua SCSS (.employer-field-control + --employer-control-min-height) */
const jobControlUiBase = 'employer-field-control w-full rounded-xl'
const jobDeadlineButtonUiBase =
  'employer-field-control w-full justify-start rounded-xl bg-white text-sm font-medium'

const { calculatePosition: vueSelectCalculatePosition } = useVueSelectFixedPosition({
  zIndex: props.embeddedInDrawer ? 10050 : 9999,
})

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

const job = ref<JobModelAddUpdate>({} as JobModelAddUpdate)
const isEditMode = computed(() => !!props.jobToEdit)
/** Add/edit từ admin: bỏ auto-fill, optional email/phone, note = admin */
const isAdminJobContext = computed(() => !!props.adminMode)
/** Disable all form fields when requireCompanySelection is true and no company is selected */
const isFormDisabled = computed(
  () => props.requireCompanySelection && !props.companyData?.id,
)

const postTypeOptions = [
  { value: 'Basic', label: 'Cơ bản' },
  { value: 'Hot', label: 'Mới nhất' },
  { value: 'Urgent', label: 'Tuyển gấp' },
] as const

type PostTypeOption = (typeof postTypeOptions)[number]['value']
const postTypeOption = computed<PostTypeOption>({
  get() {
    const raw = (job.value.postType || 'Basic').trim()
    if (raw === 'Hot' || raw === 'Urgent' || raw === 'Basic') return raw
    if (raw.toLowerCase() === 'free') return 'Basic'

    return 'Basic'
  },
  set(value) {
    job.value.postType = value
  },
})

type JobStatusOption = 'ADMIN_REVIEW' | 'PENDING' | 'APPROVED' | 'REJECTED'
const jobStatusOptions: { value: JobStatusOption; label: string }[] = [
  { value: 'ADMIN_REVIEW', label: 'ADMIN_REVIEW' },
  { value: 'PENDING', label: 'PENDING' },
  { value: 'APPROVED', label: 'APPROVED' },
  { value: 'REJECTED', label: 'REJECTED' },
]
const jobStatusOption = ref<JobStatusOption>('ADMIN_REVIEW')

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

// Convert JobModel to JobModelAddUpdate
const convertJobModelToAddUpdate = (jobModel: import('~/models/job').JobModel): JobModelAddUpdate => {
  // Format deadline from Date to string (YYYY-MM-DD)
  const formatDeadline = (date?: Date | string | null): string | undefined => {
    if (!date) return undefined
    const d = typeof date === 'string' ? new Date(date) : date
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  }

  return {
    title: jobModel.title,
    detailDescription: jobModel.detailDescription ?? '',
    category: jobModel.category ? jobModel.category.split(',').map(c => c.trim()).filter(c => c) : undefined,
    location: jobModel.location ? jobModel.location.split(',').map(l => l.trim()).filter(l => l) : undefined,
    typeOfEmployment: Number(jobModel.typeOfEmployment),
    experienceLevel: Number(jobModel.experienceLevel),
    requiredQualification: jobModel.requiredQualification
      ? jobModel.requiredQualification.split(',').map((q) => q.trim()).filter(Boolean)
      : undefined,
    gender: jobModel.gender ? jobModel.gender.split(',').map(g => g.trim()).filter(g => g) : undefined,
    grade: jobModel.grade ? Number(jobModel.grade) : undefined,
    companyId: jobModel.companyId,
    userId: jobModel.userId,
    imageLogo: jobModel.companyLogo || '',
    bannerLogo: jobModel.bannerLogo || '',
    postedDate: jobModel.createdAt ? new Date(jobModel.createdAt) : new Date(),
    deadline: formatDeadline(jobModel.deadline),
    salaryMin: jobModel.salaryMin || undefined,
    salaryMax: jobModel.salaryMax || undefined,
    salaryType: jobModel.salaryType,
    benefits: jobModel.benefits ? jobModel.benefits.split(',').map(b => b.trim()).filter(b => b) : undefined,
    email: jobModel.email || undefined,
    phoneNumber: jobModel.phoneNumber || undefined,
    address: jobModel.address || '',
    status: jobModel.status,
    postType: (jobModel.postType === 'Free' ? 'Basic' : jobModel.postType) ?? 'Basic',
    note: jobModel.note ?? 'user',
  }
}

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

// Helper function to auto-fill email from logged-in user (không chạy khi admin add/edit)
const autoFillEmail = () => {
  if (isAdminJobContext.value) return
  if (!isEditMode.value && authStore.user && authStore.user.email) {
    job.value.email = authStore.user.email
  }
}

// Load job data when jobToEdit prop changes
watch(() => props.jobToEdit, (newJob) => {
  if (newJob) {
    job.value = convertJobModelToAddUpdate(newJob)
    const s = (newJob.status || '').toUpperCase()

    jobStatusOption.value = (s === 'APPROVED' || s === 'REJECTED' || s === 'PENDING' || s === 'ADMIN_REVIEW') ? s as JobStatusOption : 'ADMIN_REVIEW'
  } else {
    job.value = {} as JobModelAddUpdate
    job.value.postedDate = new Date()
    job.value.postType = 'Basic'
    job.value.note = 'user'
    jobStatusOption.value = 'ADMIN_REVIEW'
    agreeChecked.value = false
    autoFillEmail()
  }
}, { immediate: true })

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

// Initialize
onMounted(() => {
  if (!authStore.user) {
    router.push('/auth/login')

    return
  }

  job.value.postedDate = new Date()
  
  // Tự động điền email của user đã đăng nhập vào trường email (chỉ khi add job, không phải edit)
  autoFillEmail()
})

onUnmounted(() => {
  // Safety: ensure scroll lock is released if component unmounts while a menu is open
  setVSelectScrollLock(false)
  vSelectOpenCount.value = 0
})

const addJob = async () => {
  // Validate job fields
  const isValid = validateJobFields()

  if (!isValid) {
    return
  }

  // Bắt buộc chọn công ty (drawer admin add)
  if (props.requireCompanySelection && !props.companyData?.id) {
    useNotify({ message: 'Vui lòng chọn công ty.' })

    return
  }

  // Checkbox điều khoản chỉ bắt buộc khi không phải admin
  if (!isAdminJobContext.value && !agreeChecked.value) {
    useNotify({ message: 'Hãy xác nhận điều khoản và chính sách' })

    return
  }

  const companyIdToUse = props.companyData?.id ?? authStore.user?.companyId

  if (!companyIdToUse) {
    useNotify({
      message: 'Bạn chưa có công ty. Vui lòng tạo công ty trước.',
    })

    return
  }

  loading.value = true

  try {
    // Set id Company for Job (từ companyData khi dùng trong slide admin, hoặc user.companyId)
    job.value.companyId = companyIdToUse

    // Set id User for Job
    job.value.userId = authStore.user?.id ?? 0

    // Convert benefits array to comma-separated string before sending
    // Ensure benefits is converted to string, not object
    let benefitsString = ''

    if (Array.isArray(job.value.benefits)) {
      benefitsString = job.value.benefits
        .filter(b => b != null && b !== '')
        .map(b => String(b).trim())
        .filter(b => b)
        .join(',')
    } else if (typeof job.value.benefits === 'string') {
      benefitsString = job.value.benefits
    }

    // Convert category array to comma-separated string before sending
    let categoryString = ''

    if (Array.isArray(job.value.category)) {
      categoryString = job.value.category
        .filter(c => c != null && c !== '')
        .map(c => String(c).trim())
        .filter(c => c)
        .join(',')
    } else if (typeof job.value.category === 'string') {
      categoryString = job.value.category
    }

    // Convert gender array to comma-separated string before sending
    let genderString = ''

    if (Array.isArray(job.value.gender)) {
      genderString = job.value.gender
        .filter(g => g != null && g !== '')
        .map(g => String(g).trim())
        .filter(g => g)
        .join(',')
    } else if (typeof job.value.gender === 'string') {
      genderString = job.value.gender
    }

    // Convert location array to comma-separated string before sending
    let locationString = ''

    if (Array.isArray(job.value.location)) {
      locationString = job.value.location
        .filter(l => l != null && l !== '')
        .map(l => String(l).trim())
        .filter(l => l)
        .join(',')
    } else if (typeof job.value.location === 'string') {
      locationString = job.value.location
    }

    // Convert requiredQualification array to comma-separated string before sending
    let requiredQualificationString = ''

    if (Array.isArray(job.value.requiredQualification)) {
      requiredQualificationString = job.value.requiredQualification
        .filter((q) => q != null && q !== '')
        .map((q) => String(q).trim())
        .filter((q) => q)
        .join(',')
    } else if (typeof job.value.requiredQualification === 'string') {
      requiredQualificationString = job.value.requiredQualification
    }

    const jobDataToSend: any = {
      ...job.value,
      detailDescription: job.value.detailDescription ?? '',
      benefits: benefitsString,
      category: categoryString,
      gender: genderString || undefined,
      location: locationString || undefined,
      requiredQualification: requiredQualificationString || undefined,
      salaryMin: job.value.salaryMin ? unformatCurrency(job.value.salaryMin) : undefined,
      salaryMax: job.value.salaryMax ? unformatCurrency(job.value.salaryMax) : undefined,
      postType: isAdminJobContext.value
        ? (job.value.postType || 'Basic')
        : (isEditMode.value ? (job.value.postType || 'Basic') : 'Basic'),
      // note chỉ set khi tạo mới (admin add vs user add); khi update giữ nguyên giá trị cũ
      note: isEditMode.value ? (job.value.note || props.jobToEdit?.note || 'user') : (isAdminJobContext.value ? 'admin' : 'user'),
    }

    let response

    if (isEditMode.value && props.jobToEdit) {
      jobDataToSend.status = jobStatusOption.value

      response = await $api.job.editJob(props.jobToEdit.id, jobDataToSend)

      if (response) {
        useNotify({
          message: 'Cập nhật công việc thành công!',
          type: 'success',
        })
      }
    } else {
      jobDataToSend.status = isAdminJobContext.value ? (job.value.status ?? 'ADMIN_REVIEW') : 'ADMIN_REVIEW'

      response = await $api.job.addJob(jobDataToSend)

      if (response) {
        useNotify({
          message: 'Đăng tải công việc thành công!',
          type: 'success',
        })
      }
    }

    if (response) {
      // Reset form
      job.value = {} as JobModelAddUpdate
      job.value.postedDate = new Date()
      agreeChecked.value = false

      // Emit event to navigate to manage jobs after a short delay
      setTimeout(() => {
        emit('jobCreated')
      }, 1000) // Wait 1 second for user to see the success message
    }
  } catch (error: any) {
    console.error(isEditMode.value ? 'Update job failed:' : 'Add job failed:', error)
    useNotify({
      message:
        Array.isArray(error.message)
          ? error.message[0]
          : error.message || (isEditMode.value ? 'Cập nhật công việc thất bại. Vui lòng thử lại.' : 'Đăng tải công việc thất bại. Vui lòng thử lại.'),
    })
  } finally {
    loading.value = false
  }
}

const JOB_FIELD_ERROR_ORDER = [
  'title',
  'detailDescription',
  'deadline',
  'category',
  'typeOfEmployment',
  'grade',
  'salaryType',
  'salaryMin',
  'salaryMax',
  'address',
  'location',
  'requiredQualification',
  'experienceLevel',
  'benefits',
  'gender',
  'email',
  'phoneNumber',
] as const

const JOB_FIELD_SECTION: Record<string, 'basic' | 'candidate' | 'contact'> = {
  title: 'basic',
  detailDescription: 'basic',
  deadline: 'basic',
  category: 'basic',
  typeOfEmployment: 'basic',
  grade: 'basic',
  salaryType: 'basic',
  salaryMin: 'basic',
  salaryMax: 'basic',
  address: 'basic',
  location: 'basic',
  requiredQualification: 'candidate',
  experienceLevel: 'candidate',
  benefits: 'candidate',
  gender: 'candidate',
  email: 'contact',
  phoneNumber: 'contact',
}

const openSectionForField = (field: string) => {
  const section = JOB_FIELD_SECTION[field]
  if (section === 'basic') sectionBasicOpen.value = true
  if (section === 'candidate') sectionCandidateOpen.value = true
  if (section === 'contact') sectionContactOpen.value = true
}

const JOB_FIELD_SCROLL_ROW: Partial<Record<string, string>> = {
  category: 'category-type',
  typeOfEmployment: 'category-type',
}

const getDrawerScrollTopOffset = (scrollRoot: HTMLElement) => {
  const rootRect = scrollRoot.getBoundingClientRect()
  let offset = 112 // offset tối thiểu tránh bị header drawer che

  const drawer = scrollRoot.closest<HTMLElement>(
    '.employer-admin-job-drawer, .employer-company-job-drawer',
  )
  const header = drawer?.querySelector<HTMLElement>('.employer-admin-job-drawer-header')
  if (header) {
    const headerRect = header.getBoundingClientRect()
    if (headerRect.bottom > rootRect.top) {
      offset = Math.max(offset, headerRect.bottom - rootRect.top + 16)
    }
  }

  return offset
}

const scrollElementIntoFormView = (element: HTMLElement) => {
  const scrollRoot = getDrawerScrollContainer(element)
  if (!scrollRoot) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }

  const rootRect = scrollRoot.getBoundingClientRect()
  const elRect = element.getBoundingClientRect()
  const topPadding = getDrawerScrollTopOffset(scrollRoot)
  const nextTop = scrollRoot.scrollTop + (elRect.top - rootRect.top) - topPadding

  scrollRoot.scrollTo({
    top: Math.max(0, nextTop),
    behavior: 'smooth',
  })
}

const findJobFieldAnchor = (field: string): HTMLElement | null => {
  const searchRoots: HTMLElement[] = []
  if (jobFormRootRef.value) searchRoots.push(jobFormRootRef.value)
  const drawerScroll = getDrawerScrollContainer()
  if (drawerScroll && !searchRoots.includes(drawerScroll)) searchRoots.push(drawerScroll)

  const rowKey = JOB_FIELD_SCROLL_ROW[field]
  if (rowKey) {
    for (const root of searchRoots) {
      const row = root.querySelector<HTMLElement>(`[data-job-field-row="${rowKey}"]`)
      if (row) return row
    }
  }

  const selector = `[data-job-field="${field}"]`
  for (const root of searchRoots) {
    const match = root.querySelector<HTMLElement>(selector)
    if (match) return match
  }

  return document.querySelector<HTMLElement>(selector)
}

const scrollToFirstError = () => {
  const firstErrorField = JOB_FIELD_ERROR_ORDER.find((field) => jobErrors.value[field])
  if (!firstErrorField) return

  openSectionForField(firstErrorField)

  const runScroll = () => {
    const element = findJobFieldAnchor(firstErrorField)
    if (element) scrollElementIntoFormView(element)
  }

  nextTick(() => {
    requestAnimationFrame(runScroll)
    window.setTimeout(runScroll, 120)
    window.setTimeout(runScroll, 280)
  })
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

  // Email: admin context = optional, user = required
  if (isAdminJobContext.value) {
    if (job.value.email && job.value.email.trim() && !/^\S+@\S+\.\S+$/.test(job.value.email.trim())) {
      jobErrors.value.email = 'Email không đúng định dạng.'
      isValid = false
    }
  } else {
    if (!job.value.email || job.value.email.trim().length === 0) {
      jobErrors.value.email = 'Email không được để trống.'
      isValid = false
    } else if (!/^\S+@\S+\.\S+$/.test(job.value.email.trim())) {
      jobErrors.value.email = 'Email không đúng định dạng.'
      isValid = false
    }
  }

  // Số điện thoại: admin context = optional, user = required
  if (!isAdminJobContext.value && (!job.value.phoneNumber || job.value.phoneNumber.trim().length === 0)) {
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

  // Scroll to first error if validation failed
  if (!isValid) {
    scrollToFirstError()
  }

  return isValid
}
</script>


<style scoped>
:global(body.vselect-scroll-lock) {
  overflow: hidden !important;
}

:global(.ui-drawer-body-vh.vselect-scroll-lock),
:global(.employer-company-job-drawer-body.vselect-scroll-lock) {
  overflow: hidden !important;
  overscroll-behavior: contain;
}
</style>
