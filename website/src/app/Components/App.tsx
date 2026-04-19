'use client';

import React, { useState, useEffect, useRef } from 'react';
import '../styles/App.css';
import { Job } from '../Interfaces/CardType';
import Bio from './Bio';
import Card from './Card';
import { jobId, sortJobsForDisplay } from '../lib/jobs';

interface AppProps {
  initialJobs: Job[];
}

/** Keep in sync with `card-fade-out` in App.css / Card.tsx (0.4s). */
const FILTER_TRANSITION_MS = 400;

function buildVisibilityMap(filteredJobs: Job[]): Record<string, boolean> {
  const m: Record<string, boolean> = {};
  for (const job of filteredJobs) {
    m[jobId(job)] = true;
  }
  return m;
}

function buildAnimatingOut(
  prevVisible: Record<string, boolean>,
  nextVisible: Record<string, boolean>,
  currentJobs: Job[]
): Record<string, boolean> {
  const animating: Record<string, boolean> = {};
  for (const job of currentJobs) {
    const id = jobId(job);
    if (prevVisible[id] && !nextVisible[id]) {
      animating[id] = true;
    }
  }
  return animating;
}

function App({ initialJobs }: AppProps) {
  const [jobs, setJobs] = useState<Job[]>(() => sortJobsForDisplay([...initialJobs]));
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [dynamicFilters, setDynamicFilters] = useState<{
    [key: string]: { filterValue: string; displayText: string };
  }>({});
  const [visibleJobs, setVisibleJobs] = useState<Record<string, boolean>>({});
  const [animatingJobs, setAnimatingJobs] = useState<Record<string, boolean>>({});
  const filterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleFilterUpdate = (fn: () => void) => {
    if (filterTimeoutRef.current !== null) {
      clearTimeout(filterTimeoutRef.current);
    }
    filterTimeoutRef.current = setTimeout(() => {
      filterTimeoutRef.current = null;
      fn();
    }, FILTER_TRANSITION_MS);
  };

  useEffect(() => {
    return () => {
      if (filterTimeoutRef.current !== null) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const initialVisibility: Record<string, boolean> = {};
    jobs.forEach((job) => {
      initialVisibility[jobId(job)] = true;
    });
    setVisibleJobs(initialVisibility);
  }, [jobs]);

  // Multiple active filters use OR semantics: a job matches if ANY active filter matches.
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
      setJobs(sortJobsForDisplay([...initialJobs]));
      return;
    }

    setJobs(
      sortJobsForDisplay(initialJobs.filter((job) => jobMatchesFilters(job, filters)))
    );
  };

  const changeFilter = (filterValue: string) => {
    if (activeFilters.includes(filterValue)) {
      const newFilters = activeFilters.filter((f) => f !== filterValue);
      setActiveFilters(newFilters);

      const newFilteredJobs =
        newFilters.length === 0
          ? initialJobs
          : initialJobs.filter((job) => jobMatchesFilters(job, newFilters));

      const willBeVisible = buildVisibilityMap(newFilteredJobs);
      const animating = buildAnimatingOut(visibleJobs, willBeVisible, jobs);

      setAnimatingJobs(animating);

      scheduleFilterUpdate(() => {
        if (newFilters.length === 0) {
          setJobs(sortJobsForDisplay([...initialJobs]));
        } else {
          filterJobs(newFilters);
        }
        setAnimatingJobs({});
        setVisibleJobs(willBeVisible);
      });
    } else {
      const newFilters = [...activeFilters, filterValue];
      setActiveFilters(newFilters);

      const newFilteredJobs = initialJobs.filter((job) =>
        jobMatchesFilters(job, newFilters)
      );

      const willBeVisible = buildVisibilityMap(newFilteredJobs);
      const animating = buildAnimatingOut(visibleJobs, willBeVisible, jobs);

      setAnimatingJobs(animating);

      scheduleFilterUpdate(() => {
        filterJobs(newFilters);
        setAnimatingJobs({});
        setVisibleJobs(willBeVisible);
      });
    }
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
        aria-pressed={isActive}
        onClick={() => changeFilter(metaShort)}
      >
        {title}
      </button>
    );
  };

  const renderDynamicFilterButtons = () => {
    return Object.entries(dynamicFilters)
      .filter(([key]) => !predefinedFilters.includes(key))
      .map(([, value]) => filterButton(value.displayText, value.filterValue));
  };

  if (initialJobs.length === 0) {
    return (
      <div className="app-root">
        <p>No roles to display.</p>
      </div>
    );
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
            {filterButton('Leadership', 'leadership')}
            {filterButton('Java', 'javac')}
            {filterButton('Javascript / Typescript', 'javascript')}
            {filterButton('Vue', 'vue')}
            {filterButton('React', 'react')}
            {filterButton('Python', 'python')}
            {filterButton('C#', 'c#')}
            {filterButton('Golang', 'go')}
            {}
            {renderDynamicFilterButtons()}
          </div>
        </div>
        <div className="app-jobs-scroll mobile-card-container">
          <div className="app-jobs-scroll-inner">
            {jobs.map((item) => (
              <Card
                key={jobId(item)}
                data={item}
                onSkillClick={handleSkillClick}
                activeFilters={activeFilters}
                isAnimatingOut={animatingJobs[jobId(item)] ?? false}
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
