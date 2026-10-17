// Look-alikes of the lt-components this page needs. The real library
// (@lambdatestincprivate/lt-components) is private, so each one is hand-built
// here under its real name, with only the props COMPONENTS.md documents, and
// styled from design-context tokens (src/tokens.css). Usage rules follow the
// matching guidelines/<component>.md file.
import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Copy, X, Search, CircleAlert, TriangleAlert } from 'lucide-react'
import { copyText } from './clipboard.js'

export const cx = (...a) => a.filter(Boolean).join(' ')

/* ---------- where overlays mount ----------
   Inside whatever is full screen, or nothing portaled to <body> would show
   while the test details or the video are full screen (a v1 bug, fixed
   17 Oct 2026). */
export const portalRoot = () => document.fullscreenElement ?? document.body
export function usePortalRoot() {
  const [root, setRoot] = useState(portalRoot)
  useEffect(() => {
    const f = () => setRoot(portalRoot())
    document.addEventListener('fullscreenchange', f)
    return () => document.removeEventListener('fullscreenchange', f)
  }, [])
  return root
}

/* ---------- announcements (guidelines/README.md §9, ux-text-guidelines.md §3) ---------- */
let announceFn = () => {}
export const announce = text => announceFn(text)
export function Announcer() {
  const [msg, setMsg] = useState({ text: '', n: 0 })
  useEffect(() => { announceFn = text => setMsg(m => ({ text, n: m.n + 1 })) }, [])
  return <div className="vh" role="status" aria-live="polite" key={msg.n}>{msg.text}</div>
}

/* ---------- positioning for tooltips and menus ---------- */
export function placeFloating(anchor, el, { side = 'bottom', align = 'center', offset = 4, flip = true } = {}) {
  const a = anchor.getBoundingClientRect()
  const w = el.offsetWidth, h = el.offsetHeight
  const vw = window.innerWidth, vh = window.innerHeight
  let s = side
  if (flip && s === 'bottom' && a.bottom + offset + h > vh - 8 && a.top - offset - h > 8) s = 'top'
  else if (flip && s === 'top' && a.top - offset - h < 8 && a.bottom + offset + h < vh - 8) s = 'bottom'
  let top, left
  if (s === 'top' || s === 'bottom') {
    top = s === 'bottom' ? a.bottom + offset : a.top - offset - h
    left = align === 'start' ? a.left : align === 'end' ? a.right - w : a.left + a.width / 2 - w / 2
  } else {
    left = s === 'right' ? a.right + offset : a.left - offset - w
    top = a.top + a.height / 2 - h / 2
  }
  left = Math.min(Math.max(8, left), vw - w - 8)
  top = Math.min(Math.max(8, top), vh - h - 8)
  return { top, left, side: s }
}

/* ---------- LTTooltip ----------
   Its primary job is naming LTIconButtons (guidelines/lttooltip.md). It wraps
   one child, opens after delayDuration (400) on hover and at once on keyboard
   focus, closes on Esc, blur and leave, and stays open while the pointer is
   over it. `type="description"` also wires aria-describedby, for the two
   text triggers the brief asks for (items 3 and 4, conflict C1). */
export function LTTooltip({ text, direction = 'top', delayDuration = 400, type = 'label', children }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(null)
  const anchorRef = useRef(null)
  const tipRef = useRef(null)
  const timer = useRef(0)
  const overTip = useRef(false)
  const id = useId()
  const root = usePortalRoot()

  const show = delay => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(true), delay)
  }
  const hide = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => { if (!overTip.current) setOpen(false) }, 60)
  }
  useEffect(() => () => clearTimeout(timer.current), [])
  useLayoutEffect(() => {
    if (!open || !anchorRef.current || !tipRef.current) return
    const update = () => anchorRef.current && tipRef.current &&
      setPos(placeFloating(anchorRef.current, tipRef.current, { side: direction, align: 'center', offset: 6 }))
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update, true); window.removeEventListener('resize', update) }
  }, [open, direction, text])
  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const child = React.Children.only(children)
  const props = {
    ref: node => {
      anchorRef.current = node
      const r = child.props.ref // React 19: ref is an ordinary prop
      if (typeof r === 'function') r(node); else if (r) r.current = node
    },
    onMouseEnter: e => { child.props.onMouseEnter?.(e); show(delayDuration) },
    onMouseLeave: e => { child.props.onMouseLeave?.(e); hide() },
    onFocus: e => { child.props.onFocus?.(e); if (e.target.matches?.(':focus-visible')) show(0) },
    onBlur: e => { child.props.onBlur?.(e); clearTimeout(timer.current); setOpen(false) },
    onMouseDown: e => { child.props.onMouseDown?.(e); clearTimeout(timer.current); setOpen(false) },
  }
  if (type === 'description') props['aria-describedby'] = `${id}-d`
  return (
    <>
      {React.cloneElement(child, props)}
      {type === 'description' && <span id={`${id}-d`} className="vh">{text}</span>}
      {open && text && createPortal(
        <div ref={tipRef} role="tooltip" aria-hidden="true"
          className={cx('lt-tooltip', pos && `is-${pos.side}`)}
          style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999 }}
          onMouseEnter={() => { overTip.current = true }}
          onMouseLeave={() => { overTip.current = false; hide() }}>
          {text}
        </div>, root)}
    </>
  )
}

