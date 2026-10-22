import { ImageResponse } from 'next/og';

export const runtime = 'edge';

/** 512px logo referenced by the Organization JSON-LD in the root layout. */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          borderRadius: 112,
        }}
      >
        <svg width="288" height="288" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3v11.5m0 0-4-4m4 4 4-4M5 17.5c0 2 3 3.5 7 3.5s7-1.5 7-3.5"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { width: 512, height: 512 },
  );
}
