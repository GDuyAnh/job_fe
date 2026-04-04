<template>
  <div class="rich-text-editor">
    <!-- Toolbar -->
    <div v-if="!readonly" class="editor-toolbar border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-2 relative">
      <UButton variant="ghost" size="xs" :color="editor?.isActive('bold') ? 'primary' : 'neutral'" @click="editor?.chain().focus().toggleBold().run()">
        <UIcon name="i-lucide-bold" class="w-4 h-4" />
      </UButton>
      <UButton variant="ghost" size="xs" :color="editor?.isActive('italic') ? 'primary' : 'neutral'" @click="editor?.chain().focus().toggleItalic().run()">
        <UIcon name="i-lucide-italic" class="w-4 h-4" />
      </UButton>
      <UButton variant="ghost" size="xs" :color="editor?.isActive('strike') ? 'primary' : 'neutral'" @click="editor?.chain().focus().toggleStrike().run()">
        <UIcon name="i-lucide-strikethrough" class="w-4 h-4" />
      </UButton>
      <div class="border-l border-gray-300 mx-1" />
      <UButton variant="ghost" size="xs" :color="editor?.isActive({ heading: { level: 1 } }) ? 'primary' : 'neutral'" @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()">
        <UIcon name="i-lucide-heading-1" class="w-4 h-4" />
      </UButton>
      <UButton variant="ghost" size="xs" :color="editor?.isActive({ heading: { level: 2 } }) ? 'primary' : 'neutral'" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()">
        <UIcon name="i-lucide-heading-2" class="w-4 h-4" />
      </UButton>
      <UButton variant="ghost" size="xs" :color="editor?.isActive({ heading: { level: 3 } }) ? 'primary' : 'neutral'" @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()">
        <UIcon name="i-lucide-heading-3" class="w-4 h-4" />
      </UButton>
      <div class="border-l border-gray-300 mx-1" />
      <UButton variant="ghost" size="xs" :color="editor?.isActive('bulletList') ? 'primary' : 'neutral'" @click="editor?.chain().focus().toggleBulletList().run()">
        <UIcon name="i-lucide-list" class="w-4 h-4" />
      </UButton>
      <UButton variant="ghost" size="xs" :color="editor?.isActive('orderedList') ? 'primary' : 'neutral'" @click="editor?.chain().focus().toggleOrderedList().run()">
        <UIcon name="i-lucide-list-ordered" class="w-4 h-4" />
      </UButton>
      <div class="border-l border-gray-300 mx-1" />
      <UButton variant="ghost" size="xs" :color="editor?.isActive('blockquote') ? 'primary' : 'neutral'" @click="editor?.chain().focus().toggleBlockquote().run()">
        <UIcon name="i-lucide-quote" class="w-4 h-4" />
      </UButton>
      <UButton variant="ghost" size="xs" :color="editor?.isActive('codeBlock') ? 'primary' : 'neutral'" @click="editor?.chain().focus().toggleCodeBlock().run()">
        <UIcon name="i-lucide-code" class="w-4 h-4" />
      </UButton>
      <div class="border-l border-gray-300 mx-1" />
      <!-- Image Upload Button -->
      <UButton variant="ghost" size="xs" @click.stop="showImagePopup = !showImagePopup">
        <UIcon name="i-lucide-image" class="w-4 h-4" />
      </UButton>
      
      <!-- Image Popup -->
      <div v-if="showImagePopup" class="absolute top-full left-0 mt-1 z-[100] bg-white rounded-lg shadow-xl border border-gray-200 w-72">
        <div class="p-3">
          <div class="flex border-b border-gray-200 mb-3">
            <button type="button" :class="['flex-1 py-1.5 text-xs font-medium border-b-2', imageTab === 'upload' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500']" @click="imageTab = 'upload'">Tải lên</button>
            <button type="button" :class="['flex-1 py-1.5 text-xs font-medium border-b-2', imageTab === 'link' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500']" @click="imageTab = 'link'">Link URL</button>
          </div>
          
          <div v-if="imageTab === 'upload'" class="space-y-2">
            <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
            <div v-if="!previewImage" class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500" @click="imageInput?.click()">
              <UIcon name="i-lucide-upload" class="w-8 h-8 text-gray-400 mb-1" />
              <p class="text-xs text-gray-600">Chọn hình ảnh</p>
            </div>
            <div v-else class="space-y-2">
              <img :src="previewImage" alt="Preview" class="w-full max-h-24 object-contain rounded-lg border border-gray-200" />
              <div class="flex gap-1">
                <UButton variant="ghost" size="xs" @click="previewImage = ''; if(imageInput) imageInput.value = ''">Chọn lại</UButton>
                <UButton color="primary" size="xs" @click="insertUploadedImage">Chèn</UButton>
              </div>
            </div>
          </div>
          
          <div v-if="imageTab === 'link'" class="space-y-2">
            <UInput v-model="imageUrl" placeholder="https://example.com/image.jpg" size="sm" />
            <div class="flex justify-end gap-1">
              <UButton variant="ghost" size="xs" @click="showImagePopup = false">Hủy</UButton>
              <UButton color="primary" size="xs" :disabled="!imageUrl" @click="insertImageFromUrl">Chèn</UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Editor Content -->
    <div class="editor-content border border-gray-300 rounded-b-lg relative" :class="{ 'rounded-t-lg': readonly, 'bg-gray-50': readonly }">
      <EditorContent :editor="editor" />
      
      <!-- Image Floating Menu -->
      <div v-if="showImageMenu" class="fixed z-[9999] bg-white shadow-lg rounded-lg border border-gray-200 p-2 flex items-center gap-1" style="top: 100px; left: 50%; transform: translateX(-50%);">
        <UButton variant="ghost" size="xs" :color="selectedImageAlign === 'left' ? 'primary' : 'neutral'" title="Căn trái" @click="setImageAlign('left')">
          <UIcon name="i-lucide-align-left" class="w-4 h-4" />
        </UButton>
        <UButton variant="ghost" size="xs" :color="selectedImageAlign === 'center' ? 'primary' : 'neutral'" title="Căn giữa" @click="setImageAlign('center')">
          <UIcon name="i-lucide-align-center" class="w-4 h-4" />
        </UButton>
        <UButton variant="ghost" size="xs" :color="selectedImageAlign === 'right' ? 'primary' : 'neutral'" title="Căn phải" @click="setImageAlign('right')">
          <UIcon name="i-lucide-align-right" class="w-4 h-4" />
        </UButton>
        <div class="border-l border-gray-300 mx-1 h-4" />
        <div class="relative group">
          <UButton variant="ghost" size="xs" title="Kích thước">
            <UIcon name="i-lucide-expand" class="w-4 h-4" />
          </UButton>
          <div class="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-200 p-1 hidden group-hover:block min-w-[100px] z-[60]">
            <button type="button" :class="['w-full px-2 py-1 text-left text-xs hover:bg-gray-100 rounded', selectedImageWidth === '25%' ? 'bg-blue-50 text-blue-600' : 'text-gray-700']" @click="setImageWidth('25%')">Nhỏ (25%)</button>
            <button type="button" :class="['w-full px-2 py-1 text-left text-xs hover:bg-gray-100 rounded', selectedImageWidth === '50%' ? 'bg-blue-50 text-blue-600' : 'text-gray-700']" @click="setImageWidth('50%')">Vừa (50%)</button>
            <button type="button" :class="['w-full px-2 py-1 text-left text-xs hover:bg-gray-100 rounded', selectedImageWidth === '75%' ? 'bg-blue-50 text-blue-600' : 'text-gray-700']" @click="setImageWidth('75%')">Lớn (75%)</button>
            <button type="button" :class="['w-full px-2 py-1 text-left text-xs hover:bg-gray-100 rounded', selectedImageWidth === '100%' ? 'bg-blue-50 text-blue-600' : 'text-gray-700']" @click="setImageWidth('100%')">Full (100%)</button>
          </div>
        </div>
        <div class="border-l border-gray-300 mx-1 h-4" />
        <UButton variant="ghost" size="xs" color="error" title="Xóa ảnh" @click="deleteImage">
          <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Image } from '@tiptap/extension-image'

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'center',
        parseHTML: (element) => element.getAttribute('data-align') || 'center',
        renderHTML: (attributes) => {
          let style = `width: ${attributes.width}; `
          if (attributes.align === 'center') {
            style += 'display: block; margin-left: auto; margin-right: auto;'
          } else if (attributes.align === 'left') {
            style += 'display: block; margin-left: 0; margin-right: auto;'
          } else if (attributes.align === 'right') {
            style += 'display: block; margin-left: auto; margin-right: 0;'
          }
          return { 'data-align': attributes.align, class: `image-align-${attributes.align}`, style }
        },
      },
      width: {
        default: '100%',
        parseHTML: (element) => element.getAttribute('data-width') || '100%',
        renderHTML: (attributes) => ({ 'data-width': attributes.width }),
      },
      isUploaded: {
        default: false,
        parseHTML: (element) => element.getAttribute('data-is-uploaded') === 'true',
        renderHTML: (attributes) => ({ 'data-is-uploaded': attributes.isUploaded }),
      },
      tempId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-temp-id'),
        renderHTML: (attributes) => ({ 'data-temp-id': attributes.tempId }),
      },
    }
  },
})

