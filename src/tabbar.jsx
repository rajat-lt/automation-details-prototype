// Tab reordering (v2 item 1), composed around LTUnderlineNav. Nothing in the
// library supports drag and drop, and drag alone is not keyboard accessible
// (guidelines/README.md §10), so every move a drag makes is also in the tab's
// own menu: right-click, Shift + F10 or the menu key opens Move left, Move
// right and Reset tab order. That is the answer design-context already gives
// for reordering (patterns/module-details.md, open question 3: "move up /
// move down in the step's own menu"). The order is remembered per browser.
//
// v4 item 8: the media tabs (the video and popped-out payloads) reorder the
// same way, so the drag and the menu live in one hook, useReorder.
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronDown, RotateCcw, X } from 'lucide-react'
import { LTButton, LTIconButton, StatusGlyph, TruncText, announce, cx } from './lt.jsx'
import { LTActionMenu, LTUnderlineNav } from './overlays.jsx'
import { fmtTime } from './format.js'

const GAP = 8 // the nav's gap between tabs: var(--space-2)
const moved = (order, from, to) => { const o = [...order]; o.splice(to, 0, o.splice(from, 1)[0]); return o }

/**
 * Drag to reorder, plus the tab's own menu. Each tab is an element with
 * data-tab; `tabSel(id)` finds the focusable part of a tab, which keeps
 * keyboard focus wherever the tab lands.
 */
function useReorder({ order, setOrder, label, tabSel }) {
  const wrapRef = useRef(null)
  const drag = useRef(null)
  const suppressClick = useRef(false)
  const refocus = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [menu, setMenu] = useState(null) // { id, x, y }

  const commit = (from, to, id) => {
    if (from === to) return
    setOrder(moved(order, from, to))
    refocus.current = id
    announce(`${label(id)} moved to position ${to + 1} of ${order.length}`)
  }
  // A moved tab keeps keyboard focus wherever it lands.
  useEffect(() => {
    const id = refocus.current
    if (!id) return
    refocus.current = null
    if (wrapRef.current?.contains(document.activeElement) || document.activeElement === document.body) {
      wrapRef.current?.querySelector(tabSel(id))?.focus()
    }
  }, [order])

  const clear = () => {
    drag.current?.lis.forEach(li => { li.style.transform = ''; li.classList.remove('is-dragged') })
    drag.current = null
    setDragging(false)
  }
  const onPointerDown = e => {
    if (e.button !== 0 || e.pointerType === 'touch') return
    const li = e.target.closest('[data-tab]')
    if (!li) return
    const lis = [...wrapRef.current.querySelectorAll('[data-tab]')]
    drag.current = { id: li.dataset.tab, x0: e.clientX, started: false, lis, rects: lis.map(l => l.getBoundingClientRect()),
      from: lis.indexOf(li), to: lis.indexOf(li), pointerId: e.pointerId }
  }
  const onPointerMove = e => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x0
    if (!d.started) {
      if (Math.abs(dx) < 4) return
      d.started = true
      setDragging(true)
      try { wrapRef.current.setPointerCapture(d.pointerId) } catch { /* pointer already gone */ }
      d.lis[d.from].classList.add('is-dragged')
    }
    const r = d.rects[d.from]
    const centre = r.left + r.width / 2 + dx
    // The drop slot is how many other tabs sit left of the dragged one's centre.
    d.to = d.rects.filter((rr, i) => i !== d.from && rr.left + rr.width / 2 < centre).length
    const shift = r.width + GAP
    d.lis.forEach((li, i) => {
      if (i === d.from) li.style.transform = `translateX(${dx}px)`
      else if (d.from < d.to && i > d.from && i <= d.to) li.style.transform = `translateX(${-shift}px)`
      else if (d.to < d.from && i >= d.to && i < d.from) li.style.transform = `translateX(${shift}px)`
      else li.style.transform = ''
    })
  }
  // The click that ends a drag must not open the tab. It fires right after
  // pointerup, so the flag only lives until the next task.
  const swallowNextClick = () => {
    suppressClick.current = true
    setTimeout(() => { suppressClick.current = false }, 0)
  }
  // The drop slot counts the shown tabs only; the move is made in the whole
  // order, before the tab now at that slot or after the last one, so tabs
  // folded into a More menu (v4 item 8) keep their places.
  const onPointerUp = () => {
    const d = drag.current
    if (!d) return
    if (d.started) {
      swallowNextClick()
      const from = order.indexOf(d.id)
      const others = d.lis.filter((_, i) => i !== d.from).map(li => li.dataset.tab)
      let to = from
      if (d.to < others.length) { const t = order.indexOf(others[d.to]); to = from < t ? t - 1 : t }
      else if (others.length) { const l = order.indexOf(others[others.length - 1]); to = from < l ? l : l + 1 }
      commit(from, to, d.id)
    }
    clear()
  }
  useEffect(() => {
    if (!dragging) return
    // Esc puts the tabs back; the click that ends the held press opens nothing.
    const onKey = e => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      document.addEventListener('pointerup', swallowNextClick, { once: true, capture: true })
      clear()
      announce('Tab move canceled')
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [dragging])

  const openMenu = (id, x, y) => setMenu({ id, x, y })
  const onKeyDown = e => {
    if ((e.key === 'F10' && e.shiftKey) || e.key === 'ContextMenu') {
      e.preventDefault()
      const li = e.currentTarget.closest('[data-tab]')
      const r = li.getBoundingClientRect()
      openMenu(li.dataset.tab, r.left, r.bottom)
    }
  }
  const moveBy = (id, step) => {
    const from = order.indexOf(id)
    const to = Math.min(order.length - 1, Math.max(0, from + step))
    commit(from, to, id)
  }
  const closeMenu = () => {
    const id = menu.id
    setMenu(null)
    wrapRef.current?.querySelector(tabSel(id))?.focus()
  }
  // Unavailable moves stay in the menu, inactive, saying why
  // (guidelines/ltactionmenu.md).
  const moveOptions = id => {
    const i = order.indexOf(id)
    return [
      { value: 'left', label: 'Move left', icon: ArrowLeft, inactive: i === 0, description: i === 0 ? 'Already the first tab' : undefined },
      { value: 'right', label: 'Move right', icon: ArrowRight, inactive: i === order.length - 1,
        description: i === order.length - 1 ? 'Already the last tab' : undefined },
    ]
  }
  const wrapProps = {
    ref: wrapRef, onPointerDown, onPointerMove, onPointerUp, onPointerCancel: clear,
    onClickCapture: e => { if (suppressClick.current) { suppressClick.current = false; e.preventDefault(); e.stopPropagation() } },
    onContextMenu: e => {
      const li = e.target.closest('[data-tab]')
      if (!li) return
      e.preventDefault()
      openMenu(li.dataset.tab, e.clientX, e.clientY)
    },
  }
  return { wrapRef, wrapProps, dragging, menu, closeMenu, onKeyDown, moveBy, moveOptions, refocus }
}

