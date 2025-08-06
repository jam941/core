import { JobType } from "./JobTypeEnum";

export interface Job {
    Type: JobType;
    Company: string;
    Title: string;
    StartDate: string;
    EndDate: string;
    Brief: string;
    Description: string;
    Skills: string;
    meta?: string;
}
