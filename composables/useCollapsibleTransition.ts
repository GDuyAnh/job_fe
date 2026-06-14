export function useCollapsibleTransition(durationMs = 280) {
  const applyTransition = (el: HTMLElement) => {
    el.style.transition = `height ${durationMs}ms ease, opacity ${Math.max(durationMs - 80, 160)}ms ease`
  }

  const onEnter = (el: Element) => {
    const element = el as HTMLElement
    element.style.height = '0'
    element.style.opacity = '0'
    element.style.overflow = 'hidden'
    void element.offsetHeight
    applyTransition(element)
    element.style.height = `${element.scrollHeight}px`
    element.style.opacity = '1'
  }

  const onAfterEnter = (el: Element) => {
    const element = el as HTMLElement
    element.style.height = ''
    element.style.opacity = ''
    element.style.overflow = ''
    element.style.transition = ''
  }

  const onLeave = (el: Element) => {
    const element = el as HTMLElement
    element.style.height = `${element.scrollHeight}px`
    element.style.opacity = '1'
    element.style.overflow = 'hidden'
    void element.offsetHeight
    applyTransition(element)
    element.style.height = '0'
    element.style.opacity = '0'
  }

  const onAfterLeave = (el: Element) => {
    const element = el as HTMLElement
    element.style.height = ''
    element.style.opacity = ''
    element.style.overflow = ''
    element.style.transition = ''
  }

  return {
    onEnter,
    onAfterEnter,
    onLeave,
    onAfterLeave,
  }
}
