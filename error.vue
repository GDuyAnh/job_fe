<template>
  <div class="bg-gray-200 flex justify-center items-center h-screen">
    <div
      class="max-w-[650px] flex flex-col items-center w-full bg-white p-8 rounded-3xl text-center mx-4 md:mx-0"
    >
      <nuxt-link class="text-lg text-primary underline" :to="ROUTE_PAGE.HOME">{{
        $t('pages.errorPage.notFound.toLogin')
      }}</nuxt-link>
    </div>
  </div>
</template>
