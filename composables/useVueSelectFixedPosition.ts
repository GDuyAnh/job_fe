function getToggleEl(component: { $el?: HTMLElement } | null | undefined): HTMLElement | null {
  if (!component?.$el) return null
  return component.$el.querySelector?.('.vs__dropdown-toggle') ?? component.$el
}

function getScrollableAncestors(element: HTMLElement): HTMLElement[] {
  const ancestors: HTMLElement[] = []
  let node = element.parentElement

  while (node) {
    const { overflowY } = window.getComputedStyle(node)
    if (
      (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay')
      && node.scrollHeight > node.clientHeight + 1
    ) {
      ancestors.push(node)
    }
    node = node.parentElement
  }

  return ancestors
}

/**
 * vue-select append-to-body dùng position:absolute + scrollY — lệch trên Safari khi
 * ancestor có transform (drawer scale 0.9). Dùng position:fixed + getBoundingClientRect.
 */
export function useVueSelectFixedPosition(options?: { zIndex?: number }) {
  const zIndex = options?.zIndex ?? 9999

  const calculatePosition = (
    dropdownList: HTMLElement,
    component: { $el?: HTMLElement } | null | undefined,
  ) => {
    const update = () => {
      const toggleEl = getToggleEl(component)
      if (!toggleEl) return

      const rect = toggleEl.getBoundingClientRect()

      dropdownList.style.position = 'fixed'
      dropdownList.style.top = `${rect.bottom}px`
      dropdownList.style.left = `${rect.left}px`
      dropdownList.style.width = `${rect.width}px`
      dropdownList.style.right = 'auto'
      dropdownList.style.bottom = 'auto'
      dropdownList.style.zIndex = String(zIndex)
    }

    const scheduleUpdate = () => {
      requestAnimationFrame(update)
    }

    scheduleUpdate()
    requestAnimationFrame(scheduleUpdate)

    const toggleEl = getToggleEl(component)
    const scrollTargets = new Set<EventTarget>([window])
    if (toggleEl) {
      for (const ancestor of getScrollableAncestors(toggleEl)) {
        scrollTargets.add(ancestor)
      }
    }

    const onScroll = () => scheduleUpdate()
    const onResize = () => scheduleUpdate()

    for (const target of scrollTargets) {
      target.addEventListener('scroll', onScroll, { capture: true, passive: true })
    }
    window.addEventListener('resize', onResize, { passive: true })

    const visualViewport = window.visualViewport
    visualViewport?.addEventListener('resize', onResize)
    visualViewport?.addEventListener('scroll', onScroll)

    return () => {
      for (const target of scrollTargets) {
        target.removeEventListener('scroll', onScroll, true)
      }
      window.removeEventListener('resize', onResize)
      visualViewport?.removeEventListener('resize', onResize)
      visualViewport?.removeEventListener('scroll', onScroll)
    }
  }

  return { calculatePosition }
}
