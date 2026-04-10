function Bio() {
  return (
    <div
      style={{
        color: 'var(--color-text)',
        padding: 0,
        width: '100%',
        textAlign: 'left',
      }}
    >
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '8px',
          borderBottom: '1px solid var(--color-accent)',
          paddingBottom: '8px',
          display: 'inline-block',
          color: 'var(--color-text)',
        }}
      >
        Jarred Moyer
      </h1>

      <p style={{ marginBottom: '8px', fontSize: '16px', color: 'var(--color-text-muted)' }}>
        Software Engineer at{' '}
        <a
          href="https://www.linkedin.com/company/wethehobby/about/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-link)', transition: 'color 0.2s' }}
        >
          WeTheHobby
        </a>
      </p>
      <p style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--color-text-muted)' }}>
        B.S Software Engineering{' '}
        <a
          href="https://www.rit.edu/study/software-engineering-bs"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-link)', transition: 'color 0.2s' }}
        >
          RIT
        </a>{' '}
        2023
      </p>

      <div
        style={{
          marginBottom: '16px',
          background: 'var(--bio-highlight-bg)',
          padding: '12px',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-inset-filter)',
          border: '1px solid var(--color-border)',
        }}
      >
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
          Currently building interactive media applications and internal tools for{' '}
          <a
            href="https://www.linkedin.com/company/wethehobby/about/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--color-link)', transition: 'color 0.2s' }}
          >
            WeTheHobby
          </a>
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          color: 'var(--color-text)',
          marginTop: '12px',
        }}
      >
        <a
          href="mailto:jarredds941@gmail.com"
          style={{ color: 'var(--color-link)', transition: 'color 0.2s, transform 0.2s' }}
          aria-label="Email"
        >
          <svg
            style={{ height: '20px', width: '20px', color: 'currentColor', transition: 'color 0.3s' }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <polyline points="3 7 12 13 21 7" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/jarredmoyer/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-link)', transition: 'color 0.2s, transform 0.2s' }}
          aria-label="LinkedIn"
        >
          <svg
            style={{ height: '20px', width: '20px', color: 'currentColor', transition: 'color 0.3s' }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
        <a
          href="https://github.com/jam941"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-link)', transition: 'color 0.2s, transform 0.2s' }}
          aria-label="GitHub"
        >
          <svg
            style={{ height: '20px', width: '20px', color: 'currentColor', transition: 'color 0.3s' }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default Bio;