/* ---------- full text of truncated text (v2 item 16) ----------
   Not a library component: LTTooltip on a span, shown only while the span is
   actually cut off, measured at the moment of hover, so it follows the
   viewport and whatever sits beside the text. `lines` checks a line clamp
   instead of an ellipsis. Text that fits never gets a tooltip
   (guidelines/lttooltip.md: never repeat text already visible). */
export function TruncText({ text, children, className, direction = 'top', lines = false, as: Tag = 'span', ...rest }) {
  const ref = useRef(null)
  const [tip, setTip] = useState('')
  const check = () => {
    const el = ref.current
    if (!el) return
    const cut = lines ? el.scrollHeight > el.clientHeight + 1 : el.scrollWidth > el.clientWidth + 1
    setTip(cut ? text : '')
  }
  return (
    <LTTooltip text={tip} direction={direction}>
      <Tag ref={ref} className={className} onMouseEnter={check} {...rest}>{children ?? text}</Tag>
    </LTTooltip>
  )
}

/* ---------- LTButton ----------
   Variants and sizes from COMPONENTS.md. `inactive` replaces disabled
   (guidelines/ltbutton.md: never disable). */
export const LTButton = React.forwardRef(function LTButton(
  { variant = 'outline', size = 'small', label, children, leadingIcon: Lead, trailingIcon: Trail,
    counter, inactive = false, loading = false, onClick, ariaLabel, className, style, btnType = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={btnType} aria-label={ariaLabel}
      aria-disabled={inactive || loading || undefined}
      className={cx('lt-btn', `lt-btn--${variant}`, `lt-btn--${size}`, inactive && 'is-inactive', className)}
      style={style}
      onClick={e => { if (inactive || loading) { e.preventDefault(); return } onClick?.(e) }}
      {...rest}>
      {Lead && <Lead size={16} aria-hidden="true" className="lt-btn__icon" />}
      <span className="lt-btn__label">{label ?? children}</span>
      {counter != null && <span className="lt-btn__counter">{counter}</span>}
      {Trail && <Trail size={16} aria-hidden="true" className="lt-btn__icon lt-btn__icon--trail" />}
    </button>
  )
})

/* ---------- LTIconButton ----------
   Always an accessible label plus a tooltip showing it, with the shortcut
   when one exists (guidelines/lticonbutton.md). */
export const LTIconButton = React.forwardRef(function LTIconButton(
  { icon: Icon, ariaLabel, variant = 'default', size = 'medium', tooltipDirection = 's', keyshortcuts,
    shortcutLabel, onClick, inactive = false, pressed, expanded, controls, haspopup, className,
    unsafeDisableTooltip = false, tooltipText, iconClassName, ...rest },
  ref,
) {
  const dir = { n: 'top', s: 'bottom', e: 'right', w: 'left', ne: 'top', nw: 'top', se: 'bottom', sw: 'bottom' }[tooltipDirection] ?? 'bottom'
  const btn = (
    <button ref={ref} type="button" aria-label={ariaLabel}
      aria-keyshortcuts={keyshortcuts} aria-pressed={pressed} aria-expanded={expanded}
      aria-controls={controls} aria-haspopup={haspopup}
      aria-disabled={inactive || undefined}
      className={cx('lt-iconbtn', `lt-iconbtn--${variant}`, `lt-iconbtn--${size}`, inactive && 'is-inactive', className)}
      onClick={e => { if (inactive) return; onClick?.(e) }}
      {...rest}>
      <Icon size={size === 'xsmall' ? 14 : 16} aria-hidden="true" className={iconClassName} />
    </button>
  )
  if (unsafeDisableTooltip) return btn
  const tip = tooltipText ?? (shortcutLabel ? `${ariaLabel} (${shortcutLabel})` : ariaLabel)
  return <LTTooltip text={tip} direction={dir}>{btn}</LTTooltip>
})