interface Props {
  modelValue?: string | null
  placeholder?: string
  readonly?: boolean
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  readonly: false,
  rows: 12,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'imagesChanged': [images: { tempId: string, file: File }[]]
}>()

const { $api } = useNuxtApp()

const showImagePopup = ref(false)
const imageTab = ref<'upload' | 'link'>('upload')
const imageInput = ref<HTMLInputElement | null>(null)
const previewImage = ref('')
const imageUrl = ref('')

const showImageMenu = ref(false)
const selectedImageAlign = ref<'left' | 'center' | 'right'>('center')
const selectedImageWidth = ref<string>('100%')
const imageMenuPosition = ref({ top: 0, left: 0 })
const selectedImageNode = ref<{ node: any; pos: number } | null>(null)

const temporaryImages = ref<{ tempId: string; file: File; objectUrl: string }[]>([])

function generateTempId(): string {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: props.placeholder }),
    CustomImage.configure({ inline: false, allowBase64: false }),
  ],
  editable: !props.readonly,
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    emit('update:modelValue', html === '<p></p>' ? '' : html)
    extractTemporaryImages(html)
  },
  editorProps: {
    attributes: { class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 min-h-[200px] max-w-none' },
  },
})

function onEditorClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.tagName === 'IMG') {
    showImageMenuForImage(event)
  } else {
    showImageMenu.value = false
  }
}

