import { Client } from '@notionhq/client';
import type {
  PageObjectResponse,
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { Job } from '../Interfaces/CardType';
import { JobType } from '../Interfaces/JobTypeEnum';
import { parseJobsData } from './jobs';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID;

const notion = NOTION_API_KEY ? new Client({ auth: NOTION_API_KEY }) : null;

function isFullBlock(
  block: BlockObjectResponse | PartialBlockObjectResponse,
): block is BlockObjectResponse {
  return 'type' in block;
}

export function isFullPage(result: unknown): result is PageObjectResponse {
  return (
    typeof result === 'object' &&
    result !== null &&
    'properties' in result &&
    (result as unknown as { object: string }).object === 'page'
  );
}

export function getTitle(page: PageObjectResponse, name: string): string {
  const prop = page.properties[name];
  if (prop?.type === 'title') {
    return prop.title.map((t) => t.plain_text).join('');
  }
  return '';
}

export function getRichText(page: PageObjectResponse, name: string): string {
  const prop = page.properties[name];
  if (prop?.type === 'rich_text') {
    return prop.rich_text.map((t) => t.plain_text).join('');
  }
  return '';
}

function getSelect(page: PageObjectResponse, name: string): string {
  const prop = page.properties[name];
  if (prop?.type === 'select' && prop.select) {
    return prop.select.name;
  }
  return '';
}

function getMultiSelect(page: PageObjectResponse, name: string): string[] {
  const prop = page.properties[name];
  if (prop?.type === 'multi_select') {
    return prop.multi_select.map((s) => s.name);
  }
  return [];
}

interface RichTextSegment {
  plain_text: string;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  href: string | null;
}

function richTextToMarkdown(segments: RichTextSegment[]): string {
  return segments
    .map((rt) => {
      let text = rt.plain_text;
      if (!text) return '';
      if (rt.annotations.code) text = `\`${text}\``;
      if (rt.annotations.bold && rt.annotations.italic)
        text = `***${text}***`;
      else if (rt.annotations.bold) text = `**${text}**`;
      else if (rt.annotations.italic) text = `*${text}*`;
      if (rt.annotations.strikethrough) text = `~~${text}~~`;
      if (rt.href) text = `[${text}](${rt.href})`;
      return text;
    })
    .join('');
}

function getBlockText(block: BlockObjectResponse): string | null {
  const rich: RichTextSegment[] | undefined = (() => {
    switch (block.type) {
      case 'paragraph':           return block.paragraph.rich_text;
      case 'heading_1':           return block.heading_1.rich_text;
      case 'heading_2':           return block.heading_2.rich_text;
      case 'heading_3':           return block.heading_3.rich_text;
      case 'bulleted_list_item':  return block.bulleted_list_item.rich_text;
      case 'numbered_list_item':  return block.numbered_list_item.rich_text;
      case 'to_do':              return block.to_do.rich_text;
      case 'toggle':             return block.toggle.rich_text;
      case 'callout':            return block.callout.rich_text;
      case 'quote':              return block.quote.rich_text;
      default:                   return undefined;
    }
  })() as RichTextSegment[] | undefined;

  if (!rich) return null;
  return richTextToMarkdown(rich);
}


function blockToLinePrefix(block: BlockObjectResponse): string {
  switch (block.type) {
    case 'heading_1':          return '# ';
    case 'heading_2':          return '## ';
    case 'heading_3':          return '### ';
    case 'bulleted_list_item':
    case 'numbered_list_item':
    case 'to_do':
    case 'toggle':             return '- ';
    default:                   return '';
  }
}

async function fetchDescription(pageId: string): Promise<string> {
  if (!notion) return '';

  const response = await notion.blocks.children.list({ block_id: pageId });
  const topBlocks = response.results.filter(isFullBlock);

  const listTypes = new Set([
    'bulleted_list_item',
    'numbered_list_item',
    'to_do',
    'toggle',
  ]);

  const enriched = await Promise.all(
    topBlocks.map(async (block) => {
      let children: BlockObjectResponse[] = [];
      if (block.has_children && listTypes.has(block.type)) {
        const childResp = await notion.blocks.children.list({
          block_id: block.id,
        });
        children = childResp.results.filter(isFullBlock);
      }
      return { block, children };
    }),
  );

  const lines: string[] = [];

  for (const { block, children } of enriched) {
    const text = getBlockText(block);
    if (text === null) continue;

    const prefix = blockToLinePrefix(block);
    if (text.trim()) lines.push(`${prefix}${text}`);

    for (const child of children) {
      const childText = getBlockText(child);
      if (childText?.trim()) {
        const childPrefix = blockToLinePrefix(child);
        lines.push(`  ${childPrefix}${childText}`);
      }
    }
  }

  return lines.join('\n');
}

function notionPageToJob(
  page: PageObjectResponse,
  description: string,
): Job {
  const typeStr = getSelect(page, 'Type');
  const validTypes = new Set<string>(Object.values(JobType));
  const type = validTypes.has(typeStr)
    ? (typeStr as JobType)
    : JobType.FullTime;

  const skills = getMultiSelect(page, 'Skills');
  const tags = getMultiSelect(page, 'Tags');

  return {
    Type: type,
    Title: getRichText(page, 'Job Title'),
    Company: getTitle(page, 'Company'),
    Description: description,
    Skills: skills.join(', '),
    StartDate: getRichText(page, 'Start Date'),
    EndDate: getRichText(page, 'End Date'),
    Brief: getRichText(page, 'Brief'),
    meta: tags.length > 0 ? tags.join(' ') : undefined,
  };
}


const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3,
  may: 4, june: 5, july: 6, august: 7,
  september: 8, october: 9, november: 10, december: 11,
};

function parseStartDate(dateStr: string): number {
  const parts = dateStr.trim().toLowerCase().split(/\s+/);
  if (parts.length !== 2) return 0;
  const month = MONTHS[parts[0]] ?? 0;
  const year = parseInt(parts[1], 10) || 0;
  return year * 12 + month;
}

function sortByStartDateDesc(jobs: Job[]): Job[] {
  return [...jobs].sort(
    (a, b) => parseStartDate(b.StartDate) - parseStartDate(a.StartDate),
  );
}

async function fetchFromNotion(): Promise<Job[]> {
  if (!notion || !DATA_SOURCE_ID) {
    throw new Error('Notion credentials not configured');
  }

  const response = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
  });

  const pages = response.results.filter(isFullPage);

  const jobs = await Promise.all(
    pages.map(async (page: PageObjectResponse) => {
      const description = await fetchDescription(page.id);
      return notionPageToJob(page, description);
    }),
  );

  return sortByStartDateDesc(parseJobsData(jobs));
}

export async function fetchJobs(): Promise<Job[]> {
  if (!notion || !DATA_SOURCE_ID) {
    console.warn(
      'NOTION_API_KEY or NOTION_DATA_SOURCE_ID not set — using static data.json fallback',
    );
    const data = (await import('../Data/data.json')).default;
    return sortByStartDateDesc(parseJobsData(data as unknown));
  }

  try {
    return await fetchFromNotion();
  } catch (error) {
    console.error('Failed to fetch from Notion, falling back to static data:', error);
    const data = (await import('../Data/data.json')).default;
    return sortByStartDateDesc(parseJobsData(data as unknown));
  }
}