export function ReorderTabs({ order, setOrder, defaultOrder, navs, current, ariaLabel, trailing }) {
  const label = id => navs.find(n => n.id === id)?.label ?? id
  const isDefault = order.join() === defaultOrder.join()
  const { wrapProps, dragging, menu, closeMenu, onKeyDown, moveBy, moveOptions, refocus } = useReorder({
    order, setOrder, label, tabSel: id => `li[data-tab="${id}"] a`,
  })

  return (
    <div {...wrapProps} className={cx('tabbar', dragging && 'is-dragging')}>
      <LTUnderlineNav ariaLabel={ariaLabel} current={current} navs={navs} trailing={trailing} onKeyDown={onKeyDown} />
      {menu && (
        <LTActionMenu open align="start" width={232} ariaLabel={`Move ${label(menu.id)}`}
          onMenuToggle={o => { if (!o) closeMenu() }}
          customAnchor={<span className="ctx-anchor" style={{ left: menu.x, top: menu.y }} />}
          onSelect={o => {
            if (o.value === 'left') moveBy(menu.id, -1)
            if (o.value === 'right') moveBy(menu.id, 1)
            if (o.value === 'reset') { setOrder(defaultOrder); refocus.current = menu.id; announce('Tabs back in the default order') }
          }}
          options={[
            ...moveOptions(menu.id),
            { divider: true },
            { value: 'reset', label: 'Reset tab order', icon: RotateCcw, inactive: isDefault,
              description: isDefault ? 'Already in the default order' : undefined },
          ]} />
      )}
    </div>
  )
}

