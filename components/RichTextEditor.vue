<template>
  <div class="rich-text-editor">
    <div
      v-if="!readonly"
      class="editor-toolbar border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-2"
    >
      <UButton
        variant="ghost"
        size="xs"
        :color="editor?.isActive('bold') ? 'primary' : 'neutral'"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        <UIcon name="i-lucide-bold" class="w-4 h-4" />
      </UButton>
      <UButton
        variant="ghost"
        size="xs"
        :color="editor?.isActive('italic') ? 'primary' : 'neutral'"
        @click="editor?.chain().focus().toggleItalic().run()"
      >
        <UIcon name="i-lucide-italic" class="w-4 h-4" />
      </UButton>
      <UButton
        variant="ghost"
        size="xs"
        :color="editor?.isActive('strike') ? 'primary' : 'neutral'"
        @click="editor?.chain().focus().toggleStrike().run()"
      >
        <UIcon name="i-lucide-strikethrough" class="w-4 h-4" />
      </UButton>
      <div class="border-l border-gray-300 mx-1" />
      <UButton
        variant="ghost"
        size="xs"
        :color="
          editor?.isActive({ heading: { level: 1 } }) ? 'primary' : 'neutral'
        "
        @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        <UIcon name="i-lucide-heading-1" class="w-4 h-4" />
      </UButton>
      <UButton
        variant="ghost"
        size="xs"
        :color="
          editor?.isActive({ heading: { level: 2 } }) ? 'primary' : 'neutral'
        "
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        <UIcon name="i-lucide-heading-2" class="w-4 h-4" />
      </UButton>
      <UButton
        variant="ghost"
        size="xs"
        :color="
          editor?.isActive({ heading: { level: 3 } }) ? 'primary' : 'neutral'
        "
        @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        <UIcon name="i-lucide-heading-3" class="w-4 h-4" />
      </UButton>
      <div class="border-l border-gray-300 mx-1" />
      <UButton
        variant="ghost"
        size="xs"
        :color="editor?.isActive('bulletList') ? 'primary' : 'neutral'"
        @click="editor?.chain().focus().toggleBulletList().run()"
      >
        <UIcon name="i-lucide-list" class="w-4 h-4" />
      </UButton>
      <UButton
        variant="ghost"
        size="xs"
        :color="editor?.isActive('orderedList') ? 'primary' : 'neutral'"
        @click="editor?.chain().focus().toggleOrderedList().run()"
      >
        <UIcon name="i-lucide-list-ordered" class="w-4 h-4" />
      </UButton>
      <div class="border-l border-gray-300 mx-1" />
      <UButton
        variant="ghost"
        size="xs"
        :color="editor?.isActive('blockquote') ? 'primary' : 'neutral'"
        @click="editor?.chain().focus().toggleBlockquote().run()"
      >
        <UIcon name="i-lucide-quote" class="w-4 h-4" />
      </UButton>
      <UButton
        variant="ghost"
        size="xs"
        :color="editor?.isActive('codeBlock') ? 'primary' : 'neutral'"
        @click="editor?.chain().focus().toggleCodeBlock().run()"
      >
        <UIcon name="i-lucide-code" class="w-4 h-4" />
      </UButton>
    </div>
    <div
      class="editor-content border border-gray-300 rounded-b-lg"
      :class="{
        'rounded-t-lg': readonly,
        'bg-gray-50': readonly,
      }"
    >
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

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
}>()

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
  ],
  editable: !props.readonly,
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()

    emit('update:modelValue', html === '<p></p>' ? '' : html)
  },
  editorProps: {
    attributes: {
      class:
        'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 min-h-[200px] max-w-none',
    },
  },
})

watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value) return

    const currentHtml = editor.value.getHTML()
    const normalizedValue = value || ''
    const normalizedCurrent = currentHtml === '<p></p>' ? '' : currentHtml

    if (normalizedCurrent !== normalizedValue) {
      // Prevent infinite loop by checking if content actually changed
      const htmlContent = normalizedValue || '<p></p>'

      editor.value.commands.setContent(htmlContent)
    }
  },
)

