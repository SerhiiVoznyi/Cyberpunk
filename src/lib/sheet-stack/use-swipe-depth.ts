import { type RefObject, useEffect, useRef } from 'react'

const DISTANCE = 50
// A swipe must be clearly sideways, so a vertical scroll that drifts never flips the sheet.
const DOMINANCE = 1.5
const CLICK_GRACE_MS = 400

/** A sideways touch swipe across the stack moves one sheet through it, left for the next. */
export const useSwipeDepth = (
  ref: RefObject<HTMLElement | null>,
  advance: (step: 1 | -1) => void,
  enabled: boolean,
) => {
  // `advance` changes with every promotion; re-binding mid-gesture would drop the click guard.
  const advanceRef = useRef(advance)
  useEffect(() => {
    advanceRef.current = advance
  }, [advance])

  useEffect(() => {
    const node = ref.current
    if (!node || !enabled) return

    let pointer: number | null = null
    let startX = 0
    let startY = 0
    let fired = false
    let suppressUntil = 0

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'touch' || pointer !== null) return
      pointer = event.pointerId
      startX = event.clientX
      startY = event.clientY
      fired = false
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerId !== pointer || fired) return
      const dx = event.clientX - startX
      const dy = event.clientY - startY
      if (Math.abs(dx) < DISTANCE || Math.abs(dx) < Math.abs(dy) * DOMINANCE) return
      fired = true
      suppressUntil = performance.now() + CLICK_GRACE_MS
      advanceRef.current(dx < 0 ? 1 : -1)
    }

    const onEnd = (event: PointerEvent) => {
      if (event.pointerId === pointer) pointer = null
    }

    // The lifted finger still lands a click on whatever spine the swipe ended over.
    const onClick = (event: MouseEvent) => {
      if (performance.now() > suppressUntil) return
      suppressUntil = 0
      event.preventDefault()
      event.stopPropagation()
    }

    node.addEventListener('pointerdown', onDown, { passive: true })
    node.addEventListener('pointermove', onMove, { passive: true })
    node.addEventListener('pointerup', onEnd)
    node.addEventListener('pointercancel', onEnd)
    node.addEventListener('click', onClick, true)
    return () => {
      node.removeEventListener('pointerdown', onDown)
      node.removeEventListener('pointermove', onMove)
      node.removeEventListener('pointerup', onEnd)
      node.removeEventListener('pointercancel', onEnd)
      node.removeEventListener('click', onClick, true)
    }
  }, [ref, enabled])
}
