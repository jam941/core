import { Job } from '../Interfaces/CardType';
import { JobType } from '../Interfaces/JobTypeEnum';

const JOB_TYPES = new Set<string>(Object.values(JobType));

function isJob(x: unknown): x is Job {
  if (x === null || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.Type === 'string' &&
    JOB_TYPES.has(o.Type) &&
    typeof o.Company === 'string' &&
    typeof o.Title === 'string' &&
    typeof o.StartDate === 'string' &&
    typeof o.EndDate === 'string' &&
    typeof o.Brief === 'string' &&
    typeof o.Description === 'string' &&
    typeof o.Skills === 'string' &&
    (o.meta === undefined || typeof o.meta === 'string')
  );
}

export function parseJobsData(raw: unknown): Job[] {
  if (!Array.isArray(raw)) {
    console.warn('jobs data is not an array');
    return [];
  }
  return raw.filter((item, i) => {
    if (isJob(item)) return true;
    console.warn(`job row ${i} skipped: invalid shape`);
    return false;
  });
}

/** Stable id for list keys and visibility maps (matches prior Title+Company+StartDate identity, plus EndDate). */
export function jobId(job: Job): string {
  return [job.Title, job.Company, job.StartDate, job.EndDate].join('\u0000');
}
