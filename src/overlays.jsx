// Menus, tabs, segmented controls, dialogs, the drawer, toasts and the inline
// text input. Same rules as lt.jsx: real component names, documented props,
// token styling, and the matching guidelines/ file for behaviour.
import React, { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, X, CircleCheck, CircleAlert, Info } from 'lucide-react'
import { cx, placeFloating, LTTooltip, LTIconButton, LTButton } from './lt.jsx'

/* ---------- LTActionMenu ----------
   Quick actions or one selection (selectionVariant="single"). Every item has
   an icon or none does; the trailing slot holds shortcuts only; danger items
   use the danger treatment (guidelines/ltactionmenu.md). Keyboard: arrows,
   Home, End, Enter, Space, Esc, Tab. */
export function LTActionMenu({ anchor, options, onSelect, selectionVariant = '', selectedValue, width = 240,
  align = 'end', ariaLabel, open: controlledOpen, onMenuToggle }) {
  const [openState, setOpenState] = useState(false)
  const open = controlledOpen ?? openState
  const setOpen = v => { setOpenState(v); onMenuToggle?.(v) }
  const [pos, setPos] = useState(null)
  const anchorRef = useRef(null)
  const menuRef = useRef(null)
  const itemsRef = useRef([])
  const id = useId()
  const items = options.filter(o => !o.divider)

  useLayoutEffect(() => {
    if (!open || !menuRef.current || !anchorRef.current) return
    const update = () => setPos(placeFloating(anchorRef.current, menuRef.current, { side: 'bottom', align, offset: 4 }))
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true) }
  }, [open, align])

  useEffect(() => {
    if (!open) return
    const sel = selectionVariant === 'single' ? items.findIndex(o => o.value === selectedValue) : 0
    requestAnimationFrame(() => itemsRef.current[Math.max(0, sel)]?.focus())
    const onDown = e => {
      if (!menuRef.current?.contains(e.target) && !anchorRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const close = (refocus = true) => { setOpen(false); if (refocus) anchorRef.current?.focus() }
  const choose = o => { close(); onSelect?.(o) }
  const onKeyDown = e => {
    const list = itemsRef.current.filter(Boolean)
    const i = list.indexOf(document.activeElement)
    if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length]?.focus() }
    else if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length]?.focus() }
    else if (e.key === 'Home') { e.preventDefault(); list[0]?.focus() }
    else if (e.key === 'End') { e.preventDefault(); list[list.length - 1]?.focus() }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close() }
    else if (e.key === 'Tab') close(false)
  }

  const trigger = React.cloneElement(anchor, {
    ref: anchorRef,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? id : undefined,
    onClick: () => setOpen(!open),
    onKeyDown: e => { if (e.key === 'ArrowDown' && !open) { e.preventDefault(); setOpen(true) } },
  })

  let n = -1
  return (
    <>
      {trigger}
      {open && createPortal(
        <div ref={menuRef} id={id} role="menu" aria-label={ariaLabel} className="lt-menu"
          style={{ width, top: pos?.top ?? -9999, left: pos?.left ?? -9999 }} onKeyDown={onKeyDown}>
          {options.map((o, k) => {
            if (o.divider) return <div key={`d${k}`} role="separator" className="lt-menu__divider" />
            n += 1
            const idx = n
            const checked = selectionVariant === 'single' ? o.value === selectedValue : undefined
            const Icon = o.icon
            return (
              <button key={o.value ?? o.label} type="button" tabIndex={-1}
                ref={el => { itemsRef.current[idx] = el }}
                role={selectionVariant === 'single' ? 'menuitemradio' : 'menuitem'}
                aria-checked={checked}
                aria-keyshortcuts={o.keyshortcuts}
                className={cx('lt-menu__item', o.variant === 'danger' && 'is-danger')}
                onClick={() => choose(o)}>
                {selectionVariant === 'single'
                  ? <span className="lt-menu__check" aria-hidden="true">{checked && <Check size={16} />}</span>
                  : Icon && <Icon size={16} aria-hidden="true" className="lt-menu__icon" />}
                <span className="lt-menu__label">{o.label}</span>
                {o.trailing && <span className="lt-menu__trail" aria-hidden="true">{o.trailing}</span>}
              </button>
            )
          })}
        </div>, document.body)}
    </>
  )
}