/* ---------- LTButtonGroup ----------
   Actions only; role="toolbar" plus a label so the grouping is not purely
   visual (guidelines/ltbuttongroup.md). */
export function LTButtonGroup({ ariaLabel, children, className }) {
  return <div role="toolbar" aria-label={ariaLabel} className={cx('lt-btngroup', className)}>{children}</div>
}

/* ---------- LTCounterLabel ---------- */
export function LTCounterLabel({ count, scheme = 'secondary', className, ...rest }) {
  return <span className={cx('lt-counter', `lt-counter--${scheme}`, className)} {...rest}>{count}</span>
}

/* ---------- LTTag ---------- read-only metadata (guidelines/lttag.md).
   `leadingVisual` takes an icon (icons.md, "How icons are passed"). A tag
   cut off by its 200px cap shows its full text on hover (v2 item 16). */
export function LTTag({ text, variant = 'secondary', labelStyle = 'outline', size = 'small', leadingVisual: Icon, className }) {
  return (
    <span className={cx('lt-tag', `lt-tag--${variant}`, `lt-tag--${labelStyle}`, `lt-tag--${size}`, className)}>
      {Icon && <Icon size={12} aria-hidden="true" className="lt-tag__icon" />}
      <TruncText text={text} className="lt-tag__text" />
    </span>
  )
}

/* ---------- LTTestStatusLabel ----------
   Glyphs follow the Status component as mock-data.md describes it:
   passed = green circle, white tick; failed = red circle, white cross;
   queued = purple circle, stacked lines. `bare` is the component's bg?=No
   (the glyph without its circle), held per surface. With text it is the
   header pill (showStatusText). */
const STATUS_WORD = { passed: 'Passed', failed: 'Failed', queued: 'Queued' }
export function StatusGlyph({ status, size = 16, bare = false, onEmphasis = false }) {
  const fg = onEmphasis ? 'var(--fg-on-emphasis)'
    : status === 'passed' ? 'var(--success-fg)' : status === 'failed' ? 'var(--danger-fg)' : 'var(--done-fg)'
  const ink = bare ? fg : 'var(--fg-on-emphasis)'
  const glyph = status === 'passed'
    ? <path d="M4.6 8.3l2.2 2.2 4.6-4.8" fill="none" stroke={ink} strokeWidth={bare ? 1.8 : 1.6} strokeLinecap="round" strokeLinejoin="round" />
    : status === 'failed'
      ? <path d="M5.4 5.4l5.2 5.2M10.6 5.4l-5.2 5.2" fill="none" stroke={ink} strokeWidth={bare ? 1.8 : 1.6} strokeLinecap="round" />
      : <path d="M5 6h6M5 8h6M5 10h6" fill="none" stroke={ink} strokeWidth="1.4" strokeLinecap="round" />
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" className="status-glyph">
      {!bare && <circle cx="8" cy="8" r="8" fill={fg} />}
      {glyph}
    </svg>
  )
}
export function LTTestStatusLabel({ status, showStatusText = true, width = 16, bare = false, className }) {
  if (!showStatusText) {
    return (
      <span className={cx('status-label', className)} role="img" aria-label={STATUS_WORD[status] ?? status}>
        <StatusGlyph status={status} size={width} bare={bare} />
      </span>
    )
  }
  return (
    <span className={cx('status-pill', `status-pill--${status}`, className)}>
      <StatusGlyph status={status} size={width} bare onEmphasis />
      <span>{STATUS_WORD[status] ?? status}</span>
    </span>
  )
}

/* ---------- LTMetaData ----------
   `showLeadingDot` puts the middle dot before the item (ux-text-guidelines.md
   §2: middle dot between related fragments). */
export function LTMetaData({ leadingIcon: Icon, value, showLeadingDot = true, label, children, className }) {
  return (
    <span className={cx('meta-item', className)}>
      {showLeadingDot && <span className="meta-dot" aria-hidden="true">·</span>}
      {Icon && <Icon size={16} aria-hidden="true" className="meta-icon" />}
      {label && <span className="vh">{label} </span>}
      {children ?? value}
    </span>
  )
}

