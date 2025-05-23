
'use client';

import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import '../styles/App.css';
import { Job } from '../Interfaces/CardType'; 
import data from '../Data/data.json'
import Bio from './Bio';
import Card from './Card';

function App() {
  const [jobs, setJobs] = useState<Job[]>(data);
  const [stringData, setStringData] = useState<string>(JSON.stringify({data}));
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [dynamicFilters, setDynamicFilters] = useState<{[key: string]: {filterValue: string, displayText: string}}>({});
  const [visibleJobs, setVisibleJobs] = useState<{[key: string]: boolean}>({});
  const [animatingJobs, setAnimatingJobs] = useState<{[key: string]: boolean}>({});
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);
  
  useEffect(() => {
    const initialVisibility: {[key: string]: boolean} = {};
    jobs.forEach((job, index) => {
      initialVisibility[`job-${index}`] = true;
    });
    setVisibleJobs(initialVisibility);
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
    
    const buttonStyle = {
      display: 'inline-block',
      border: '1px solid #60A5FA',
      padding: '8px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(59, 130, 246, 0.1), 0 1px 2px 0 rgba(59, 130, 246, 0.06)',
      fontSize: '12px',
      fontWeight: 600,
      letterSpacing: '0.05em',
      color: isActive ? 'white' : 'white',
      background: isActive ? 'linear-gradient(135deg, #3B82F6, #2563EB)' : 'transparent',
      transition: 'all 0.3s',
      margin: '4px',
      cursor: 'pointer'
    };
    
    return (
      <button
        key={metaShort}
        style={buttonStyle}
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

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'row', 
      width: '100%', 
      height: '100vh', 
      overflow: 'hidden', 
      overflowX: 'hidden', 
      backgroundColor: '#1a1e24', 
      padding: '0', 
      boxSizing: 'border-box' 
    }}>
      {/* Left 5% margin */}
      <div style={{ width: '5%' }}></div>
      
      {/* Bio section - 40% */}
      <div style={{ width: '40%' }}>
        <Bio/>
      </div>
      
      {/* Middle 10% with centered divider */}
      <div style={{ 
        width: '10%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          height: '90%', 
          width: '1px', 
          background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.4), rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.4))', 
          opacity: 0.8 
        }}></div>
      </div>
      
      {/* Jobs section - 40% */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        width: '40%', 
        overflowX: 'hidden' 
      }}>
        {/* Filter buttons section */}
        <div style={{ color: 'white', backgroundColor: 'rgba(30, 33, 39, 0.5)', padding: '16px', borderRadius: '12px', marginBottom: '16px', boxShadow: 'inset 0 2px 4px 0 rgba(59, 130, 246, 0.06)', maxWidth: '100%', overflowX: 'hidden' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          overflowX: 'hidden',
          paddingRight: '8px', 
          paddingBottom: '16px',
          maxHeight: 'calc(100vh - 150px)' // Adjust this value based on the height of your filter buttons
        }}>
          <div style={{ padding: '8px 0' }}>
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
      
      {/* Right 5% margin */}
      <div style={{ width: '5%' }}></div>
    </div>
  );
}

export default App;
