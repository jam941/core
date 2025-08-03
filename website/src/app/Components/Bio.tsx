function Bio() {
    return (
        <div style={{ 
            color: 'white', 
            padding: '0', 
            width: '100%'
        }}>
            <h1 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                marginBottom: '8px', 
                borderBottom: '1px solid #3B82F6', 
                paddingBottom: '8px', 
                display: 'inline-block' 
            }}>Jarred Moyer</h1>
            
            <p style={{ marginBottom: '8px', fontSize: '16px' }}>
                Software Engineer at{' '}  
                <a href="https://www.linkedin.com/company/wethehobby/about/" target="_blank" style={{ color: '#3B82F6', transition: 'color 0.2s' }}>
                    WeTheHobby
                </a>
            </p>
            <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                B.S Software Engineering{' '}  
                <a href="https://www.rit.edu/study/software-engineering-bs" target="_blank" style={{ color: 'white', transition: 'color 0.2s' }}>
                    RIT
                </a>
                {' '}2023
            </p>
            
            <div style={{ 
                marginBottom: '16px', 
                background: 'linear-gradient(to right, #2c3038, rgba(44, 48, 56, 0.8))', 
                padding: '12px', 
                borderRadius: '12px', 
                boxShadow: 'inset 0 2px 4px 0 rgba(59, 130, 246, 0.06)' 
            }}>
                <p style={{ fontSize: '14px', fontWeight: '600' }}>
                    Currently building internal product management systems and interactive media applications for
                    <a href="https://www.linkedin.com/company/wethehobby/about/" target="_blank" style={{ color: '#3B82F6', transition: 'color 0.2s' }}>
                        WeTheHobby
                    </a>
                    with responsibilities and experiences including:
                </p>
                <ul style={{ fontSize: '13px', paddingLeft: '16px', marginTop: '8px', lineHeight: '1.4' }}>
                    <li>Managed release workflows for both internal and customer-facing applications</li>
                    <li>Created onboarding documentation and supported integration of new engineers</li>
                    <li>Participated in requirements gathering and post-launch support for multiple projects</li>
                    <li>Built reusable tooling to streamline recurring development patterns, including:</li>
                    <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                        <li>Abstracted integration between ORMs and common dashboard operations</li>
                        <li>Sync systems for consistent frontend–backend state management</li>
                        <li>Frontend component library for consistent styling and an improved developer experience</li>
                        <li>Entity change tracking and reporting</li>
                    </ul>
                    <li>Established and maintained code quality standards using linters and contribution guidelines</li>
                    <li>Defined API naming conventions to ensure clarity and promote reusability</li>
                    <li>Implemented middleware to enhance request logging and identity tracking</li>
                </ul>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'white', marginTop: '12px' }}>
                <a href="mailto:jarredds941@gmail.com" style={{ color: 'white', transition: 'color 0.2s, transform 0.2s' }}>
                    <svg style={{ height: '20px', width: '20px', color: 'white', transition: 'color 0.3s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z"/>
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <polyline points="3 7 12 13 21 7" />
                    </svg>
                </a>
                <a href="https://www.linkedin.com/in/jarredmoyer/" target="_blank" style={{ color: 'white', transition: 'color 0.2s, transform 0.2s' }}>
                    <svg style={{ height: '20px', width: '20px', color: 'white', transition: 'color 0.3s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                    </svg>
                </a>
                <a href="https://github.com/jam941" target="_blank" style={{ color: 'white', transition: 'color 0.2s, transform 0.2s' }}>
                    <svg style={{ height: '20px', width: '20px', color: 'white', transition: 'color 0.3s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                </a>
            </div>
        </div>
    )
}

export default Bio;