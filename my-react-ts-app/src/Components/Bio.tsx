const github = () => {
    return (
        <div className='flex items-center space-x-2 group'>
            <svg className="h-8 w-8 text-white group-hover:text-blue-300 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            <span className="font-bold group-hover:text-blue-300 transition-colors duration-300">Github</span>
        </div>
    )
}

const email = () => {
    return (
        <div className='flex items-center space-x-2 group'>
            <svg className="h-8 w-8 text-white group-hover:text-blue-300 transition-colors duration-300" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z"/>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <polyline points="3 7 12 13 21 7" />
            </svg>
            <span className="font-bold group-hover:text-blue-300 transition-colors duration-300">Email</span>
        </div>
    )
}

const linkedIn = () => {
    return (
        <div className='flex items-center space-x-2 group'>
            <svg className="h-8 w-8 text-white group-hover:text-blue-300 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
            </svg>
            <span className="font-bold group-hover:text-blue-300 transition-colors duration-300">LinkedIn</span>
        </div>
    )
}

function Bio() {
    return (
        <div className="text-white p-6 bg-card-bg rounded-2xl shadow-card mt-10 transform transition-all duration-300 hover:shadow-hover w-full">
            <h1 className="text-4xl text-white font-bold mb-4 border-b border-blue-500 pb-2">Jarred Moyer</h1>
            
            <p className="mb-4 text-xl">
                Software Engineer at{' '}  
                <a href="https://www.linkedin.com/company/wethehobby/about/" target="_blank" className="text-blue-300 hover:text-blue-200 transition-colors duration-200">
                    WeTheHobby
                </a>
            </p>
            <p className="mb-6 text-xl">
                B.S Software Engineering{' '}  
                <a href="https://www.rit.edu/study/software-engineering-bs" target="_blank" className="text-white hover:text-blue-200 transition-colors duration-200">
                    RIT  {' '}  
                </a>
                2023
            </p>
            
            <div className="mb-6 bg-card-header p-4 rounded-xl">
                <p className="mb-2 font-semibold">
                    Currently building internal and broadcast tools for WeTheHobby
                    
                </p>
                
            </div>
            
            <div className="flex space-x-4 text-white mt-4">
                <a href="mailto:jarredds941@gmail.com" className="text-white hover:text-blue-300 transition-colors duration-200">
                    {email()}
                </a>
                <a href="https://www.linkedin.com/in/jarredmoyer/" target="_blank" className="text-white hover:text-blue-300 transition-colors duration-200">
                    {linkedIn()}
                </a>
                <a href="https://github.com/jam941" target="_blank" className="text-white w-auto hover:text-blue-300 transition-colors duration-200">
                    {github()}
                </a>
            </div>
        </div>
    )
}

export default Bio;