function extractTemporaryImages(html: string) {
  const tempImages: { tempId: string; file: File }[] = []
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const images = doc.querySelectorAll('img[data-temp-id]')
  images.forEach((img) => {
    const tempId = img.getAttribute('data-temp-id')
    if (tempId) {
      const tempImage = temporaryImages.value.find((t) => t.tempId === tempId)
      if (tempImage) tempImages.push({ tempId, file: tempImage.file })
    }
  })
  emit('imagesChanged', tempImages)
}

function showImageMenuForImage(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.tagName !== 'IMG') return
  
  if (!editor.value) return
  const { state } = editor.value
  const view = editor.value.view
  
  let imagePos: number | null = null
  let imageNode: any = null
  
  state.doc.descendants((node, pos) => {
    if (node.type.name === 'image') {
      const nodeDOM = view.nodeDOM(pos)
      if (nodeDOM && (nodeDOM === target || (nodeDOM as HTMLElement).contains(target))) {
        imageNode = node
        imagePos = pos
        return false
      }
    }
    return true
  })
  
  if (!imageNode || imagePos === null) return
  
  selectedImageNode.value = { node: imageNode, pos: imagePos }
  selectedImageAlign.value = imageNode.attrs?.align || 'center'
  selectedImageWidth.value = imageNode.attrs?.width || '100%'
  
  showImageMenu.value = true
}

function setImageAlign(align: 'left' | 'center' | 'right') {
  if (!editor.value || !selectedImageNode.value) return
  const { node, pos } = selectedImageNode.value
  const { state } = editor.value
  const tr = state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, align })
  editor.value.view.dispatch(tr)
  selectedImageAlign.value = align
}

function setImageWidth(width: string) {
  if (!editor.value || !selectedImageNode.value) return
  const { node, pos } = selectedImageNode.value
  const { state } = editor.value
  const tr = state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, width })
  editor.value.view.dispatch(tr)
  selectedImageWidth.value = width
}

function deleteImage() {
  if (!editor.value || !selectedImageNode.value) return
  const { node, pos } = selectedImageNode.value
  const tempId = node.attrs?.tempId
  if (tempId) {
    const tempImage = temporaryImages.value.find((t) => t.tempId === tempId)
    if (tempImage) {
      URL.revokeObjectURL(tempImage.objectUrl)
      temporaryImages.value = temporaryImages.value.filter((t) => t.tempId !== tempId)
    }
  }
  const { state } = editor.value
  const tr = state.tr.delete(pos, pos + 1)
  editor.value.view.dispatch(tr)
  showImageMenu.value = false
  selectedImageNode.value = null
}

