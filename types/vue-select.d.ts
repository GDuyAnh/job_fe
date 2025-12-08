declare module 'vue-select' {
  import { DefineComponent } from 'vue'

  const vSelect: DefineComponent<{
    modelValue?: any
    options?: any[]
    multiple?: boolean
    clearable?: boolean
    searchable?: boolean
    label?: string
    placeholder?: string
    disabled?: boolean
    class?: string | string[]
    [key: string]: any
  }>
  
  export default vSelect
}