watch(
  () => props.readonly,
  (readonly) => {
    editor.value?.setEditable(!readonly)
  },
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
:deep(.ProseMirror) {
  outline: none;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: #9ca3af;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

:deep(.ProseMirror-focused) {
  outline: none;
}

:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

:deep(.ProseMirror h1),
:deep(.ProseMirror h2),
:deep(.ProseMirror h3) {
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

:deep(.ProseMirror h1) {
  font-size: 1.875rem;
}

:deep(.ProseMirror h2) {
  font-size: 1.5rem;
}

:deep(.ProseMirror h3) {
  font-size: 1.25rem;
}

:deep(.ProseMirror blockquote) {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: #6b7280;
}

:deep(.ProseMirror code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

:deep(.ProseMirror pre) {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

:deep(.ProseMirror pre code) {
  background-color: transparent;
  color: inherit;
  padding: 0;
}
</style>

<style>
/* Global styles for rich text content from RichTextEditor to prevent override */
/* These styles automatically apply to HTML rendered via v-html from RichTextEditor */

/* Target all elements that contain HTML content from RichTextEditor */
/* Using universal selector for maximum compatibility */
*[data-rich-text-content] p,
.rich-text-output p {
  margin-top: 0 !important;
  margin-bottom: 0.5rem !important;
  line-height: 1.5 !important;
  color: inherit !important;
}

*[data-rich-text-content] p:first-child,
.rich-text-output p:first-child {
  margin-top: 0 !important;
}

*[data-rich-text-content] p:last-child,
.rich-text-output p:last-child {
  margin-bottom: 0 !important;
}

/* Headings */
*[data-rich-text-content] h1,
.rich-text-output h1 {
  font-size: 1.875rem !important;
  font-weight: 600 !important;
  margin-top: 0.75rem !important;
  margin-bottom: 0.5rem !important;
  line-height: 1.2 !important;
  color: inherit !important;
}

*[data-rich-text-content] h2,
.rich-text-output h2 {
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  margin-top: 0.75rem !important;
  margin-bottom: 0.5rem !important;
  line-height: 1.3 !important;
  color: inherit !important;
}

*[data-rich-text-content] h3,
.rich-text-output h3 {
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  margin-top: 0.75rem !important;
  margin-bottom: 0.5rem !important;
  line-height: 1.4 !important;
  color: inherit !important;
}

/* Lists */
*[data-rich-text-content] ul,
*[data-rich-text-content] ol,
.rich-text-output ul,
.rich-text-output ol {
  margin-top: 0.5rem !important;
  margin-bottom: 0.5rem !important;
  padding-left: 1.5rem !important;
  list-style-position: outside !important;
}

*[data-rich-text-content] ul,
.rich-text-output ul {
  list-style-type: disc !important;
}

*[data-rich-text-content] ol,
.rich-text-output ol {
  list-style-type: decimal !important;
}

*[data-rich-text-content] li,
.rich-text-output li {
  margin-top: 0.25rem !important;
  margin-bottom: 0.25rem !important;
  line-height: 1.5 !important;
}

/* Text formatting */
*[data-rich-text-content] strong,
*[data-rich-text-content] b,
.rich-text-output strong,
.rich-text-output b {
  font-weight: 700 !important;
}

*[data-rich-text-content] em,
*[data-rich-text-content] i,
.rich-text-output em,
.rich-text-output i {
  font-style: italic !important;
}

*[data-rich-text-content] u,
.rich-text-output u {
  text-decoration: underline !important;
}

*[data-rich-text-content] s,
*[data-rich-text-content] strike,
*[data-rich-text-content] del,
.rich-text-output s,
.rich-text-output strike,
.rich-text-output del {
  text-decoration: line-through !important;
}

/* Blockquote */
*[data-rich-text-content] blockquote,
.rich-text-output blockquote {
  border-left: 4px solid #d1d5db !important;
  padding-left: 1rem !important;
  margin: 1rem 0 !important;
  font-style: italic !important;
  color: #6b7280 !important;
}

/* Code */
*[data-rich-text-content] code,
.rich-text-output code {
  background-color: #f3f4f6 !important;
  padding: 0.125rem 0.25rem !important;
  border-radius: 0.25rem !important;
  font-size: 0.875em !important;
  font-family: monospace !important;
}

*[data-rich-text-content] pre,
.rich-text-output pre {
  background-color: #1f2937 !important;
  color: #f9fafb !important;
  padding: 1rem !important;
  border-radius: 0.5rem !important;
  overflow-x: auto !important;
  margin: 1rem 0 !important;
}

*[data-rich-text-content] pre code,
.rich-text-output pre code {
  background-color: transparent !important;
  color: inherit !important;
  padding: 0 !important;
}

/* Links */
*[data-rich-text-content] a,
.rich-text-output a {
  color: #0284c7 !important;
  text-decoration: underline !important;
}
</style>