/* ---------- media tabs (v4 item 8) ----------
   The video and the failed commands' payloads popped out of the list, as
   tabs styled like the page's tab bar (8.2; conflict C34: the guidelines
   give a second level of tabs LTTabNav, below the first). They switch
   panels in place and have no URLs, so they are a tablist, not navigation:
   one tab stop, Left and Right move between tabs, Enter or Space opens one
   (manual activation, since leaving the video pauses it), and Delete closes
   a payload tab. Each tab reorders like the page's tabs: drag it, or use its
   menu (Move left, Move right, and Close tab on a payload). The video tab
   cannot close, only float or collapse, from its own bar (8.3).

   Six tabs outgrow a narrow pane. Tabs never scroll sideways: the ones that
   do not fit fold into More ▾ at the end of the row (ltunderlinenav.md; the
   base pattern's own tab bar ends the same way), and the open tab always
   stays in the row. */
function TabLabel({ cmd, n }) {
  return (
    <>
      {cmd && <StatusGlyph status="failed" bare size={14} />}
      {/* The open tab is bold, as on the page's tab bar. A hidden bold copy
          holds the width, so opening a tab moves none of the others; a long
          name still ends in an ellipsis. */}
      <span className="mtab__name">
        <span className="mtab__ghost" aria-hidden="true">{cmd ? cmd.name : 'Video'}</span>
        {cmd ? <TruncText className="mtab__text" text={cmd.name} /> : <span className="mtab__text">Video</span>}
      </span>
      {cmd && <span className="mtab__time">{`${fmtTime(cmd.at)}${n ? ` (${n})` : ''}`}</span>}
    </>
  )
}