/* ---------- LTLink ---------- links navigate (guidelines/ltlink.md) */
export function LTLink({ href = '#', label, children, muted = false, className, onClick, ...rest }) {
  return (
    <a href={href} className={cx('lt-link', muted && 'lt-link--muted', className)} onClick={onClick} {...rest}>
      {label ?? children}
    </a>
  )
}

/* ---------- LTAvatar ---------- initials only (mock-data.md § People) */
export function LTAvatar({ initials, name, size = 32 }) {
  return (
    <span className="lt-avatar" style={{ width: size, height: size }} role="img" aria-label={name}>
      {initials}
    </span>
  )
}

/* ---------- LTSkeletonBox ---------- */
export function LTSkeletonBox({ width = '100%', height = 12, radius = 'var(--radius-1)', delay = 0, className }) {
  return <span className={cx('lt-skeleton', className)} aria-hidden="true"
    style={{ width, height, borderRadius: radius, animationDelay: `${delay}ms` }} />
}

/* ---------- LTCopyToClipboard ----------
   Copies, swaps the icon for a tick for 2 seconds, and says so to screen
   readers (ux-text-guidelines.md §3: silent success still speaks). */
export function LTCopyToClipboard({ textToCopy, copyAriaLabel = 'Copy to clipboard', copiedAriaLabel = 'Copied to clipboard',
  buttonVariant = 'invisible', size = 'medium', className, onCopy, tooltipDirection = 's', dark = false }) {
  return (
    <CopyIconButton icon={Copy} ariaLabel={copyAriaLabel} copiedLabel={copiedAriaLabel} copy={() => copyText(textToCopy)}
      variant={buttonVariant} size={size} tooltipDirection={tooltipDirection} onCopy={onCopy} dark={dark} className={className} />
  )
}

/* ---------- copy with another icon ----------
   Composed, not a library component: LTCopyToClipboard always shows the copy
   glyph and copies plain text. "Copy link" (link glyph) and "Copy table"
   (HTML plus text, v2 item 10) reuse its feedback: a tick for 2 seconds, the
   tooltip "Copied", and the announcement. */
export function CopyIconButton({ icon, ariaLabel, copiedLabel, copy, variant = 'invisible', size = 'small',
  tooltipDirection = 's', onCopy, dark = false, className, tabIndex }) {
  const [state, setState] = useState(null) // 'copied' | 'failed' | null
  const t = useRef(0)
  useEffect(() => () => clearTimeout(t.current), [])
  // "Test ID copied" fails as "Test ID failed to copy" (ux-text-guidelines.md
  // §5: "{object} failed to {verb}").
  const failedLabel = copiedLabel.replace(/ copied$/, ' failed to copy')
  const run = async () => {
    const ok = await copy()
    setState(ok === false ? 'failed' : 'copied')
    announce(ok === false ? failedLabel : copiedLabel)
    if (ok !== false) onCopy?.()
    clearTimeout(t.current); t.current = setTimeout(() => setState(null), 2000)
  }
  return (
    <LTIconButton icon={state === 'copied' ? Check : icon} ariaLabel={ariaLabel}
      tooltipText={state === 'copied' ? 'Copied' : state === 'failed' ? failedLabel : ariaLabel}
      variant={variant} size={size} tooltipDirection={tooltipDirection} onClick={run} tabIndex={tabIndex}
      className={cx(state === 'copied' && 'is-copied', dark && 'on-dark', className)} />
  )
}

/* ---------- LTInputBox ----------
   Search fields keep variant="default", the one with a background
   (guidelines/ltinputbox.md). colorScheme="dark" is for the log console. */
