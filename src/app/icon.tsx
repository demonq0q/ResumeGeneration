import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 20,
            height: 24,
            background: 'white',
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            padding: 3,
            gap: 2,
          }}
        >
          <div style={{ display: 'flex', gap: 2 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#3b82f6',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <div style={{ width: 8, height: 2, background: '#3b82f6', borderRadius: 1 }} />
              <div style={{ width: 5, height: 1, background: '#94a3b8', borderRadius: 1 }} />
            </div>
          </div>
          <div style={{ width: '100%', height: 1, background: '#e2e8f0' }} />
          <div style={{ width: 10, height: 1.5, background: '#64748b', borderRadius: 1 }} />
          <div style={{ width: 12, height: 1, background: '#cbd5e1', borderRadius: 1 }} />
          <div style={{ width: 8, height: 1, background: '#cbd5e1', borderRadius: 1 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