export function MediaTabs({ order, setOrder, active, onActivate, onClose, byId }) {
  // Retries in the same second read alike (Find Element at 1:16, twice): the
  // later ones get (2), (3) by run order, so a label never changes when the
  // tabs move.
  const nth = useMemo(() => {
    const seen = new Map(), out = new Map()
    order.filter(id => id !== 'video').map(id => byId.get(id)).sort((a, b) => a.idx - b.idx).forEach(c => {
      const k = `${c.name}|${fmtTime(c.at)}`
      const n = (seen.get(k) ?? 0) + 1
      seen.set(k, n)
      if (n > 1) out.set(c.id, n)
    })
    return out
  }, [order, byId])
  const label = id => (id === 'video' ? 'Video'
    : `${byId.get(id).name} at ${fmtTime(byId.get(id).at)}${nth.get(id) ? ` (${nth.get(id)})` : ''}`)
  const tabSel = id => `[data-tab="${id}"] [role="tab"]`
  const [folded, setFolded] = useState([]) // ids in More
  const shown = order.filter(id => !folded.includes(id))
  const { wrapRef, wrapProps, dragging, menu, closeMenu, onKeyDown, moveBy, moveOptions } = useReorder({
    order, setOrder, label, tabSel,
  })
  const focusTab = id => wrapRef.current?.querySelector(tabSel(id))?.focus()
  const onTabKey = (e, id) => {
    onKeyDown(e)
    if (e.defaultPrevented) return
    const i = shown.indexOf(id)
    const to = { ArrowLeft: shown[(i - 1 + shown.length) % shown.length], ArrowRight: shown[(i + 1) % shown.length],
      Home: shown[0], End: shown[shown.length - 1] }[e.key]
    if (to) { e.preventDefault(); focusTab(to); return }
    if (e.key === 'Delete' && id !== 'video') { e.preventDefault(); onClose(id, { keyboard: true }) }
  }

  /* Which tabs fit: every tab's own width comes from a hidden copy of the
     row, so the answer never depends on what is folded now. In order, as
     many as fit beside More ▾; if the open tab is not among them, tabs come
     off the end until it fits. Measured on every render and resize. */
  const measureRef = useRef(null)
  const fit = () => {
    const bar = wrapRef.current, meas = measureRef.current
    if (!bar || !meas) return
    const cs = getComputedStyle(bar)
    const room0 = bar.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
    const w = {}
    meas.querySelectorAll('[data-measure]').forEach(el => { w[el.dataset.measure] = el.offsetWidth })
    const total = order.reduce((sum, id, i) => sum + w[id] + (i ? GAP : 0), 0)
    let next = []
    if (total > room0) {
      const room = room0 - w.more - GAP
      const fits = []
      let used = 0
      for (const id of order) {
        const need = w[id] + (fits.length ? GAP : 0)
        if (used + need > room) break
        fits.push(id)
        used += need
      }
      if (!fits.includes(active)) {
        while (fits.length && used + GAP + w[active] > room) {
          const out = fits.pop()
          used -= w[out] + (fits.length ? GAP : 0)
        }
        fits.push(active)
      }
      next = order.filter(id => !fits.includes(id))
    }
    setFolded(f => (f.join() === next.join() ? f : next))
  }
  const fitRef = useRef(fit)
  fitRef.current = fit
  useLayoutEffect(fit)
  useLayoutEffect(() => {
    const ro = new ResizeObserver(() => fitRef.current())
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div {...wrapProps} className={cx('mtabs', dragging && 'is-dragging')}>
      <div role="tablist" aria-label="Video and payloads" className="mtabs__list">
        {shown.map(id => {
          const cmd = id === 'video' ? null : byId.get(id)
          const on = id === active
          return (
            <div key={id} data-tab={id} className={cx('mtab', on && 'is-current', cmd && 'has-close')}>
              <button type="button" role="tab" id={`mtab-${id}`} aria-selected={on} aria-controls={`mpanel-${id}`}
                aria-label={cmd ? `${label(id)}, failed` : undefined}
                tabIndex={on ? 0 : -1} className="mtab__btn" data-focus={`mtab-${id}`}
                onClick={() => onActivate(id)} onKeyDown={e => onTabKey(e, id)}>
                <TabLabel cmd={cmd} n={nth.get(id)} />
              </button>
              {/* A mouse twin of Delete and the menu's Close tab, out of the
                  tab order so the tablist stays one stop. */}
              {cmd && (
                <LTIconButton icon={X} ariaLabel={`Close ${label(id)} tab`} variant="invisible" size="xsmall"
                  tooltipDirection="s" tabIndex={-1} className="mtab__close" onClick={() => onClose(id)} />
              )}
            </div>
          )
        })}
      </div>
      {folded.length > 0 && (
        <LTActionMenu ariaLabel="More tabs" width={240}
          customAnchor={<LTButton variant="invisible" size="small" label="More" trailingIcon={ChevronDown}
            ariaLabel={`More tabs, ${folded.length}`} className="mtabs__more" />}
          onSelect={o => { onActivate(o.value); setTimeout(() => focusTab(o.value), 0) }}
          options={folded.map(id => ({ value: id, label: label(id) }))} />
      )}
      {/* The row's natural widths, for the fit above; never seen or read. */}
      <div ref={measureRef} className="mtabs__measure" aria-hidden="true">
        {order.map(id => (
          <div key={id} data-measure={id} className={cx('mtab', id !== 'video' && 'has-close')}>
            <span className="mtab__btn"><TabLabel cmd={id === 'video' ? null : byId.get(id)} n={nth.get(id)} /></span>
            {id !== 'video' && <span className="mtab__close-space" />}
          </div>
        ))}
        <span data-measure="more" className="lt-btn lt-btn--invisible lt-btn--small mtabs__more">
          <span className="lt-btn__label">More</span>
          <ChevronDown size={16} aria-hidden="true" className="lt-btn__icon lt-btn__icon--trail" />
        </span>
      </div>
      {menu && (
        <LTActionMenu open align="start" width={232} ariaLabel={`Actions for ${label(menu.id)}`}
          onMenuToggle={o => { if (!o) closeMenu() }}
          customAnchor={<span className="ctx-anchor" style={{ left: menu.x, top: menu.y }} />}
          onSelect={o => {
            if (o.value === 'left') moveBy(menu.id, -1)
            if (o.value === 'right') moveBy(menu.id, 1)
            if (o.value === 'close') onClose(menu.id, { keyboard: true })
          }}
          options={[
            ...moveOptions(menu.id),
            ...(menu.id === 'video' ? [] : [{ divider: true }, { value: 'close', label: 'Close tab', icon: X }]),
          ]} />
      )}
    </div>
  )
}
