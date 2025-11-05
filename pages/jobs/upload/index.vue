<template>
  <div class="min-h-screen px-8 mt-8 mb-8">
    <div class="border border-gray-200 rounded-lg px-8 mt-8 shadow-lg">
      <!-- Header -->
      <div class="flex items-center py-4 border-gray-300 border-b">
        <UButton
          icon="i-heroicons-arrow-left"
          variant="ghost"
          color="neutral"
          class="flex-shrink-0"
          @click="goBack"
        />
        <span class="text-[#378ecc] text-3xl ml-5">{{
          $t('job.uploadJob.title')
        }}</span>
      </div>
      <!-- Stepper -->
      <div class="flex items-center justify-between">
        <UStepper
          ref="stepper"
          :items="steppers"
          class="w-full stepper-cus"
          color="primary"
          size="xl"
          disabled
        >
          <template #school>
            <div
              class="flex flex-col gap-1 w-full"
              style="padding: 30px 0px 30px 0px !important"
            >
              <!-- Header -->
              <div
                class="w-full mb-3 pb-5 border-b-2 border-solid border-gray-300"
              >
                <h2
                  class="flex items-center justify-center w-full py-2 px-2 bg-[#378ecc] text-white text-md font-semibold rounded-lg"
                >
                  {{ $t('job.uploadJob.chooseSchool') }}
                </h2>
              </div>

              <label
                for="company-mst"
                class="font-medium text-sm text-gray-700"
              >
                {{ $t('company.action.inputMST') }}
                <span class="text-black">{{
                  $t('job.uploadJob.mandatoryChar')
                }}</span>
              </label>
              <!-- MST -->
              <div
                class="flex flex-row gap-2 w-full"
                style="padding: 0px !important"
              >
                <!-- Input -->
                <UInput
                  id="company-mst"
                  v-model="mstCompany"
                  variant="outline"
                  class="w-full text-sm"
                  :placeholder="$t('company.action.placeHolderMST')"
                />
                <UButton
                  label="Tra cứu"
                  variant="soft"
                  class="self-end"
                  color="neutral"
                  :loading="isGettingCompanyByMst"
                  @click="findCompanyByMst()"
                />
              </div>

              <div v-if="isDisplayInputCompany">
                <!-- Name -->
                <div class="pt-5">
                  <!-- Label -->
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.name') }}
                    <span aria-hidden="true" class="text-black">{{
                      $t('common.requiredMark')
                    }}</span>
                  </label>
                  <!-- Input -->
                  <UInput
                    v-model="companyAdd.name"
                    variant="outline"
                    class="w-full text-sm"
                    :readonly="isExistCompany"
                  />
                </div>
                <!-- Address -->
                <div class="pt-5">
                  <!-- Label -->
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.address') }}
                    <span aria-hidden="true" class="text-black">{{
                      $t('common.requiredMark')
                    }}</span>
                  </label>
                  <!-- Input -->
                  <UInput
                    v-model="companyAdd.address"
                    variant="outline"
                    class="w-full text-sm"
                    :readonly="isExistCompany"
                  />
                </div>

                <!-- Org type + Founded -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="pt-5">
                    <label class="font-medium text-sm text-gray-700">
                      {{ $t('company.industry') }}
                      <span aria-hidden="true" class="text-black">{{
                        $t('common.requiredMark')
                      }}</span>
                    </label>
                    <USelect
                      v-if="!isExistCompany"
                      :items="organizationTypeItems"
                      :model-value="companyAdd.organizationType?.toString()"
                      :content="{ side: 'bottom' }"
                      class="w-full text-sm"
                      @update:model-value="
                        (v) => (companyAdd.organizationType = Number(v ?? 0))
                      "
                    />
                    <UInput
                      v-else
                      :model-value="
                        organizationTypeItems.find(
                          (item) =>
                            item.value ===
                            companyAdd?.organizationType?.toString(),
                        )?.label ||
                        companyAdd?.organizationType?.toString() ||
                        ''
                      "
                      class="w-full text-sm"
                      readonly
                    />
                  </div>
                  <div class="pt-5">
                    <label class="font-medium text-sm text-gray-700">
                      {{ $t('company.founded') }}
                    </label>
                    <UInput
                      v-model.number="companyAdd.foundedYear"
                      type="number"
                      min="1800"
                      max="2100"
                      class="w-full text-sm"
                      :readonly="isExistCompany"
                      :placeholder="
                        $t('company.form.placeholderFounded') as string
                      "
                    />
                  </div>
                </div>

                <!-- Size + Email -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="pt-5">
                    <label class="font-medium text-sm text-gray-700">
                      {{ $t('company.size') }}
                    </label>
                    <UInput
                      v-model.number="companyAdd.companySize"
                      type="number"
                      min="0"
                      step="1"
                      class="w-full text-sm"
                      :readonly="isExistCompany"
                      :placeholder="$t('company.form.placeholderCompanySize')"
                    />
                  </div>
                  <!-- Website -->
                  <div class="pt-5">
                    <label class="font-medium text-sm text-gray-700">
                      {{ $t('company.website') }}
                    </label>
                    <UInput
                      v-model.trim="companyAdd.website"
                      type="url"
                      class="w-full text-sm"
                      :readonly="isExistCompany"
                      :placeholder="$t('company.form.placeholderWebsite')"
                    />
                  </div>
                </div>

                <!-- Social links -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="pt-5">
                    <label class="font-medium text-sm text-gray-700">
                      {{ $t('company.social.facebook') }}
                    </label>
                    <UInput
                      v-model.trim="companyAdd.facebookLink"
                      class="w-full text-sm"
                      :readonly="isExistCompany"
                      :placeholder="$t('company.form.placeholderFacebook')"
                    />
                  </div>
                  <div class="pt-5">
                    <label class="font-medium text-sm text-gray-700">
                      {{ $t('company.social.twitter') }}
                    </label>
                    <UInput
                      v-model.trim="companyAdd.twitterLink"
                      class="w-full text-sm"
                      :readonly="isExistCompany"
                      :placeholder="$t('company.form.placeholderTwitter')"
                    />
                  </div>
                  <div>
                    <label class="font-medium text-sm text-gray-700">
                      {{ $t('company.social.instagram') }}
                    </label>
                    <UInput
                      v-model.trim="companyAdd.instagramLink"
                      class="w-full text-sm"
                      :readonly="isExistCompany"
                      :placeholder="$t('company.form.placeholderInstagram')"
                    />
                  </div>
                  <div>
                    <label class="font-medium text-sm text-gray-700">
                      {{ $t('company.social.linkedin') }}
                    </label>
                    <UInput
                      v-model.trim="companyAdd.linkedInLink"
                      class="w-full text-sm"
                      :readonly="isExistCompany"
                      :placeholder="$t('company.form.placeholderLinkedIn')"
                    />
                  </div>
                </div>

                <!-- Logo uploader (REQUIRED) - Only show if not exist -->
                <div v-if="!isExistCompany" class="pt-5">
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.form.logoTitle') }}
                    <span aria-hidden="true" class="text-black">{{
                      $t('common.requiredMark')
                    }}</span>
                  </label>

                  <div
                    class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition bg-gray-50"
                    :class="
                      isDraggingLogo
                        ? 'ring-2 ring-blue-400 bg-blue-50'
                        : 'border-gray-400'
                    "
                    @click="logoFileEl?.click()"
                    @dragenter.prevent="onDragEnterLogo"
                    @dragover.prevent
                    @dragleave.prevent="onDragLeaveLogo"
                    @drop="onDropLogo"
                  >
                    <input
                      ref="logoFileEl"
                      type="file"
                      accept="image/*"
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
                </div>

                <!-- Company images uploader (OPTIONAL) - Only show if not exist -->
                <div v-if="!isExistCompany" class="pt-5">
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
                      accept="image/*"
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

                <!-- Description & Overview -->
                <div class="pt-5">
                  <div class="flex flex-col gap-1 rich-text-output">
                    <label class="font-medium text-sm text-gray-700">
                      {{ $t('company.form.descLabel') }}
                    </label>
                    <RichTextEditor
                      :model-value="companyAdd.description || undefined"
                      class="w-full rich-text-content"
                      :readonly="isExistCompany"
                      :placeholder="$t('company.form.descPlaceholder')"
                      @update:model-value="
                        (val) => (companyAdd.description = val || null)
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="isDisplayInputCompany"
              class="flex flex-row gap-1 w-full justify-end"
              style="padding: 0px 0px 38px 20px !important"
            >
              <UButton
                class="bg-[#4f8ef7] text-white hover:bg-[#4568a1ad]"
                style="
                  padding: 8px 16px;
                  border: none;
                  border-radius: 6px;
                  cursor: pointer;
                "
                label="Xác nhận & Tiếp tục"
                @click="confirmCreateSchool()"
              />
            </div>
          </template>
          <template #detail>
            <!-- Input type job -->
            <div
              class="flex flex-col gap-1 w-full"
              style="padding: 30px 20px 30px 20px !important"
            >
              <!-- Label -->
              <label for="job-title" class="font-medium text-sm text-gray-700">
                {{ $t('job.uploadJob.nameJobLabel') }}
                <span class="text-black">{{
                  $t('job.uploadJob.mandatoryChar')
                }}</span>
              </label>

              <!-- Input -->
              <UInput
                id="job-title"
                v-model="job.title"
                class="w-full text-base"
                :placeholder="$t('job.uploadJob.nameJobPlaceHolder')"
              />
            </div>

            <!-- Job description -->
            <div
              class="flex flex-col gap-1 w-full rich-text-output"
              style="padding: 0px 20px 30px 20px !important"
            >
              <label class="font-medium text-sm text-gray-700">
                {{ $t('job.uploadJob.detailJobLabel') }}
                <span class="text-black">{{
                  $t('job.uploadJob.mandatoryChar')
                }}</span>
              </label>
              <!-- Text Editor -->
              <RichTextEditor
                id="job-description"
                v-model="job.description"
                class="w-full rich-text-content"
              />
            </div>

            <!-- Job name -->
            <div
              class="flex flex-col gap-1 w-full"
              style="padding: 0px 20px 30px 20px !important"
            >
              <!-- Label -->
              <label for="job-title" class="font-medium text-sm text-gray-700">
                {{ $t('job.uploadJob.companyNameLabel') }}
              </label>

              <!-- Input -->
              <UInput
                id="company-name"
                :model-value="companyAdd?.name || ''"
                class="w-full text-sm"
                readonly
              />
            </div>

            <!-- Job category -->
            <div
              class="grid grid-cols-3 gap-4"
              style="padding: 0px 20px 30px 20px !important"
            >
              <div>
                <!-- Label -->
                <label
                  for="job-title"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.deadlineLabel') }}
                  <span class="text-black">{{
                    $t('job.uploadJob.mandatoryChar')
                  }}</span>
                </label>

                <!-- Input deadline date -->
                <UPopover>
                  <UButton
                    class="w-full justify-start bg-white text-sm"
                    color="neutral"
                    variant="outline"
                    icon="i-lucide-calendar"
                  >
                    <template v-if="job.deadline">
                      {{ formatDateDeadline(job.deadline) }}
                    </template>
                    <template v-else>
                      {{ $t('job.uploadJob.chooseDate') }}
                    </template>
                  </UButton>
                  <template #content>
                    <UCalendar
                      v-model="deadlineCalendarDate"
                      class="p-2"
                      :min-value="minDeadlineDate"
                      :max-value="maxDeadlineDate"
                      :is-hidden="isDeadlineDateHidden"
                    />
                  </template>
                </UPopover>
              </div>
              <div>
                <!-- Label -->
                <label
                  for="job-title"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.categoryLabel') }}
                  <span class="text-black">{{
                    $t('job.uploadJob.mandatoryChar')
                  }}</span>
                </label>

                <USelectMenu
                  :model-value="{
                    label:
                      categoryItemsWithoutAll.find(
                        (item) => item.value === job.category?.toString(),
                      )?.label || '',
                    value: job.category?.toString() || '',
                  }"
                  :items="categoryItemsWithoutAll"
                  class="w-full pt-2 pb-2 text-sm"
                  searchable
                  :placeholder="$t('job.uploadJob.chooseCategory')"
                  @update:model-value="
                    (val) => (job.category = Number(val?.value ?? 0))
                  "
                />
              </div>
              <div>
                <!-- Label -->
                <label
                  for="job-title"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.typeJobLabel') }}
                </label>

                <!-- Input job type -->
                <USelect
                  :items="employmentTypeItems"
                  :model-value="job.typeOfEmployment?.toString()"
                  :placeholder="$t('job.uploadJob.chooseTypeOfEmployment')"
                  class="w-full text-sm"
                  :content="{ side: 'bottom' }"
                  @update:model-value="
                    (val) => (job.typeOfEmployment = Number(val ?? 0))
                  "
                />
              </div>
            </div>

            <!-- Job salary -->
            <div
              class="grid grid-cols-4 gap-4"
              style="padding: 0px 20px 30px 20px !important"
            >
              <div class="col-span-2">
                <!-- Label -->
                <label
                  for="job-title"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.currentSalaryLabel') }}
                </label>

                <!-- Input -->
                <div>
                  <USelect
                    :items="salaryTypeItems"
                    :model-value="job.salaryType?.toString()"
                    class="w-3/10 pt-2 rounded-r-none border-r-0 text-sm"
                    :content="{ side: 'bottom' }"
                    :placeholder="$t('job.uploadJob.chooseSalaryType')"
                    @update:model-value="
                      (val) => (job.salaryType = Number(val ?? 0))
                    "
                  />
                  <UInput
                    id="job-title"
                    v-model="job.salaryTypeValue"
                    class="w-7/10 rounded-l-none border-l-0 text-sm"
                    type="text"
                    :placeholder="$t('job.uploadJob.enterSalary')"
                  />
                </div>
              </div>
              <div v-if="job.salaryType != 5">
                <!-- Label -->
                <label
                  for="job-title"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.minSalaryLabel') }}
                </label>

                <!-- Input -->
                <UInput
                  id="job-title"
                  v-model="job.salaryMin"
                  class="w-full text-sm"
                  type="text"
                  :placeholder="$t('job.uploadJob.minSalary')"
                />
              </div>
              <div v-if="job.salaryType != 5">
                <!-- Label -->
                <label
                  for="job-title"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.maxSalaryLabel') }}
                </label>

                <!-- Input -->
                <UInput
                  id="job-title"
                  v-model="job.salaryMax"
                  class="w-full text-sm"
                  type="text"
                  :placeholder="$t('job.uploadJob.maxSalary')"
                />
              </div>
            </div>

            <!-- Job address -->
            <div
              class="flex flex-col gap-1 w-full"
              style="padding: 0px 20px 30px 20px !important"
            >
              <!-- Label -->
              <label for="job-title" class="font-medium text-sm text-gray-700">
                {{ $t('job.uploadJob.addressJobLabel') }}
                <span class="text-black">{{
                  $t('job.uploadJob.mandatoryChar')
                }}</span
                >&nbsp;&nbsp;&nbsp;&nbsp;{{
                  $t('job.uploadJob.subAddressJobLabel')
                }}
              </label>

              <!-- Input -->
              <UInput
                id="company-address"
                :model-value="companyAdd?.address || ''"
                class="w-full text-base"
                readonly
              />
            </div>

            <!-- Job location address -->
            <div
              class="flex flex-col gap-1 w-full"
              style="padding: 0px 20px 38px 20px !important"
            >
              <!-- Label -->
              <label for="job-title" class="font-medium text-sm text-gray-700">
                {{ $t('job.uploadJob.locationJobLabel') }}
                <span class="text-black">{{
                  $t('job.uploadJob.mandatoryChar')
                }}</span>
              </label>

              <!-- Input locations -->
              <USelectMenu
                :model-value="{
                  label:
                    locationItemsWithoutAll.find(
                      (item) => item.value === job.location?.toString(),
                    )?.label || '',
                  value: job.location?.toString() || '',
                }"
                :items="locationItemsWithoutAll"
                class="w-full pt-2 pb-2 text-sm"
                searchable
                :content="{ side: 'bottom' }"
                :placeholder="$t('job.uploadJob.chooseLocation')"
                @update:model-value="
                  (val) => (job.location = Number(val?.value ?? 0))
                "
              />
            </div>

            <!-- More information -->
            <div>
              <div
                class="flex items-center py-4 border-gray-300 border-b mb-10"
              >
                <span class="text-[#378ecc] text-3xl ml-5">{{
                  $t('job.uploadJob.moreInformation')
                }}</span>
              </div>
              <!-- Job email/required qualification -->
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-4"
                style="padding: 0px 20px 30px 20px !important"
              >
                <!-- Job email -->
                <div>
                  <!-- Label -->
                  <label
                    for="job-title"
                    class="font-medium text-sm text-gray-700"
                  >
                    {{ $t('job.uploadJob.emailJobLabel') }}
                    <span class="text-black">{{
                      $t('job.uploadJob.mandatoryChar')
                    }}</span>
                  </label>

                  <!-- Input email -->
                  <UInput
                    id="job-email"
                    v-model.trim="job.email"
                    class="w-full text-sm"
                    type="email"
                    :placeholder="$t('job.uploadJob.emailJobPlaceholder')"
                  />
                </div>

                <!-- Job required qualification Level -->
                <div>
                  <label
                    for="job-title"
                    class="font-medium text-sm text-gray-700"
                  >
                    {{ $t('job.uploadJob.requiredQualificationLabel') }}
                  </label>
                  <USelect
                    :items="requiredQualificationItems"
                    :model-value="job.requiredQualification?.toString() || ''"
                    class="w-full text-sm"
                    searchable
                    :placeholder="
                      $t('job.uploadJob.requiredQualificationLabel')
                    "
                    :content="{ side: 'bottom' }"
                    @update:model-value="
                      (val) => (job.requiredQualification = Number(val ?? 0))
                    "
                  />
                </div>
              </div>

              <!-- Job experience/benefit Level -->
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-4"
                style="padding: 0px 20px 30px 20px !important"
              >
                <!-- Job experience Level -->
                <div>
                  <!-- Label -->
                  <label
                    for="job-title"
                    class="font-medium text-sm text-gray-700"
                  >
                    {{ $t('job.uploadJob.experienceLabel') }}
                    <span class="text-black">{{
                      $t('job.uploadJob.mandatoryChar')
                    }}</span>
                  </label>
                  <!-- Input Experience Level -->
                  <USelect
                    :items="experienceLevelItems"
                    :model-value="job.experienceLevel?.toString()"
                    class="w-full text-sm"
                    :content="{ side: 'bottom' }"
                    :placeholder="$t('job.uploadJob.chooseExperienceLevel')"
                    @update:model-value="
                      (val) => (job.experienceLevel = Number(val ?? 0))
                    "
                  />
                </div>

                <!-- Job benefit Level -->
                <div>
                  <!-- Label -->
                  <label
                    for="job-title"
                    class="font-medium text-sm text-gray-700"
                  >
                    {{ $t('job.uploadJob.benefitLabel') }}
                    <span class="text-black">{{
                      $t('job.uploadJob.mandatoryChar')
                    }}</span>
                  </label>

                  <!-- Input Benefit -->
                  <USelect
                    v-model="job.benefits"
                    :items="jobBenefitsItems"
                    multiple
                    class="w-full text-sm"
                    :content="{ side: 'bottom' }"
                    :placeholder="$t('job.uploadJob.chooseBenefitLevel')"
                  />
                </div>
              </div>

              <!-- Job gender/grade Level -->
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-4"
                style="padding: 0px 20px 0px 20px !important"
              >
                <!-- Job gender Level -->
                <div>
                  <!-- Label -->
                  <label
                    for="job-title"
                    class="font-medium text-sm text-gray-700"
                  >
                    {{ $t('job.uploadJob.genderLabel') }}
                  </label>
                  <USelect
                    :items="genderItems"
                    :model-value="job.gender?.toString() || ''"
                    class="w-full text-sm"
                    :content="{ side: 'bottom' }"
                    :placeholder="$t('job.uploadJob.chooseGender')"
                    @update:model-value="
                      (val) => (job.gender = Number(val ?? 0))
                    "
                  />
                </div>

                <!-- Job grade Level -->
                <div>
                  <!-- Label -->
                  <label
                    for="job-title"
                    class="font-medium text-sm text-gray-700"
                  >
                    {{ $t('job.uploadJob.gradeLabel') }}
                  </label>
                  <USelect
                    :items="gradeItems"
                    :model-value="job.grade?.toString() || ''"
                    class="w-full text-sm"
                    :content="{ side: 'bottom' }"
                    :placeholder="$t('job.uploadJob.chooseGradeLevel')"
                    @update:model-value="
                      (val) => (job.grade = Number(val ?? 0))
                    "
                  />
                </div>
              </div>

              <div
                class="flex items-center py-4 border-gray-300 border-b mb-10"
              ></div>
            </div>

            <!-- Checkbox agree terms -->
            <div
              class="flex items-center"
              style="
                padding: 0px 20px 20px 20px !important;
                height: 30px !important;
              "
            >
              <UCheckbox
                v-model="agreeChecked"
                class="text-primary mr-3"
              ></UCheckbox>
              <span>
                {{ $t('job.uploadJob.agreeUploadJobLabel') }}
                <a
                  href="#"
                  style="
                    color: #0284c7 !important;
                    text-decoration: none !important;
                  "
                >
                  {{ $t('job.uploadJob.agreePolicy') }}
                </a>
                {{ $t('job.uploadJob.and') }}
                <a
                  href="#"
                  style="
                    color: #0284c7 !important;
                    text-decoration: none !important;
                  "
                >
                  {{ $t('job.uploadJob.agreePrivacy') }}
                </a>
              </span>
            </div>

            <!-- Action btn -->
            <div
              class="flex flex-row gap-1 w-full justify-between"
              style="padding: 0px 20px 38px 20px !important"
            >
              <!-- Buton Back -->
              <UButton
                style="
                  margin-top: 15px;
                  padding: 8px 16px;
                  border: none;
                  background-color: #40d1cd;
                  color: white;
                  border-radius: 6px;
                  cursor: pointer;
                "
                label="Trở về hiệu chỉnh trường học"
                @click="goBackToChooseSchool()"
              >
              </UButton>

              <!-- Buton Submit -->
              <UButton
                class="bg-[#4f8ef7] text-white hover:bg-[#4568a1ad]"
                style="
                  margin-top: 15px;
                  padding: 8px 16px;
                  border: none;
                  border-radius: 6px;
                  cursor: pointer;
                "
                :loading="loading"
                @click="addJob()"
              >
                {{ $t('job.uploadJob.uploadJobContent') }}
              </UButton>
            </div>
          </template>
        </UStepper>
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
import { nextTick } from 'vue'
import { UButton } from '#components'
import type { StepperItem } from '@nuxt/ui'
import type {
  CompanyAddUpdateEntity,
  CompanyEntity,
  VietQRBusinessResponse,
} from '~/entities/company'
import type { JobModelAddUpdate } from '~/models/job'
import { CalendarDate, type DateValue } from '@internationalized/date'
const { organizationTypeItems } = useJobFilters()
const stepper = useTemplateRef('stepper')
const steppers = ref<StepperItem[]>([
  {
    slot: 'school' as const,
    title: 'Trường học',
    icon: 'i-lucide-school',
  },
  {
    slot: 'detail' as const,
    title: 'Chi tiết công việc',
    icon: 'i-lucide-file-pen-line',
  },
])