async function handleImageUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    useNotify({ message: 'Vui lòng chọn file hình ảnh', type: 'error' })
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    useNotify({ message: 'Hình ảnh không được vượt quá 5MB', type: 'error' })
    return
  }
  previewImage.value = URL.createObjectURL(file)
}

function insertUploadedImage() {
  if (!previewImage.value || !editor.value) return
  const file = imageInput.value?.files?.[0]
  if (!file) return
  const tempId = generateTempId()
  temporaryImages.value.push({ tempId, file, objectUrl: previewImage.value })
  editor.value.chain().focus().setImage({ src: previewImage.value, align: 'center', width: '100%', isUploaded: false, tempId }).run()
  previewImage.value = ''
  if (imageInput.value) imageInput.value.value = ''
  showImagePopup.value = false
  imageTab.value = 'upload'
}

function insertImageFromUrl() {
  if (!imageUrl.value || !editor.value) return
  let url = imageUrl.value.trim()
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    useNotify({ message: 'Link phải bắt đầu bằng http:// hoặc https://', type: 'error' })
    return
  }
  editor.value.chain().focus().setImage({ src: url, align: 'center', width: '100%', isUploaded: false, tempId: null }).run()
  imageUrl.value = ''
  showImagePopup.value = false
  imageTab.value = 'upload'
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.rich-text-editor')) {
    showImagePopup.value = false
  }
}

function resetTemporaryImages() {
  temporaryImages.value.forEach((img) => URL.revokeObjectURL(img.objectUrl))
  temporaryImages.value = []
}

defineExpose({ getTemporaryImages: () => temporaryImages.value, resetTemporaryImages })

watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value) return
    const currentHtml = editor.value.getHTML()
    const normalizedValue = value || ''
    const normalizedCurrent = currentHtml === '<p></p>' ? '' : currentHtml
    if (normalizedCurrent !== normalizedValue) {
      editor.value.commands.setContent(normalizedValue || '<p></p>')
    }
  },
)

watch(
  () => props.readonly,
  (readonly) => {
    editor.value?.setEditable(!readonly)
  },
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  nextTick(() => {
    const editorContent = document.querySelector('.editor-content')
    if (editorContent) {
      editorContent.addEventListener('click', onEditorClick)
    }
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  const editorContent = document.querySelector('.editor-content')
  if (editorContent) {
    editorContent.removeEventListener('click', onEditorClick)
  }
  resetTemporaryImages()
  editor.value?.destroy()
})
</script>

<style scoped>
:deep(.ProseMirror) { outline: none; }
:deep(.ProseMirror p.is-editor-empty:first-child::before) { color: #9ca3af; content: attr(data-placeholder); float: left; height: 0; pointer-events: none; }
:deep(.ProseMirror-focused) { outline: none; }
:deep(.ProseMirror ul), :deep(.ProseMirror ol) { padding-left: 1.5rem; margin: 1rem 0; }
:deep(.ProseMirror h1), :deep(.ProseMirror h2), :deep(.ProseMirror h3) { font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; }
:deep(.ProseMirror h1) { font-size: 1.875rem; }
:deep(.ProseMirror h2) { font-size: 1.5rem; }
:deep(.ProseMirror h3) { font-size: 1.25rem; }
:deep(.ProseMirror blockquote) { border-left: 4px solid #d1d5db; padding-left: 1rem; margin: 1rem 0; font-style: italic; color: #6b7280; }
:deep(.ProseMirror code) { background-color: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875em; }
:deep(.ProseMirror pre) { background-color: #1f2937; color: #f9fafb; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
:deep(.ProseMirror pre code) { background-color: transparent; color: inherit; padding: 0; }
:deep(.ProseMirror img) { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0; display: block; cursor: pointer; }
:deep(.ProseMirror img:hover) { opacity: 0.9; }
:deep(.ProseMirror .image-align-left) { display: block; margin-left: 0; margin-right: auto; }
:deep(.ProseMirror .image-align-center) { display: block; margin-left: auto; margin-right: auto; }
:deep(.ProseMirror .image-align-right) { display: block; margin-left: auto; margin-right: 0; }
:deep(.ProseMirror::after) { content: ''; display: table; clear: both; }
</style>