export function LTInputBox({ value, onChange, placeholder, ariaLabel = 'Search', type = 'search', size = 'medium',
  colorScheme = 'light', allowClearSearch = type === 'search', forwardRef, onKeyDown, keyshortcuts, className, extraStyle }) {
  const lead = type === 'search'
  return (
    <div className={cx('lt-input', `lt-input--${size}`, colorScheme === 'dark' && 'lt-input--dark', !lead && 'lt-input--plain', className)} style={extraStyle}>
      {lead && <Search size={16} aria-hidden="true" className="lt-input__lead" />}
      <input ref={forwardRef} type={type} value={value} placeholder={placeholder} aria-label={ariaLabel}
        aria-keyshortcuts={keyshortcuts} autoComplete="off" spellCheck={false}
        onChange={e => onChange(e.target.value)} onKeyDown={onKeyDown} />
      {allowClearSearch && value && (
        <button type="button" className="lt-input__clear" aria-label="Clear search"
          onClick={() => { onChange(''); forwardRef?.current?.focus() }}>
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

/* ---------- LTTextarea ----------
   Props from COMPONENTS.md: label, caption, value, onChange, placeholder,
   rows, resize, required, validationStatus, validationMessage, forwardRef,
   id, readOnly, disabled, extraStyle. The label sits above, the caption and
   any error below (guidelines/lttextarea.md); an error carries an icon and
   words, never the border colour alone. There is no maxLength prop, so a
   length limit is a validation rule. */
export function LTTextarea({ label, caption, value, onChange, placeholder, rows = 4, resize = 'both', required = false,
  validationStatus = 'default', validationMessage, forwardRef, id, readOnly = false, disabled = false, extraStyle }) {
  const autoId = useId()
  const fid = id || autoId
  const invalid = validationStatus === 'error'
  const describedBy = [invalid && validationMessage ? `${fid}-msg` : null, caption ? `${fid}-cap` : null].filter(Boolean).join(' ')
  return (
    <div className={cx('lt-textarea', invalid && 'is-error')} style={extraStyle}>
      {label && (
        <label className="lt-textarea__label" htmlFor={fid}>
          {label}{required && <span className="lt-textarea__req" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea ref={forwardRef} id={fid} rows={rows} value={value} placeholder={placeholder} required={required}
        readOnly={readOnly} disabled={disabled} aria-invalid={invalid || undefined} aria-describedby={describedBy || undefined}
        style={{ resize }} onChange={e => onChange(e.target.value)} />
      {invalid && validationMessage && (
        <p id={`${fid}-msg`} className="lt-textarea__msg">
          <CircleAlert size={12} aria-hidden="true" className="lt-textarea__msg-icon" />{validationMessage}
        </p>
      )}
      {caption && <p id={`${fid}-cap`} className="lt-textarea__caption">{caption}</p>}
    </div>
  )
}

/* ---------- LTCodeBlock ----------
   Code surfaces carry their own theme and default to dark
   (guidelines/README.md §1). headerActions is the toolbar slot. */
export function LTCodeBlock({ title, headerActions, theme = 'dark', children, className, bodyRef }) {
  return (
    <div className={cx('lt-code', `lt-code--${theme}`, className)}>
      {(title || headerActions) && (
        <div className="lt-code__head">
          {title && <span className="lt-code__title">{title}</span>}
          <span className="lt-code__actions">{headerActions}</span>
        </div>
      )}
      <div className="lt-code__body" ref={bodyRef}>{children}</div>
    </div>
  )
}

/* ---------- LTBlankSlate ---------- */
export function LTBlankSlate({ heading, description, primaryAction, visual, narrow = true }) {
  return (
    <div className={cx('lt-blank', narrow && 'lt-blank--narrow')}>
      {visual && <div className="lt-blank__visual" aria-hidden="true">{visual}</div>}
      <p className="lt-blank__heading">{heading}</p>
      {description && <p className="lt-blank__desc">{description}</p>}
      {primaryAction && <div className="lt-blank__action">{primaryAction}</div>}
    </div>
  )
}

/* ---------- LTFlash ---------- one per page (guidelines/ltflash.md) */
export function LTFlash({ variant = 'default', text, action, className }) {
  const Icon = variant === 'danger' ? CircleAlert : TriangleAlert
  return (
    <div className={cx('lt-flash', `lt-flash--${variant}`, className)} role={variant === 'danger' ? 'alert' : 'status'}>
      <Icon size={16} aria-hidden="true" className="lt-flash__icon" />
      <span className="lt-flash__text">{text}</span>
      {action && <span className="lt-flash__action">{action}</span>}
    </div>
  )
}

/* ---------- LTTable ---------- columns, data, allowValueCopy */
export function LTTable({ columns, data, allowValueCopy = false, caption }) {
  return (
    <table className="lt-table">
      {caption && <caption className="vh">{caption}</caption>}
      <thead><tr>{columns.map(c => <th key={c.key} scope="col">{c.title}</th>)}</tr></thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map(c => (
              <td key={c.key} className={c.mono ? 'mono' : undefined}>
                <span className="lt-table__cell">
                  <span className="lt-table__value">{row[c.key]}</span>
                  {allowValueCopy && c.copy && (
                    <LTCopyToClipboard textToCopy={String(row[c.key])} size="xsmall"
                      copyAriaLabel={`Copy ${row[c.copyName ?? 'key'] ?? 'value'}`} copiedAriaLabel="Value copied"
                      className="lt-table__copy" />
                  )}
                </span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