// Removed tabs - only MST lookup now

// Enum
const {
  categoryItemsWithoutAll,
  employmentTypeItems,
  experienceLevelItems,
  locationItemsWithoutAll,
  jobBenefitsItems,
  salaryTypeItems,
  requiredQualificationItems,
  genderItems,
  gradeItems,
} = useJobFilters()

/** Logo state (REQUIRED) */
const logoFileEl = ref<HTMLInputElement | null>(null)
const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)
const isDraggingLogo = ref(false)

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

  if (file && file.type.startsWith('image/')) {
    setLogoFile(file)
  }
}

function onPickLogo(e: Event) {
  const files = (e.target as HTMLInputElement).files

  if (!files?.length) return

  const file = files[0]

  if (file) {
    setLogoFile(file)
  }
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
  addImageFiles(Array.from(files).filter((f) => f.type.startsWith('image/')))
}

function onPickImages(e: Event) {
  const files = (e.target as HTMLInputElement).files

  if (!files?.length) return
  addImageFiles(Array.from(files).filter((f) => f.type.startsWith('image/')))
  if (imagesFileEl.value) imagesFileEl.value.value = ''
}

function addImageFiles(files: File[]) {
  for (const f of files) {
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

onBeforeUnmount(() => {
  // Cleanup logo preview
  if (logoPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(logoPreview.value)
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

// Category select value for USelectMenu - use ref with watch
const categorySelectValue = ref<string>('')

// Watch categorySelectValue to sync with job.category
watch(categorySelectValue, (newVal) => {
  if (newVal) {
    job.value.category = Number(newVal)
  }
})

// Watch job.category to sync with categorySelectValue
watch(
  () => job.value.category,
  (newVal) => {
    if (newVal) {
      categorySelectValue.value = newVal.toString()
    } else {
      categorySelectValue.value = ''
    }
  },
  { immediate: true },
)
const company = ref<CompanyEntity | null>(null)
const companyAdd = ref<CompanyAddUpdateEntity>({
  name: '',
  mst: null,
  address: '',
  website: '',
  organizationType: 0,
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
  isShow: false,
  isWaiting: false,
  companyImages: [],
} as CompanyAddUpdateEntity)
const selectedCompany = ref<CompanyEntity | null>(null)
const companyByMST = ref<VietQRBusinessResponse | null>(null)

// Initialize
onMounted(() => {
  if (!authStore.user) {
    router.push(ROUTE_PAGE.AUTH.LOGIN)
  }

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
const isGettingCompanyByMst = ref(false)
const isAddCompany = ref(false)
const isExistCompany = ref(false)
const isDisplayInputCompany = ref(false)
const { t } = useI18n()

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

const formatDateDeadline = (dateStr: string): string => {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

// Min date: today
const today = new Date()

const minDeadlineDate = computed(() => {
  return new CalendarDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  )
})

// Max date: today + 30 days
const maxDeadlineDate = computed(() => {
  const maxDate = new Date(today)

  maxDate.setDate(maxDate.getDate() + 30)

  return new CalendarDate(
    maxDate.getFullYear(),
    maxDate.getMonth() + 1,
    maxDate.getDate(),
  )
})

// Calendar date binding
const deadlineCalendarDate = computed({
  get: () => parseDateString(job.value.deadline || null),
  set: (val: DateValue | null) => {
    job.value.deadline = formatDateToString(val)
  },
})

// Function to hide dates outside the allowed range (before today or after 30 days)
const isDeadlineDateHidden = (date: DateValue): boolean => {
  const dateToCheck = new CalendarDate(date.year, date.month, date.day)
  const minDate = minDeadlineDate.value
  const maxDate = maxDeadlineDate.value

  // Hide dates before today or after maxDate (today + 30 days)
  return dateToCheck.compare(minDate) < 0 || dateToCheck.compare(maxDate) > 0
}

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
      if (!companyAdd.value) companyAdd.value = {} as CompanyAddUpdateEntity
      companyAdd.value.id = existingCompany.id ?? null
      companyAdd.value.name = existingCompany.name ?? ''
      companyAdd.value.address = existingCompany.address ?? ''
      companyAdd.value.mst = existingCompany.mst ?? null
      companyAdd.value.logo = existingCompany.logo ?? ''
      companyAdd.value.organizationType = existingCompany.organizationType ?? 0
      companyAdd.value.facebookLink = existingCompany.facebookLink ?? ''
      companyAdd.value.twitterLink = existingCompany.twitterLink ?? ''
      companyAdd.value.linkedInLink = existingCompany.linkedInLink ?? ''
      companyAdd.value.website = existingCompany.website ?? ''
      companyAdd.value.companySize = existingCompany.companySize ?? null
      companyAdd.value.foundedYear = existingCompany.foundedYear ?? null
      companyAdd.value.description = existingCompany.description ?? ''
      companyAdd.value.insight = existingCompany.insight ?? ''
      companyAdd.value.overview = existingCompany.overview ?? ''
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
            companyAdd.value = {} as CompanyAddUpdateEntity
          }

          // Fill data from VietQR
          companyAdd.value.name = companyByMST.value.data.name ?? ''
          companyAdd.value.address = companyByMST.value.data.address ?? ''
          companyAdd.value.mst = companyByMST.value.data.mst ?? ''

          // Init default data for new company
          companyAdd.value.logo = ''
          companyAdd.value.organizationType = 0
          companyAdd.value.isShow = false
          companyAdd.value.isWaiting = false
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
      }
    } else {
      useNotify({
        message: 'Vui lòng tra cứu mã số thuế để tiếp tục.',
      })
    }
  } else {
    // New company - validate and proceed
    isAddCompany.value = true
    const msgErrComp = validateCompanyFields()

    if (msgErrComp && msgErrComp.length > 0) {
      useNotify({
        message: msgErrComp,
      })

      return
    }

    if (stepper.value?.hasNext) {
      stepper.value.next()
    }
  }
}

const goBackToChooseSchool = () => {
  if (stepper.value?.hasPrev) {
    stepper.value.prev()
  }
}

const addJob = async () => {
  // Validate job fields
  const msgErrJob = validateJobFields()

  if (msgErrJob && msgErrJob.length > 0) {
    useNotify({
      message: msgErrJob,
    })

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
    const msgErrComp = validateCompanyFields()

    if (msgErrComp && msgErrComp.length > 0) {
      useNotify({
        message: msgErrComp,
      })

      return
    }

    try {
      // Upload logo (REQUIRED)
      if (!logoFile.value) {
        useNotify({
          message: 'Vui lòng tải lên logo công ty.',
        })
        loading.value = false

        return
      }

      try {
        const logoUrl = await $api.upload.uploadImageAndGetUrl(logoFile.value)

        if (!logoUrl) {
          useNotify({
            message: 'Tải lên logo thất bại. Vui lòng thử lại.',
          })
          loading.value = false

          return
        }
        companyAdd.value.logo = logoUrl
      } catch (error) {
        console.error('Error uploading logo:', error)
        useNotify({
          message: 'Tải lên logo thất bại. Vui lòng thử lại.',
        })
        loading.value = false

        return
      }

      // Upload company images (OPTIONAL)
      if (imageFiles.value.length > 0) {
        companyAdd.value.companyImages = []

        for (let index = 0; index < imageFiles.value.length; index++) {
          const image = imageFiles.value[index]

          try {
            const imageUrl = await $api.upload.uploadImageAndGetUrl(image)

            if (imageUrl) {
              companyAdd.value.companyImages.push({ url: imageUrl })
            } else {
              console.error(`Failed to upload image at index ${index}`)
            }
          } catch (error) {
            console.error(`Error uploading image at index ${index}:`, error)
          }
        }
      }

      const response = await $api.company.addCompany(companyAdd.value)

      if (response) {
        company.value = response
        isAddCompanySuccess = true
      }
    } catch (error: any) {
      console.error('Add company failed:', error)
    }
  } else {
    isAddCompanySuccess = true
  }

  // Add job
  if (isAddCompanySuccess) {
    try {
      // Set id Company for Job
      job.value.companyId = company.value ? company.value.id : NaN

      // Set id User for Job
      job.value.userId = authStore.user ? authStore.user.id : NaN

      // Set default add value
      job.value.isFeatured = false
      job.value.isWaiting = false

      // Call API
      const response = await $api.job.addJob(job.value)

      if (response) {
        isAddJobSuccess = true
      }
    } catch (error: any) {
      console.error('Add job failed:', error)
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

  // Redirect to job list page after successful upload
  goToListJobUser()
}

function validateCompanyFields(): string {
  if (!companyAdd.value.name?.trim()) return t('company.form.errName')
  if (!companyAdd.value.address?.trim()) return t('company.form.errAddress')
  if (!companyAdd.value.organizationType) return t('company.form.errOrgType')

  // Validate logo is required
  if (!logoFile.value && !companyAdd.value.logo) {
    return 'Vui lòng tải lên logo công ty.'
  }

  if (
    companyAdd.value.website &&
    !/^https?:\/\/.+/i.test(companyAdd.value.website)
  )
    return t('company.form.errWebsite')
  if (
    companyAdd.value.companySize != null &&
    (!Number.isFinite(companyAdd.value.companySize) ||
      companyAdd.value.companySize < 0 ||
      !Number.isInteger(companyAdd.value.companySize))
  ) {
    return t('company.form.errCompanySize')
  }

  return ''
}

function validateJobFields(): string {
  if (!job.value.title || job.value.title.trim().length === 0) {
    return 'Tên công việc không được để trống.'
  }
  // Check if description is empty or only contains empty HTML tags
  const descriptionHtml = job.value.description || ''

  const cleanDescription = descriptionHtml.replace(/<[^>]*>/g, '').trim()

  if (cleanDescription.length === 0) {
    return 'Mô tả công việc không được để trống.'
  }
  if (!job.value.deadline) {
    return 'Vui lòng chọn hạn nộp hồ sơ.'
  }
  if (!job.value.category) {
    return 'Vui lòng chọn ngành nghề.'
  }
  if (!job.value.typeOfEmployment) {
    return 'Vui lòng chọn loại hình công việc.'
  }
  if (!job.value.salaryType) {
    return 'Vui lòng chọn loại lương.'
  }
  if (!job.value.experienceLevel) {
    return 'Vui lòng chọn kinh nghiệm yêu cầu.'
  }
  if (!job.value.benefits || job.value.benefits.length === 0) {
    return 'Vui lòng chọn quyền lợi.'
  }
  if (!job.value.location) {
    return 'Vui lòng chọn địa điểm làm việc.'
  }
  if (isExistCompany.value && !job.value.companyId) {
    return 'Vui lòng chọn trường học.'
  }
  if (!job.value.email || job.value.email.trim().length === 0) {
    return 'Email liên hệ không được để trống.'
  }
  if (job.value.email && !/^\S+@\S+\.\S+$/.test(job.value.email.trim())) {
    return 'Email không đúng định dạng.'
  }

  // Kiểm tra độ dài
  if (job.value.title && job.value.title.length > 255) {
    return 'Tên công việc không được vượt quá 255 ký tự.'
  }

  // Kiểm tra lương (nếu có)
  if (
    job.value.salaryMin &&
    job.value.salaryMax &&
    Number(job.value.salaryMin) > Number(job.value.salaryMax)
  ) {
    return 'Lương tối thiểu không được lớn hơn lương tối đa.'
  }

  return ''
}
</script>

<style scoped>
/* Nút inactive */
::v-deep(.stepper-cus button[data-state='inactive']) {
  background-color: #d4d4d4 !important;
  color: white !important;
}

/* Nút active */
::v-deep(.stepper-cus button[data-state='active']) {
  background-color: #378ecc !important;
  color: white !important;
}

/* Nút completed */
::v-deep(.stepper-cus button[data-state='completed']) {
  background-color: #378ecc !important;
  color: white !important;
}

/* Thanh ngang completed */
::v-deep(.stepper-cus div.absolute.rounded-full[data-state='completed']) {
  background-color: #378ecc !important;
  color: white !important;
}

/* Thanh ngang inactive */
::v-deep(.stepper-cus div.absolute.rounded-full[data-state='active']) {
  background-color: #d4d4d4 !important;
  color: white !important;
}

/* Thanh ngang inactive */
::v-deep(.stepper-cus div.flex) {
  padding: 20px 0px !important;
}
</style>
