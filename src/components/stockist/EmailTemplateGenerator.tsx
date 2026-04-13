'use client'

import { useState } from 'react'

const PRODUCTS = [
  { name: 'FOCUS', flavor: 'Vanilla Bean', benefit: 'Mental clarity & focus', color: '#2E8B74' },
  { name: 'IMMUNITY', flavor: 'Hazelnut & Orange', benefit: 'Daily immune support', color: '#C05A15' },
  { name: 'CALM', flavor: 'Honey Caramel', benefit: 'Stress relief & relaxation', color: '#7060C0' },
  { name: 'GLOW', flavor: 'Cherry Almond', benefit: 'Skin health & radiance', color: '#B87060' },
]

export default function EmailTemplateGenerator({ stockistRef = 'stockist', recipientEmail = '' }: { stockistRef?: string; recipientEmail?: string }) {
  const [venueName, setVenueName] = useState('')
  const [senderName, setSenderName] = useState('')
  const [selectedProducts, setSelectedProducts] = useState(['FOCUS', 'IMMUNITY', 'CALM', 'GLOW'])
  const [customLine, setCustomLine] = useState('')
  const [copied, setCopied] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState('')
  const [step, setStep] = useState<'edit' | 'preview'>('edit')

  const toggleProduct = (name: string) => {
    setSelectedProducts(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    )
  }

  const chosenProducts = PRODUCTS.filter(p => selectedProducts.includes(p.name))

  const generateHTML = () => {
    const productRows = chosenProducts.map(p => `
      <td width="${Math.floor(100 / chosenProducts.length)}%" valign="top" style="padding:4px;">
        <div style="border-radius:6px;overflow:hidden;text-align:center;border:1px solid #EAE7E2;">
          <div style="background:${p.color};padding:8px 4px 10px;">
            <p style="font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:bold;color:#fff;letter-spacing:1px;margin:0 0 2px;">${p.name}</p>
            <p style="font-family:Helvetica,Arial,sans-serif;font-size:8.5px;color:rgba(255,255,255,0.75);margin:0;">${p.flavor}</p>
          </div>
          <div style="background:#FAFAF8;padding:8px 6px;">
            <p style="font-family:Helvetica,Arial,sans-serif;font-size:8px;color:#4A6070;line-height:1.4;margin:0;">${p.benefit}</p>
          </div>
        </div>
      </td>`).join('')

    const customBlock = customLine.trim() ? `
      <p style="font-size:15px;color:#1A2530;line-height:1.7;font-family:Georgia,serif;margin:0 0 16px;">
        ${customLine}
      </p>` : ''

    return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>We now serve NECTA Labs</title></head>
<body style="margin:0;padding:0;background:#F2EFE9;font-family:Georgia,'Times New Roman',serif;">
<div style="max-width:580px;margin:32px auto;background:#ffffff;border-radius:4px;overflow:hidden;">

  <div style="width:100%;height:3px;background:#2A9D82;"></div>
  <div style="background:#0D1B2A;padding:36px 40px 28px;text-align:center;">
    <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:30px;font-weight:bold;letter-spacing:8px;color:#fff;margin:0 0 4px;">NECTA</p>
    <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:4px;color:#5A7888;margin:0 0 12px;">L  a  b  s</p>
    <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#7ABFAC;letter-spacing:1px;margin:0;">Organic Functional Infusions</p>
  </div>

  <div style="padding:36px 40px 20px;">
    <p style="font-size:16px;color:#1A2530;line-height:1.7;margin:0 0 16px;">Hi [First Name],</p>
    <p style="font-size:16px;color:#1A2530;line-height:1.7;margin:0 0 20px;">
      We're excited to share something new we're serving here at <strong>${venueName || '[Venue Name]'}</strong>. 
      We've partnered with <strong>NECTA Labs</strong> — a premium British wellness brand making organic functional 
      syrups you can add to any drink.
    </p>
    ${customBlock}
    <hr style="border:none;border-top:1px solid #E8E4DE;margin:24px 0;">
    <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#2A9D82;margin:0 0 16px;">The range</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;">${productRows}</table>
    <hr style="border:none;border-top:1px solid #E8E4DE;margin:24px 0;">
    <div style="background:#F0F9F5;border-left:3px solid #2A9D82;border-radius:0 4px 4px 0;padding:16px 20px;margin:0 0 24px;">
      <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:#1A4030;line-height:1.6;margin:0;">
        Each formula is clinically dosed with adaptogens, nootropics and botanicals. 70%+ organic. No sugar. No artificial flavours. Just 2 pumps into any drink.
      </p>
    </div>
    <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#2A9D82;margin:0 0 14px;">How it works</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td width="32" valign="top" style="padding-top:2px;"><div style="width:24px;height:24px;border-radius:50%;background:#2A9D82;text-align:center;line-height:24px;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:bold;color:#fff;">1</div></td><td style="padding-left:12px;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#3A5060;line-height:1.5;padding-bottom:10px;"><strong>Choose your formula</strong> — pick the one that matches how you're feeling today.</td></tr>
      <tr><td width="32" valign="top" style="padding-top:2px;"><div style="width:24px;height:24px;border-radius:50%;background:#2A9D82;text-align:center;line-height:24px;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:bold;color:#fff;">2</div></td><td style="padding-left:12px;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#3A5060;line-height:1.5;padding-bottom:10px;"><strong>Ask us to add 2 pumps</strong> to any coffee, tea, matcha, smoothie or cocktail.</td></tr>
      <tr><td width="32" valign="top" style="padding-top:2px;"><div style="width:24px;height:24px;border-radius:50%;background:#2A9D82;text-align:center;line-height:24px;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:bold;color:#fff;">3</div></td><td style="padding-left:12px;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#3A5060;line-height:1.5;padding-bottom:10px;"><strong>That's it.</strong> Blends in instantly. No mixing, no fuss.</td></tr>
    </table>
    <hr style="border:none;border-top:1px solid #E8E4DE;margin:24px 0;">
    <div style="text-align:center;padding:8px 0 24px;">
      <a href="https://nectalabs.com?ref=${stockistRef}" style="display:inline-block;background:#0D1B2A;color:#fff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1px;padding:14px 36px;border-radius:4px;text-decoration:none;">Shop NECTA online &rarr;</a>
      <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#7A9BAA;margin-top:10px;">Subscribe at nectalabs.com and save 15% on every order</p>
    </div>
  </div>

  <div style="padding:0 40px 28px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
    ${['ORGANIC','ADAPTOGENS','BOTANICALS','NOOTROPICS','MADE IN THE UK','NO SUGAR','GLUTEN FREE'].map(b =>
      `<span style="border:1px solid #C8D8C0;border-radius:20px;padding:3px 10px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;color:#2A7D62;letter-spacing:0.5px;">${b}</span>`
    ).join(' ')}
  </div>

  <div style="padding:0 40px 28px;">
    <p style="font-size:15px;color:#1A2530;line-height:1.7;font-family:Georgia,serif;margin:0 0 8px;">Hope you love it as much as we do.</p>
    <p style="font-size:15px;color:#1A2530;line-height:1.7;font-family:Georgia,serif;margin:0;">
      Warmly,<br><strong>${senderName || '[Your Name]'}</strong><br>${venueName || '[Venue Name]'}
    </p>
  </div>

  <div style="background:#0D1B2A;padding:20px 40px;text-align:center;">
    <div style="width:100%;height:2px;background:#2A9D82;margin-bottom:16px;"></div>
    <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;color:#4A6A7A;margin:0 0 4px;line-height:1.5;">You're receiving this because you're a customer of <strong style="color:#5A7A8A;">${venueName || '[Venue Name]'}</strong>.</p>
    <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;color:#4A6A7A;margin:0 0 4px;"><a href="#" style="color:#7ABFAC;text-decoration:none;">Unsubscribe</a> &nbsp;·&nbsp; <a href="https://nectalabs.com" style="color:#7ABFAC;text-decoration:none;">nectalabs.com</a></p>
    <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;color:#2A4A5A;margin:8px 0 0;">NECTA Labs · NECTA GROUP LTD · Registered in England &amp; Wales</p>
  </div>
</div>
</body></html>`
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateHTML())
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSendToEmail = async () => {
    setSending(true)
    setSendError('')
    setSent(false)
    try {
      const res = await fetch('/api/stockist-send-email-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: recipientEmail, html: generateHTML(), venueName }),
      })
      if (!res.ok) throw new Error('Failed')
      setSent(true)
      setTimeout(() => setSent(false), 4000)
    } catch {
      setSendError('Could not send. Try copying the HTML instead.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e4e8ee', borderRadius: 12, overflow: 'hidden' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e4e8ee' }}>
        {(['edit', 'preview'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setStep(tab)}
            style={{
              flex: 1, padding: '14px 0', border: 'none', cursor: 'pointer',
              background: step === tab ? '#fff' : '#f7f8fa',
              borderBottom: step === tab ? '2px solid #0D1B2A' : '2px solid transparent',
              fontWeight: step === tab ? 600 : 400,
              fontSize: 13, color: step === tab ? '#0D1B2A' : '#6b7a8f',
              fontFamily: 'inherit',
            }}
          >
            {tab === 'edit' ? '✏️  Customise' : '👁  Preview'}
          </button>
        ))}
      </div>

      {step === 'edit' && (
        <div style={{ padding: '24px 28px' }}>
          <p style={{ fontSize: 13, color: '#6b7a8f', marginBottom: 20, marginTop: 0 }}>
            Fill in your details and pick which products to feature. Then copy the HTML straight into Mailchimp, Klaviyo, or any email tool.
          </p>

          {/* Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#0D1B2A', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 }}>Venue name</label>
              <input
                value={venueName}
                onChange={e => setVenueName(e.target.value)}
                placeholder="e.g. The Wellness Café"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #e4e8ee', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#0D1B2A', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 }}>Your name</label>
              <input
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
                placeholder="e.g. Sarah"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #e4e8ee', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#0D1B2A', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 }}>Optional — add a personal line</label>
            <input
              value={customLine}
              onChange={e => setCustomLine(e.target.value)}
              placeholder="e.g. We tried every product before choosing NECTA and we're obsessed."
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #e4e8ee', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          {/* Product picker */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#0D1B2A', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Products to feature</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {PRODUCTS.map(p => {
                const on = selectedProducts.includes(p.name)
                return (
                  <button
                    key={p.name}
                    onClick={() => toggleProduct(p.name)}
                    style={{
                      flex: 1, padding: '10px 6px', border: `2px solid ${on ? p.color : '#e4e8ee'}`,
                      borderRadius: 8, background: on ? p.color + '18' : '#fafafa',
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color: on ? p.color : '#aaa', letterSpacing: 0.5 }}>{p.name}</div>
                    <div style={{ fontSize: 9.5, color: on ? '#555' : '#ccc', marginTop: 2 }}>{p.flavor}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <button
            onClick={() => setStep('preview')}
            style={{
              width: '100%', padding: '12px 0', background: '#0D1B2A', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Preview email →
          </button>
        </div>
      )}

      {step === 'preview' && (
        <div>
          {/* Action bar */}
          <div style={{ padding: '14px 24px', background: '#f7f8fa', borderBottom: '1px solid #e4e8ee', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleSendToEmail}
              disabled={sending || !recipientEmail}
              style={{
                padding: '9px 20px', background: '#0D1B2A', color: '#fff',
                border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600,
                cursor: recipientEmail ? 'pointer' : 'not-allowed', fontFamily: 'inherit', opacity: sending ? 0.7 : 1,
              }}
            >
              {sent ? '✓ Sent to your email!' : sending ? 'Sending…' : `Send to my email`}
            </button>
            <button
              onClick={handleCopy}
              style={{
                padding: '9px 20px', background: '#fff', color: '#0D1B2A',
                border: '1px solid #e4e8ee', borderRadius: 7, fontSize: 12, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {copied ? '✓ Copied!' : 'Copy HTML'}
            </button>
            <span style={{ fontSize: 11, color: '#6b7a8f' }}>
              {sendError
                ? <span style={{ color: '#c0392b' }}>{sendError}</span>
                : sent
                ? `Sent to ${recipientEmail}`
                : 'Or copy HTML to paste into Mailchimp / Klaviyo'}
            </span>
          </div>

          {/* iframe preview */}
          <iframe
            srcDoc={generateHTML()}
            style={{ width: '100%', height: 700, border: 'none', display: 'block' }}
            title="Email preview"
          />
        </div>
      )}
    </div>
  )
}
