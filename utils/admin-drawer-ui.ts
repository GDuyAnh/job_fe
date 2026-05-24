/** Menu USelect portal ra body — phải cao hơn drawer (z-200) và backdrop (z-10) */
export const adminDrawerSelectContentZ = 'z-[9999]'

/** USelect / USelectMenu — ô chọn trong drawer admin */
export const adminJobDrawerCompanySelectControlUi = {
  base: 'employer-field-control min-h-[44px] h-[44px] w-full rounded-[12px] justify-start text-start ps-3.5 pe-9 py-0',
  trailingIcon: 'hidden !size-0 shrink-0 opacity-0 pointer-events-none',
  content: adminDrawerSelectContentZ,
}

export const adminJobDrawerCompanySelectMenuUi = {
  ...adminJobDrawerCompanySelectControlUi,
  placeholder: 'truncate text-dimmed text-start flex-1 min-w-0 w-full',
  value: 'truncate text-start flex-1 min-w-0 w-full',
}

/** UI slots chung cho UDrawer admin (overlay blur + full height). */
export function adminDrawerUi(contentMaxWidth = 'max-w-4xl', extraContentClass = '') {
  const contentExtra = extraContentClass ? ` ${extraContentClass}` : ''
  return {
    overlay: 'employer-admin-drawer-overlay',
    handle: 'employer-admin-drawer-handle',
    content: `w-full min-w-[400px] ${contentMaxWidth} ui-drawer-scale-80 employer-admin-drawer-panel employer-drawer-bg${contentExtra}`,
    container:
      'employer-drawer-bg w-full min-h-0 flex flex-1 flex-col gap-0 self-stretch p-0 overflow-hidden',
    body: 'employer-drawer-bg flex min-h-0 flex-1 flex-col overflow-hidden p-0',
  }
}

/** Drawer form job — modal=false + backdrop riêng; scale 0.9 đồng bộ dashboard admin. */
export function adminJobFormDrawerUi(contentMaxWidth = 'max-w-4xl', extraContentClass = 'employer-admin-job-drawer') {
  const contentExtra = extraContentClass ? ` ${extraContentClass}` : ''

  return {
    overlay: 'employer-admin-drawer-overlay',
    handle: 'employer-admin-drawer-handle',
    content: `z-[200] w-full min-w-[400px] ${contentMaxWidth} ui-drawer-scale-80 employer-admin-drawer-panel employer-drawer-bg${contentExtra}`,
    header: 'employer-admin-job-drawer-header employer-drawer-bg shrink-0 p-0',
    container:
      'employer-admin-job-drawer-container employer-drawer-bg w-full min-h-0 flex flex-1 flex-col gap-0 self-stretch p-0 overflow-hidden',
    body: 'employer-admin-job-drawer-body employer-drawer-bg flex min-h-0 flex-1 flex-col overflow-hidden p-0',
  }
}
