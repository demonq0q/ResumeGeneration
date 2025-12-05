import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 110,
            height: 130,
            background: 'white',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            padding: 16,
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#3b82f6',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ width: 40, height: 10, background: '#3b82f6', borderRadius: 4 }} />
              <div style={{ width: 28, height: 6, background: '#94a3b8', borderRadius: 3 }} />
            </div>
          </div>
          <div style={{ width: '100%', height: 2, background: '#e2e8f0' }} />
          <div style={{ width: 50, height: 8, background: '#64748b', borderRadius: 4 }} />
          <div style={{ width: 70, height: 6, background: '#cbd5e1', borderRadius: 3 }} />
          <div style={{ width: 55, height: 6, background: '#cbd5e1', borderRadius: 3 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