/* ---------- LTSegmentedControl ----------
   Treated as a set of buttons, no role (guidelines/ltsegmentedcontrol.md);
   icon-only segments always carry a tooltip. */
export function LTSegmentedControl({ options, selectedValue, onChange, ariaLabel, isIconButton = false, variant = 'medium', className }) {
  return (
    <div role="group" aria-label={ariaLabel} className={cx('lt-seg', `lt-seg--${variant}`, isIconButton && 'lt-seg--icons', className)}>
      {options.map(o => {
        const on = o.value === selectedValue
        const btn = (
          <button key={o.value} type="button" aria-pressed={on} aria-label={isIconButton ? o.label : undefined}
            className={cx('lt-seg__btn', on && 'is-selected')} onClick={() => onChange(o.value)}>
            {isIconButton ? <o.icon size={16} aria-hidden="true" /> : o.label}
          </button>
        )
        return isIconButton ? <LTTooltip key={o.value} text={o.label} direction="bottom">{btn}</LTTooltip> : btn
      })}
    </div>
  )
}

/* ---------- LTUnderlineNav ----------
   The page's main tabs. Each tab has its own URL (guidelines/ltunderlinenav.md);
   the counter counts the rows in the tab (ux-text-guidelines.md §7). */
export function LTUnderlineNav({ navs, current, ariaLabel, trailing }) {
  return (
    <div className="lt-unav">
      <nav aria-label={ariaLabel}>
        <ul>
          {navs.map(t => (
            <li key={t.id}>
              <a href={t.href} aria-current={t.id === current ? 'page' : undefined}
                className={cx('lt-unav__item', t.id === current && 'is-current')}>
                <span className="lt-unav__label" data-text={t.label}>{t.label}</span>
                {t.counter != null && <span className="lt-counter lt-counter--secondary">{t.counter}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {trailing && <div className="lt-unav__trailing">{trailing}</div>}
    </div>
  )
}

/* ---------- focus trap shared by LTModal and LTDrawer ---------- */
function useDialog(isOpen, onClose, ref, initialRef) {
  useEffect(() => {
    if (!isOpen) return
    const prev = document.activeElement
    const focusables = () => [...ref.current.querySelectorAll(
      'button:not([aria-disabled="true"]), [href], input, textarea, select, [tabindex]:not([tabindex="-1"])')]
    requestAnimationFrame(() => (initialRef?.current ?? focusables()[0])?.focus())
    const onKey = e => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
      if (e.key === 'Tab') {
        const f = focusables(); if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); prev?.focus?.() }
  }, [isOpen])
}

/* ---------- LTModal ----------
   Widths 320 / 480 / 640 / 960 through extraStyle (guidelines/ltmodal.md).
   The backdrop closes it unless the body holds unsaved input
   (patterns/modal.md delta 3). */
export function LTModal({ isOpen, title, subTitle, onClose, children, renderFooter, extraStyle, initialRef, keepOnBackdrop = false }) {
  const ref = useRef(null)
  const id = useId()
  useDialog(isOpen, onClose, ref, initialRef)
  if (!isOpen) return null
  return createPortal(
    <div className="lt-backdrop" onMouseDown={e => { if (e.target === e.currentTarget && !keepOnBackdrop) onClose() }}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={`${id}-t`} className="lt-modal" style={extraStyle}>
        <div className="lt-modal__head">
          <div>
            <h2 id={`${id}-t`} className="lt-modal__title">{title}</h2>
            {subTitle && <p className="lt-modal__sub">{subTitle}</p>}
          </div>
          <LTIconButton icon={X} ariaLabel="Close" variant="invisible" onClick={onClose} />
        </div>
        <div className="lt-modal__body">{children}</div>
        {renderFooter && <div className="lt-modal__foot">{renderFooter()}</div>}
      </div>
    </div>, document.body)
}

/* ---------- LTDrawer ---------- right side only (guidelines/ltmodal.md) */
export function LTDrawer({ isOpen, title, subTitle, onClose, width = 480, children }) {
  const ref = useRef(null)
  const id = useId()
  useDialog(isOpen, onClose, ref)
  if (!isOpen) return null
  return createPortal(
    <div className="lt-backdrop lt-backdrop--drawer" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={`${id}-t`} className="lt-drawer" style={{ width }}>
        <div className="lt-modal__head">
          <div>
            <h2 id={`${id}-t`} className="lt-modal__title">{title}</h2>
            {subTitle && <p className="lt-modal__sub">{subTitle}</p>}
          </div>
          <LTIconButton icon={X} ariaLabel="Close" variant="invisible" onClick={onClose} />
        </div>
        <div className="lt-drawer__body">{children}</div>
      </div>
    </div>, document.body)
}

/* ---------- LTToast ---------- top right, 4 seconds (guidelines/README.md §7) */
const ToastCtx = createContext(() => {})
export const useToast = () => useContext(ToastCtx)
export function ToastProvider({ children }) {
  const [list, setList] = useState([])
  const push = useCallback((text, variant = 'default') => {
    const id = Math.random().toString(36).slice(2)
    setList(l => [...l.slice(-2), { id, text, variant }])
    setTimeout(() => setList(l => l.filter(t => t.id !== id)), 4000)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      {createPortal(
        <div className="lt-toasts" role="status" aria-live="polite">
          {list.map(t => {
            const Icon = t.variant === 'success' ? CircleCheck : t.variant === 'danger' ? CircleAlert : Info
            return (
              <div key={t.id} className={cx('lt-toast', `lt-toast--${t.variant}`)}>
                <Icon size={16} aria-hidden="true" className="lt-toast__icon" />
                <span>{t.text}</span>
                <button type="button" className="lt-toast__close" aria-label="Dismiss"
                  onClick={() => setList(l => l.filter(x => x.id !== t.id))}><X size={14} aria-hidden="true" /></button>
              </div>
            )
          })}
        </div>, document.body)}
    </ToastCtx.Provider>
  )
}

/* ---------- LTInlineTextInput ----------
   An input that reads as text until hovered (border) or focused (border and
   ring). Enter or blur saves, Esc restores, an empty value is refused with a
   field error that leads with the fix. showEditTooltip is off here:
   guidelines/lttooltip.md bars tooltips on form fields, and the brief's
   screenshot 2 shows none. */
export function LTInlineTextInput({ value, onCommit, ariaLabel, size = 'medium', className, maxLength = 255,
  validationMessage = 'Enter a value.', loading = false, onHoverChange }) {
  const [draft, setDraft] = useState(value)
  const [error, setError] = useState(false)
  const [width, setWidth] = useState(0)
  const inputRef = useRef(null)
  const sizerRef = useRef(null)
  const cancelled = useRef(false)
  const msgId = useId()
  useEffect(() => { setDraft(value); setError(false) }, [value])
  useLayoutEffect(() => { if (sizerRef.current) setWidth(sizerRef.current.offsetWidth) }, [draft])

  const commit = () => {
    if (cancelled.current) { cancelled.current = false; return }
    const v = draft.trim()
    if (!v) { setError(true); requestAnimationFrame(() => inputRef.current?.focus()); return }
    setError(false)
    if (v !== value) onCommit(v)
    else setDraft(value)
  }
  return (
    <span className={cx('lt-inline', `lt-inline--${size}`, error && 'is-error', loading && 'is-loading', className)}
      onMouseEnter={() => onHoverChange?.(true)} onMouseLeave={() => onHoverChange?.(false)}>
      <span ref={sizerRef} className="lt-inline__sizer" aria-hidden="true">{draft || ' '}</span>
      <input ref={inputRef} value={draft} maxLength={maxLength} aria-label={ariaLabel}
        aria-invalid={error || undefined} aria-describedby={error ? msgId : undefined}
        style={{ width: width ? width + 18 : undefined }}
        onFocus={e => e.target.select()}
        onChange={e => { setDraft(e.target.value); if (error && e.target.value.trim()) setError(false) }}
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur() }
          if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cancelled.current = true; setDraft(value); setError(false); e.currentTarget.blur() }
        }}
        onBlur={commit} />
      {error && <span id={msgId} className="lt-inline__error" role="alert">{validationMessage}</span>}
    </span>
  )
}

export { LTButton }
