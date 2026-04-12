import { Client } from '@notionhq/client';
import type {
  PageObjectResponse,
  BlockObjectResponse,
  PartialBlockObjectResponse,
  RichTextItemResponse,
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

function isFullPage(result: unknown): result is PageObjectResponse {
  return (
    typeof result === 'object' &&
    result !== null &&
    'properties' in result &&
    (result as unknown as { object: string }).object === 'page'
  );
}


function getTitle(page: PageObjectResponse, name: string): string {
  const prop = page.properties[name];
  if (prop?.type === 'title') {
    return prop.title.map((t) => t.plain_text).join('');
  }
  return '';
}

function getRichText(page: PageObjectResponse, name: string): string {
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

function richTextItemsToMarkdown(items: RichTextItemResponse[]): string {
  return items
    .map((rt) => {
      let text = rt.plain_text;
      if (!text) return '';
      const { bold, italic, strikethrough, code } = rt.annotations;
      if (code) {
        text = `\`${text.replace(/`/g, '\\`')}\``;
      } else {
        if (bold && italic) text = `***${text}***`;
        else if (bold) text = `**${text}**`;
        else if (italic) text = `*${text}*`;
      }
      if (strikethrough) text = `~~${text}~~`;
      if (rt.href) text = `[${text}](${rt.href})`;
      return text;
    })
    .join('');
}

function escapeTableCell(s: string): string {
  return s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function fencedCodeBlock(code: string, language: string): string {
  const body = code.replace(/\n+$/, '');
  let fence = '```';
  while (body.includes(fence)) {
    fence += '`';
  }
  const lang = language && language !== 'plain text' ? language : '';
  return `${fence}${lang}\n${body}\n${fence}`;
}

function mediaUrl(
  media:
    | { type: 'external'; external: { url: string } }
    | { type: 'file'; file: { url: string } },
): string | null {
  if (media.type === 'external') return media.external.url;
  if (media.type === 'file') return media.file.url;
  return null;
}

async function listAllChildren(blockId: string): Promise<BlockObjectResponse[]> {
  if (!notion) return [];
  const out: BlockObjectResponse[] = [];
  let cursor: string | undefined;
  for (;;) {
    const resp = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    });
    out.push(...resp.results.filter(isFullBlock));
    if (!resp.has_more) break;
    cursor = resp.next_cursor ?? undefined;
    if (!cursor) break;
  }
  return out;
}

