<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div class="mt-10">
    <img src="/images/logo-bg.png" alt="logo" />
    <app-heading>
      Heading
      <template #subheading>Subheading</template>
    </app-heading>

    <div class="text-lg font-bold">Button Primary Size XS (Height: 22px)</div>
    <app-button class="mt-5" shape="round" size="xs" compact
      >(Button compact)</app-button
    >
    <app-button class="mt-5" shape="round" size="xs" block>
      (Button block)
    </app-button>
    <app-button class="mt-5" shape="round" size="xs"
      >(Button default)</app-button
    >

    <div class="text-lg font-bold mt-10">
      Button Primary Size SM (Height: 30px)
    </div>
    <app-button class="mt-5" shape="round" size="sm" compact
      >(Button compact)</app-button
    >
    <app-button class="mt-5" shape="round" size="sm" block>
      (Button block)
    </app-button>
    <app-button class="mt-5" shape="round" size="sm"
      >(Button default)</app-button
    >

    <!-- Primary -->
    <div class="text-lg font-bold mt-10">
      Button Primary Size MD (Default Height: 36px)
    </div>
    <app-button class="mt-5" shape="round" compact>(Button compact)</app-button>
    <app-button class="mt-5" variant="outline" shape="round" compact
      >(Button compact)</app-button
    >
    <app-button disabled class="mt-5" variant="outline" shape="round" compact
      >(Button disabled)</app-button
    >

    <app-button class="mt-5" shape="round" block> (Button block) </app-button>
    <app-button class="mt-5" shape="round">(Button default)</app-button>

    <!-- Secondary -->
    <div class="text-lg font-bold mt-10">
      Button Secondary Size MD (Default Height: 36px)
    </div>
    <app-button class="mt-5" color="secondary" shape="round" compact
      >(Button compact)</app-button
    >
    <app-button
      class="mt-5"
      variant="outline"
      color="secondary"
      shape="round"
      compact
      >(Button compact)</app-button
    >
    <app-button
      disabled
      class="mt-5"
      variant="outline"
      color="secondary"
      shape="round"
      compact
      >(Button disabled)</app-button
    >

    <app-button class="mt-5" color="secondary" :shadow="false" block
      >Button No shadow</app-button
    >

    <!-- warning -->
    <div class="text-lg font-bold mt-10">
      Button Warning Size MD (Default Height: 36px)
    </div>
    <app-button class="mt-5" color="warning" shape="round" compact
      >(Button compact)</app-button
    >
    <app-button
      class="mt-5"
      variant="outline"
      color="warning"
      shape="round"
      compact
      >(Button compact)</app-button
    >

    <app-button class="mt-5" color="secondary" shape="round" block>
      (Button block)
    </app-button>
    <app-button class="mt-5" color="secondary" shape="round"
      >(Button default)</app-button
    >

    <div class="text-lg font-bold mt-10">
      Button Primary Size LG ( Height: 44px)
    </div>
    <app-button class="mt-5" shape="round" size="lg" compact
      >(Button compact)</app-button
    >
    <app-button class="mt-5" shape="round" size="lg" block>
      (Button block)
    </app-button>
    <app-button class="mt-5" shape="round" size="lg"
      >(Button default)</app-button
    >

    <div class="text-lg font-bold mt-10">
      Button Primary Size XL ( Height: 56px)
    </div>
    <app-button class="mt-5" shape="round" size="xl" compact
      >(Button compact)</app-button
    >
    <app-button class="mt-5" shape="round" size="xl" block>
      (Button block)
    </app-button>
    <app-button class="mt-5" shape="round" size="xl"
      >(Button default)</app-button
    >

    <app-select
      class="mt-5"
      :items="[
        {
          label: 'Item 1',
          value: 'item1',
        },
        {
          label: 'Item 2',
          value: 'item2',
        },
      ]"
    />

    <div class="text-lg font-bold mt-10">Form Default</div>

    <!--
 <app-form
      class="mt-5"
      :state="formState"
      :schema="loginSchema()"
      @submit="onSubmit"
    >
      <app-form-field required label="Email" name="email">
        <app-input v-model="formState.email" />
      </app-form-field>
      <app-form-field required label="Password" name="password">
        <app-input v-model="formState.password" />
      </app-form-field>

      <app-checkbox label="Remember me" />

      <div class="text-center">
        <app-button type="submit" shape="round" color="secondary">
          Submit
        </app-button>
      </div>
    </app-form> 
-->
  </div>
</template>

<script setup lang="ts">
// const { $api } = useNuxtApp()

// Using $api to handle action POST, PUT, DELETE

// const login = async () => {
//   const { data } = await $api.auth.login({
//     email: 'test@test.com',
//     password: 'password',
//   })

//   console.log(data)
// }

// Using useApi to fetch data

// const fetchData = async () => {
//   const {data} = useApi(ROUTE_API.ME)
// }
</script>
