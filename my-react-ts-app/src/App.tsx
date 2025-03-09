import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import Card from './Components/Card';
import data from './Data/data.json'
import { Job } from './Interfaces/CardType';
import { AxiosResponse } from 'axios';
import Bio from './Components/Bio';

function App() {
  const [jobs, setJobs] = useState<Job[]>(data);
  const [stringData, setStringData] = useState<string>(JSON.stringify({data}));
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [dynamicFilters, setDynamicFilters] = useState<{[key: string]: {filterValue: string, displayText: string}}>({});
  const [visibleJobs, setVisibleJobs] = useState<{[key: string]: boolean}>({});
  const [animatingJobs, setAnimatingJobs] = useState<{[key: string]: boolean}>({});
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const jobsContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const initialVisibility: {[key: string]: boolean} = {};
    jobs.forEach((job, index) => {
      initialVisibility[`job-${index}`] = true;
    });
    setVisibleJobs(initialVisibility);
    
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        const scrollPosition = window.scrollY;
        if (scrollPosition > 50) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const changeFilter = (filterValue: string) => {
    
    if (activeFilters.includes(filterValue)) {
      const newFilters = activeFilters.filter(f => f !== filterValue);
      setActiveFilters(newFilters);
      
      const tempJobs = JSON.parse(stringData).data;
      const newFilteredJobs = newFilters.length === 0 
        ? tempJobs 
        : tempJobs.filter((job: Job) => jobMatchesFilters(job, newFilters));
      
      const willBeVisible: {[key: string]: boolean} = {};
      newFilteredJobs.forEach((job: Job, index: number) => {
        willBeVisible[`job-${index}`] = true;
      });
      
      const animating: {[key: string]: boolean} = {};
      jobs.forEach((job, index) => {
        if (!willBeVisible[`job-${index}`] && visibleJobs[`job-${index}`]) {
          animating[`job-${index}`] = true;
        }
      });
      
      setAnimatingJobs(animating);
      
      setTimeout(() => {
        if (newFilters.length === 0) {
          setJobs(JSON.parse(stringData).data);
        } else {
          filterJobs(newFilters);
        }
        setAnimatingJobs({});
        
        setVisibleJobs(willBeVisible);
      }, 300);
      
    } else {
      const newFilters = [...activeFilters, filterValue];
      setActiveFilters(newFilters);
      
      const tempJobs = JSON.parse(stringData).data;
      const newFilteredJobs = tempJobs.filter((job: Job) => jobMatchesFilters(job, newFilters));
      
      const willBeVisible: {[key: string]: boolean} = {};
      newFilteredJobs.forEach((job: Job, index: number) => {
        const jobId = findJobIndex(job, tempJobs);
        willBeVisible[`job-${jobId}`] = true;
      });
      
      const animating: {[key: string]: boolean} = {};
      jobs.forEach((job, index) => {
        if (!willBeVisible[`job-${index}`] && visibleJobs[`job-${index}`]) {
          animating[`job-${index}`] = true;
        }
      });
      
      setAnimatingJobs(animating);
      
      setTimeout(() => {
        filterJobs(newFilters);
        setAnimatingJobs({});
        
        setVisibleJobs(willBeVisible);
      }, 300);
    }
  };

  const findJobIndex = (job: Job, allJobs: Job[]): number => {
    return allJobs.findIndex(j => 
      j.Title === job.Title && 
      j.Company === job.Company && 
      j.StartDate === job.StartDate
    );
  };

  const jobMatchesFilters = (job: Job, filters: string[]): boolean => {
    if (job.meta && filters.some(filter => job.meta?.includes(filter))) {
      return true;
    }
    
    if (job.Skills) {
      const jobSkills = job.Skills.toLowerCase().split(',').map((s: string) => s.trim());
      if (filters.some(filter => jobSkills.includes(filter.toLowerCase()))) {
        return true;
      }
    }
    
    return false;
  };

  const filterJobs = (filters: string[]) => {
    if (filters.length === 0) {
      setJobs(JSON.parse(stringData).data);
      return;
    }

    const tempJobs = JSON.parse(stringData).data;
    const filteredJobs = tempJobs.filter((job: Job) => jobMatchesFilters(job, filters));
    
    setJobs(filteredJobs);
  };

  const predefinedFilters = [
    "ml", "frontend", "backend", "cloud", "testing", 
    "javac", "javascript", "vue", "react", "python", "c#"
  ];

  const handleSkillClick = (skill: string) => {
    const strictMappings: {[key: string]: string} = {
      'javascript': 'javascript',
      'typescript': 'javascript',
      'react': 'react',
      'vue': 'vue',
      'python': 'python',
      'java': 'javac'
    };

    const skillLower = skill.toLowerCase();

    if (strictMappings[skillLower]) {
      changeFilter(strictMappings[skillLower]);
    } else {
      if (!dynamicFilters[skillLower]) {
        setDynamicFilters({
          ...dynamicFilters,
          [skillLower]: {
            filterValue: skillLower,
            displayText: skill
          }
        });
      }
      changeFilter(skillLower);
    }
  };
  
  const filterButton = (title: string, metaShort: string) => {
    const isActive = activeFilters.includes(metaShort);
    const style = `filter-button inline-block border border-primary-light p-2 rounded-lg shadow-button text-xs font-semibold tracking-wide ${
      isActive ? 'filter-button-active text-white' : 'bg-transparent text-white hover:text-primary-light'
    } transition-all duration-300`;
    
    return (
      <button
        key={metaShort}
        className={style}
        onClick={() => changeFilter(metaShort)}
      >
        {title}
      </button>
    );
  };

  const renderDynamicFilterButtons = () => {
    return Object.entries(dynamicFilters).map(([key, value]) => {
      if (!predefinedFilters.includes(key)) {
        return filterButton(value.displayText, value.filterValue);
      }
      return null;
    });
  };

  const toggleMobileFilters = () => {
    setMobileFiltersVisible(!mobileFiltersVisible);
  };

  const getSpinner = () => {
    return (
      <span className="ouro">
        <span className="left"><span className="anim"></span></span>
        <span className="right"><span className="anim"></span></span>
      </span>
    );
  }

  if(stringData.length === 0) {
    return getSpinner();
  }

  // Mobile layout classes that change based on scroll position
  const bioClasses = `w-full md:w-2/5 px-2 md:px-6 mb-6 md:mb-0 ${
    isScrolled ? 'md:block hidden' : 'block'
  } transition-all duration-300`;
  
  const jobsClasses = `flex flex-col w-full md:w-2/5 px-2 md:px-6 overflow-hidden ${
    isScrolled ? 'fixed inset-0 z-10 p-4 bg-background' : ''
  } transition-all duration-300`;

  return (
    <div className="flex flex-col md:flex-row canvas max-h-screen max-v-screen w-screen h-screen min-h-screen bg-fixed bg-cover bg-background p-4 md:p-6 overflow-hidden">
      {/* Bio section - Full width on mobile, 2/5 on desktop, hidden on scroll on mobile */}
      <div className={bioClasses}>
        <Bio/>
      </div>
      
      {/* Divider - Hidden on mobile */}
      <div className="hidden md:block md:w-1/5 flex items-center justify-center">
        <div className="h-4/5 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-primary/30 opacity-70 mx-auto"></div>
      </div>
      
      {/* Jobs section - Full width on mobile, 2/5 on desktop, expands to full screen on scroll */}
      <div className={jobsClasses}>
        {/* Mobile filter toggle button */}
        <button 
          className="md:hidden mb-4 p-3 bg-card-bg/50 rounded-lg text-white font-medium flex items-center justify-center"
          onClick={toggleMobileFilters}
        >
          <span>{mobileFiltersVisible ? 'Hide Filters' : 'Show Filters'}</span>
          <svg className={`ml-2 h-5 w-5 transition-transform duration-300 ${mobileFiltersVisible ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Filter buttons - Hidden on mobile unless toggled */}
        <div className={`text-white space-x-1 space-y-1 bg-card-bg/50 p-4 rounded-xl shadow-inner-glow mb-4 ${mobileFiltersVisible ? 'block' : 'hidden md:block'}`}>
          <div className="flex flex-wrap gap-2">
            {filterButton("Machine Learning / AI", "ml")}
            {filterButton("Frontend Development", "frontend")}
            {filterButton("Backend Development", "backend")}
            {filterButton("Cloud / AWS", "cloud")}
            {filterButton("Testing", "testing")}
            {filterButton("Java", "javac")}
            {filterButton("Javascript / Typescript", "javascript")}
            {filterButton("Vue", "vue")}
            {filterButton("React", "react")}
            {filterButton("Python", "python")}
            {filterButton("C#", "c#")}
            {renderDynamicFilterButtons()}
          </div>
        </div>

        {/* Jobs list - Scrollable container */}
        <div 
          ref={jobsContainerRef}
          className="flex-1 overflow-y-auto pr-2 pb-4 md:pb-0"
        >
          <div className="py-2">
            {jobs && jobs.map((item, index) => (
              <Card 
                key={`job-${index}`} 
                data={item} 
                onSkillClick={handleSkillClick}
                activeFilters={activeFilters}
                isAnimatingOut={animatingJobs[`job-${index}`] || false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