async function blockToMarkdownLines(
  block: BlockObjectResponse,
  depth: number,
): Promise<string[]> {
  const ind = '  '.repeat(depth);
  const out: string[] = [];

  const appendChildren = async (blockId: string, childDepth: number) => {
    const kids = await listAllChildren(blockId);
    for (const kid of kids) {
      out.push(...(await blockToMarkdownLines(kid, childDepth)));
    }
  };

  const prefixBlockquoteLines = (lines: string[]) => {
    for (const line of lines) {
      if (!line.trim()) out.push(`${ind}> `);
      else out.push(`${ind}> ${line}`);
    }
  };

  switch (block.type) {
    case 'paragraph': {
      const md = richTextItemsToMarkdown(block.paragraph.rich_text);
      if (md.trim()) out.push(`${ind}${md}`);
      if (block.has_children) await appendChildren(block.id, depth);
      break;
    }
    case 'heading_1': {
      const md = richTextItemsToMarkdown(block.heading_1.rich_text);
      if (md.trim()) out.push(`${ind}# ${md}`);
      if (block.has_children) await appendChildren(block.id, depth);
      break;
    }
    case 'heading_2': {
      const md = richTextItemsToMarkdown(block.heading_2.rich_text);
      if (md.trim()) out.push(`${ind}## ${md}`);
      if (block.has_children) await appendChildren(block.id, depth);
      break;
    }
    case 'heading_3': {
      const md = richTextItemsToMarkdown(block.heading_3.rich_text);
      if (md.trim()) out.push(`${ind}### ${md}`);
      if (block.has_children) await appendChildren(block.id, depth);
      break;
    }
    case 'heading_4': {
      const md = richTextItemsToMarkdown(block.heading_4.rich_text);
      if (md.trim()) out.push(`${ind}#### ${md}`);
      if (block.has_children) await appendChildren(block.id, depth);
      break;
    }
    case 'bulleted_list_item': {
      const md = richTextItemsToMarkdown(block.bulleted_list_item.rich_text);
      if (md.trim()) out.push(`${ind}- ${md}`);
      if (block.has_children) await appendChildren(block.id, depth + 1);
      break;
    }
    case 'numbered_list_item': {
      const md = richTextItemsToMarkdown(block.numbered_list_item.rich_text);
      if (md.trim()) out.push(`${ind}1. ${md}`);
      if (block.has_children) await appendChildren(block.id, depth + 1);
      break;
    }
    case 'to_do': {
      const md = richTextItemsToMarkdown(block.to_do.rich_text);
      const mark = block.to_do.checked ? 'x' : ' ';
      if (md.trim()) out.push(`${ind}- [${mark}] ${md}`);
      else out.push(`${ind}- [${mark}]`);
      if (block.has_children) await appendChildren(block.id, depth + 1);
      break;
    }
    case 'toggle': {
      const md = richTextItemsToMarkdown(block.toggle.rich_text);
      if (md.trim()) out.push(`${ind}- ${md}`);
      if (block.has_children) await appendChildren(block.id, depth + 1);
      break;
    }
    case 'quote': {
      const md = richTextItemsToMarkdown(block.quote.rich_text);
      if (md.trim()) out.push(`${ind}> ${md}`);
      if (block.has_children) {
        const kids = await listAllChildren(block.id);
        for (const k of kids) {
          const inner = await blockToMarkdownLines(k, depth);
          prefixBlockquoteLines(inner);
        }
      }
      break;
    }
    case 'callout': {
      let icon = '';
      const ic = block.callout.icon;
      if (ic?.type === 'emoji') icon = `${ic.emoji} `;
      else if (ic?.type === 'file') icon = '📎 ';
      const md = richTextItemsToMarkdown(block.callout.rich_text);
      if (md.trim()) out.push(`${ind}> ${icon}${md}`);
      else if (icon) out.push(`${ind}> ${icon.trimEnd()}`);
      if (block.has_children) {
        const kids = await listAllChildren(block.id);
        for (const k of kids) {
          const inner = await blockToMarkdownLines(k, depth);
          prefixBlockquoteLines(inner);
        }
      }
      break;
    }
    case 'code': {
      const body = richTextItemsToMarkdown(block.code.rich_text);
      const fence = fencedCodeBlock(body, block.code.language || '');
      for (const line of fence.split('\n')) {
        out.push(`${ind}${line}`);
      }
      break;
    }
    case 'divider': {
      out.push(`${ind}---`);
      break;
    }
    case 'equation': {
      const expr = block.equation.expression;
      const fence = fencedCodeBlock(expr, '');
      for (const line of fence.split('\n')) {
        out.push(`${ind}${line}`);
      }
      break;
    }
    case 'image': {
      const url = mediaUrl(block.image);
      const alt = escapeTableCell(
        richTextItemsToMarkdown(block.image.caption) || 'Image',
      );
      if (url) out.push(`${ind}![${alt}](${url})`);
      break;
    }
    case 'video': {
      const media = block.video;
      const url = mediaUrl(media);
      const cap = richTextItemsToMarkdown(media.caption);
      const label = cap.trim() || 'video';
      if (url) out.push(`${ind}[${label}](${url})`);
      break;
    }
    case 'pdf': {
      const media = block.pdf;
      const url = mediaUrl(media);
      const cap = richTextItemsToMarkdown(media.caption);
      const label = cap.trim() || 'PDF';
      if (url) out.push(`${ind}[${label}](${url})`);
      break;
    }
    case 'audio': {
      const media = block.audio;
      const url = mediaUrl(media);
      const cap = richTextItemsToMarkdown(media.caption);
      const label = cap.trim() || 'audio';
      if (url) out.push(`${ind}[${label}](${url})`);
      break;
    }
    case 'file': {
      const f = block.file;
      const url =
        f.type === 'external' ? f.external.url : f.file.url;
      const name =
        f.name?.trim() ||
        richTextItemsToMarkdown(f.caption).trim() ||
        'File';
      out.push(`${ind}[${name}](${url})`);
      break;
    }
    case 'bookmark': {
      const cap = richTextItemsToMarkdown(block.bookmark.caption);
      const label = cap.trim() || block.bookmark.url;
      out.push(`${ind}[${label}](${block.bookmark.url})`);
      break;
    }
    case 'embed': {
      const cap = richTextItemsToMarkdown(block.embed.caption);
      const label = cap.trim() || block.embed.url;
      out.push(`${ind}[${label}](${block.embed.url})`);
      break;
    }
    case 'link_preview': {
      out.push(`${ind}[${block.link_preview.url}](${block.link_preview.url})`);
      break;
    }
    case 'link_to_page': {
      const ltp = block.link_to_page;
      if (ltp.type === 'page_id') {
        const raw = ltp.page_id.replace(/-/g, '');
        out.push(`${ind}[View in Notion](https://www.notion.so/${raw})`);
      } else if (ltp.type === 'database_id') {
        const raw = ltp.database_id.replace(/-/g, '');
        out.push(`${ind}[View database in Notion](https://www.notion.so/${raw})`);
      }
      break;
    }
    case 'child_page': {
      const title = block.child_page.title || 'Untitled';
      out.push(`${ind}**${title}**`);
      if (block.has_children) await appendChildren(block.id, depth + 1);
      break;
    }
    case 'child_database': {
      const title = block.child_database.title || 'Database';
      out.push(`${ind}**${title}**`);
      break;
    }
    case 'table': {
      const rows = await listAllChildren(block.id);
      const mdRows: string[][] = [];
      for (const row of rows) {
        if (row.type !== 'table_row') continue;
        mdRows.push(
          row.table_row.cells.map((cell) =>
            escapeTableCell(richTextItemsToMarkdown(cell)),
          ),
        );
      }
      if (mdRows.length === 0) break;
      const ncols = Math.max(...mdRows.map((r) => r.length), 1);
      const padRow = (cells: string[]) => {
        const row = [...cells];
        while (row.length < ncols) row.push('');
        return row;
      };
      const sepRow = (r: string[]) =>
        `${ind}| ${r.map(() => '---').join(' | ')} |`;

      if (mdRows.length === 1) {
        const r = padRow(mdRows[0]);
        out.push(`${ind}| ${r.join(' | ')} |`);
        out.push(sepRow(r));
        break;
      }

      if (block.table.has_column_header) {
        const h = padRow(mdRows[0]);
        out.push(`${ind}| ${h.join(' | ')} |`);
        out.push(sepRow(h));
        for (let i = 1; i < mdRows.length; i++) {
          const r = padRow(mdRows[i]);
          out.push(`${ind}| ${r.join(' | ')} |`);
        }
      } else {
        for (const raw of mdRows) {
          out.push(`${ind}${padRow(raw).join(' · ')}`);
        }
      }
      break;
    }
    case 'column_list':
    case 'column':
    case 'tab':
    case 'synced_block':
    case 'template': {
      if (block.has_children) await appendChildren(block.id, depth);
      break;
    }
    case 'table_row':
      break;
    default:
      break;
  }

  return out;
}

async function fetchDescription(pageId: string): Promise<string> {
  if (!notion) return '';

  const top = await listAllChildren(pageId);
  const lines: string[] = [];
  for (const block of top) {
    lines.push(...(await blockToMarkdownLines(block, 0)));
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
