import {IonIcon} from '@ionic/react'
import {logoGithub} from "ionicons/icons"

const github = ()=>{

    return (
        <div className='flex items-center space-x-1'>
            
            <svg className="h-8 w-8 white"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>

            <span className="font-bold">Github</span>
        </div>
        )
    
    
}

const email = ()=>{

    return (
        <div className='flex items-center space-x-1'>
            
            <svg className="h-8 w-8 text-white"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <rect x="3" y="5" width="18" height="14" rx="2" />  <polyline points="3 7 12 13 21 7" /></svg>
            <span className="font-bold">Email</span>
        </div>
        )
    
    
}

const linkedIn = ()=>{

    return (
        <div className='flex items-center space-x-1'>
            
            <svg className="h-8 w-8 text-white"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />  <rect x="2" y="9" width="4" height="12" />  <circle cx="4" cy="4" r="2" /></svg>

            <span className="font-bold">LinkedIn</span>
        </div>
        )
    
    
}

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

        
        <div className="flex space-x-4 text-white">
            <a href="mailto:jarredds941@gmail.com" className="text-white hover:underline">
                {email()}
            </a>
            <a href="https://www.linkedin.com/in/jarredmoyer/" target="_blank" className="text-white hover:underline">
                {linkedIn()}
            </a>
            <a href="https://github.com/jam941" target="_blank" className="text-white w-auto hover:underline">
                
                {github()}
                
            </a>
        </div>
    </div>)
}
export default Bio