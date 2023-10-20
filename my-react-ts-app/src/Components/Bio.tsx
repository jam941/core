function Bio(){
    return(
    <div className="text-white">
     
        <h1 className="text-xl text-white font-bold mb-2">Jarred Moyer</h1>

        
        <p className="mb-4">
            Software Engineer at{' '}  
            <a href="http://www.wethehobby.com" target="_blank" className="text-blue-300 hover:underline">
                Topshelf Enterprises
            </a>
        </p>

        
        <p className="mb-4">
        
            
        </p>

        
        <div className="flex space-x-4">
            <a href="mailto:your@email.com" className="text-blue-500 hover:underline">
                Email
            </a>
            <a href="https://www.linkedin.com/in/your-linkedin-handle/" target="_blank" className="text-blue-500 hover:underline">
                LinkedIn
            </a>
            <a href="https://github.com/your-github-handle" target="_blank" className="text-blue-500 hover:underline">
                GitHub
            </a>
        </div>
    </div>)
}
export default Bio