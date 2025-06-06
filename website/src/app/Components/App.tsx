
'use client';

import React, { useState, useEffect } from 'react';
import '../styles/App.css';
import { Job } from '../Interfaces/CardType'; 
import data from '../Data/data.json'
import Bio from './Bio';
import Card from './Card';

function App() {
  const [jobs, setJobs] = useState<Job[]>(data);
  const [stringData] = useState<string>(JSON.stringify({data}));
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [dynamicFilters, setDynamicFilters] = useState<{[key: string]: {filterValue: string, displayText: string}}>({});
  const [visibleJobs, setVisibleJobs] = useState<{[key: string]: boolean}>({});
  const [animatingJobs, setAnimatingJobs] = useState<{[key: string]: boolean}>({});
  const [windowDimensions, setWindowDimensions] = useState<{width: number, height: number}>(
    { width: 1200, height: 800 }
  );
  
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isMounted) {
      const handleResize = () => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      
      handleResize();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      };
    }
  }, [isMounted]);
  
  useEffect(() => {
    const initialVisibility: {[key: string]: boolean} = {};
    jobs.forEach((job, index) => {
      initialVisibility[`job-${index}`] = true;
    });
    setVisibleJobs(initialVisibility);
  }, [jobs]);

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
      newFilteredJobs.forEach((job: Job) => {
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
      cursor: 'pointer',
      flexShrink: 0,
      whiteSpace: 'nowrap'
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

  const getSpinner = () => {
    return (
      <span className="ouro">
        <span className="left"><span className="anim"></span></span>
        <span className="right"><span className="anim"></span></span>
      </span>
    );
  }

  const isMobile = (() => {
    if (!isMounted) return false;
    
    const isNarrowViewport = windowDimensions.width < 1024;
    
    const hasMobileUserAgent = 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    
    return isNarrowViewport || hasMobileUserAgent;
  })();
  
  if(stringData.length === 0) {
    return getSpinner();
  }

  const layoutStyles = {
    display: 'flex',
    flexDirection: isMounted ? (isMobile ? 'column' as const : 'row' as const) : 'row' as const,
    width: '100%',
    height: '100vh', 
    overflow: 'hidden' as const, 
    overflowX: 'hidden' as const,
    backgroundColor: '#1a1e24',
    padding: '0',
    boxSizing: 'border-box' as const
  };

  return (
    <div 
      className={isMounted && isMobile ? 'force-mobile-layout' : ''} 
      style={layoutStyles}>
      {/* Left/Top margin */}
      <div style={{
        width: isMounted ? (isMobile ? '100%' : '5%') : '5%',
        height: isMounted ? (isMobile ? '20px' : 'auto') : 'auto'
      }}></div>
      
      {/* Bio section */}
      <div style={{
        width: isMounted ? (isMobile ? '90%' : '40%') : '40%',
        margin: isMounted ? (isMobile ? '0 auto' : '0') : '0',
        marginBottom: isMounted ? (isMobile ? '20px' : '0') : '0'
      }}>
        <Bio/>
      </div>
      
      {/* Divider - horizontal for mobile, vertical for desktop */}
      <div style={{
        width: isMounted ? (isMobile ? '90%' : '10%') : '10%',
        height: 'auto',
        margin: isMounted ? (isMobile ? '10px auto' : '0') : '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          height: isMounted ? (isMobile ? '1px' : '90%') : '90%',
          width: isMounted ? (isMobile ? '100%' : '1px') : '1px',
          background: isMounted && isMobile
            ? 'linear-gradient(to right, rgba(59, 130, 246, 0.4), rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.4))'
            : 'linear-gradient(to bottom, rgba(59, 130, 246, 0.4), rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.4))',
          opacity: 0.8
        }}></div>
      </div>
      
      {/* Jobs section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: isMounted ? (isMobile ? '90%' : '40%') : '40%',
        margin: isMounted ? (isMobile ? '0 auto' : '0') : '0',
        overflowX: 'hidden',
        flex: isMounted && isMobile ? '1' : 'none', 
        minHeight: isMounted && isMobile ? '0' : 'auto' 
      }}>
        {/* Filter buttons section */}
        <div style={{ color: 'white', backgroundColor: 'rgba(30, 33, 39, 0.5)', padding: isMobile ? '12px 16px 8px 16px' : '16px', borderRadius: '12px', marginBottom: '16px', boxShadow: 'inset 0 2px 4px 0 rgba(59, 130, 246, 0.06)', maxWidth: '100%', overflowX: isMobile ? 'auto' : 'hidden' }}>
          <div className={isMounted && isMobile ? 'filter-buttons-container' : ''} style={{ display: 'flex', flexWrap: isMobile ? 'nowrap' : 'wrap', gap: '8px', width: isMobile ? 'max-content' : '100%' }}>
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
        <div className={isMounted && isMobile ? 'mobile-card-container' : ''} style={{ 
          flex: 1, 
          overflowY: 'auto', 
          overflowX: 'hidden',
          paddingRight: '8px', 
          paddingBottom: '16px',
          maxHeight: isMounted ? (isMobile ? 'none' : 'calc(100vh - 150px)') : 'calc(100vh - 150px)' 
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
      
      {/* Right/Bottom margin */}
      <div style={{
        width: isMounted ? (isMobile ? '100%' : '5%') : '5%',
        height: isMounted ? (isMobile ? '20px' : 'auto') : 'auto'
      }}></div>
    </div>
  );
}

export default App;
