const swatches = [
  { name: '--color-primary', value: '#0176d3' },
  { name: '--color-primary-dark', value: '#014486' },
  { name: '--color-primary-light', value: '#d8edff' },
  { name: '--color-neutral-10', value: '#f3f3f3' },
  { name: '--color-neutral-50', value: '#dddbda' },
  { name: '--color-neutral-70', value: '#706e6b' },
  { name: '--color-neutral-90', value: '#3e3e3c' },
  { name: '--color-white', value: '#ffffff' },
  { name: '--color-error', value: '#c23934' },
  { name: '--color-focus-ring', value: '#1b96ff' },
];

export default function TokensReference() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: 16 }}>Design Tokens Reference</h1>
      <section>
        <h2 style={{ marginBottom: 8 }}>Colours</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {swatches.map(({ name, value }) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: value,
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  marginBottom: 4,
                }}
              />
              <code style={{ fontSize: 11 }}>{name}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
