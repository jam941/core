'use client';

import React, { useState, useEffect } from 'react';
import '../styles/App.css';
import { Job } from '../Interfaces/CardType';
import data from '../Data/data.json';
import Bio from './Bio';
import Card from './Card';

function App() {
  const [jobs, setJobs] = useState<Job[]>(data as Job[]);
  const [stringData] = useState<string>(JSON.stringify({ data }));
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [dynamicFilters, setDynamicFilters] = useState<{
    [key: string]: { filterValue: string; displayText: string };
  }>({});
  const [visibleJobs, setVisibleJobs] = useState<{ [key: string]: boolean }>({});
  const [animatingJobs, setAnimatingJobs] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const initialVisibility: { [key: string]: boolean } = {};
    jobs.forEach((job, index) => {
      initialVisibility[`job-${index}`] = true;
    });
    setVisibleJobs(initialVisibility);
  }, [jobs]);

  const changeFilter = (filterValue: string) => {
    if (activeFilters.includes(filterValue)) {
      const newFilters = activeFilters.filter((f) => f !== filterValue);
      setActiveFilters(newFilters);

      const tempJobs = JSON.parse(stringData).data;
      const newFilteredJobs =
        newFilters.length === 0
          ? tempJobs
          : tempJobs.filter((job: Job) => jobMatchesFilters(job, newFilters));

      const willBeVisible: { [key: string]: boolean } = {};
      newFilteredJobs.forEach((job: Job, index: number) => {
        willBeVisible[`job-${index}`] = true;
      });

      const animating: { [key: string]: boolean } = {};
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
      const newFilteredJobs = tempJobs.filter((job: Job) =>
        jobMatchesFilters(job, newFilters)
      );

      const willBeVisible: { [key: string]: boolean } = {};
      newFilteredJobs.forEach((job: Job) => {
        const jobId = findJobIndex(job, tempJobs);
        willBeVisible[`job-${jobId}`] = true;
      });

      const animating: { [key: string]: boolean } = {};
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
    return allJobs.findIndex(
      (j) =>
        j.Title === job.Title &&
        j.Company === job.Company &&
        j.StartDate === job.StartDate
    );
  };

  const jobMatchesFilters = (job: Job, filters: string[]): boolean => {
    if (job.meta && filters.some((filter) => job.meta?.includes(filter))) {
      return true;
    }

    if (job.Skills) {
      const jobSkills = job.Skills.toLowerCase().split(',').map((s: string) => s.trim());
      if (filters.some((filter) => jobSkills.includes(filter.toLowerCase()))) {
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
    'ml',
    'frontend',
    'backend',
    'cloud',
    'testing',
    'javac',
    'javascript',
    'vue',
    'react',
    'python',
    'c#',
  ];

  const handleSkillClick = (skill: string) => {
    const strictMappings: { [key: string]: string } = {
      javascript: 'javascript',
      typescript: 'javascript',
      react: 'react',
      vue: 'vue',
      python: 'python',
      java: 'javac',
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
            displayText: skill,
          },
        });
      }
      changeFilter(skillLower);
    }
  };

  const filterButton = (title: string, metaShort: string) => {
    const isActive = activeFilters.includes(metaShort);
    return (
      <button
        key={metaShort}
        type="button"
        className={`filter-chip${isActive ? ' filter-chip--active' : ''}`}
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
        <span className="left">
          <span className="anim"></span>
        </span>
        <span className="right">
          <span className="anim"></span>
        </span>
      </span>
    );
  };

  if (stringData.length === 0) {
    return getSpinner();
  }

  return (
    <div className="app-root">
      <div className="app-spacer-y" aria-hidden />
      <div className="app-bio">
        <Bio />
      </div>
      <div className="app-divider-wrap">
        <div
          className="app-divider-line app-divider-line--vertical app-divider-desktop"
          aria-hidden
        />
        <div
          className="app-divider-line app-divider-line--horizontal app-divider-mobile"
          aria-hidden
        />
      </div>
      <div className="app-jobs">
        <div className="filter-bar">
          <div className="filter-row">
            {filterButton('Machine Learning / AI', 'ml')}
            {filterButton('Frontend Development', 'frontend')}
            {filterButton('Backend Development', 'backend')}
            {filterButton('Cloud / AWS', 'cloud')}
            {filterButton('Testing', 'testing')}
            {filterButton('Java', 'javac')}
            {filterButton('Javascript / Typescript', 'javascript')}
            {filterButton('Vue', 'vue')}
            {filterButton('React', 'react')}
            {filterButton('Python', 'python')}
            {filterButton('C#', 'c#')}
            {renderDynamicFilterButtons()}
          </div>
        </div>
        <div className="app-jobs-scroll mobile-card-container">
          <div style={{ padding: '8px 0' }}>
            {jobs &&
              jobs.map((item, index) => (
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
      <div className="app-spacer-y" aria-hidden />
    </div>
  );
}

export default App;
