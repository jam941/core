import { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { cache } from 'react';
import { getRichText, getTitle, isFullPage } from './notion';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const BLOG_DATA_SOURCE_ID = process.env.NOTION_BLOG_DATA_SOURCE_ID;

const notion = NOTION_API_KEY ? new Client({ auth: NOTION_API_KEY }) : null;

/** Notion database column names — override via env if yours differ */
const PROP_TITLE = process.env.NOTION_BLOG_TITLE_PROPERTY ?? 'Name';
const PROP_PUBLISHED = process.env.NOTION_BLOG_PUBLISHED_PROPERTY ?? 'Published';
const PROP_SLUG = process.env.NOTION_BLOG_SLUG_PROPERTY ?? 'Slug';
const PROP_DATE = process.env.NOTION_BLOG_DATE_PROPERTY ?? 'Date';

export type BlogPostListItem = {
  slug: string;
  title: string;
  date: string | null;
  pageId: string;
};

export type BlogPost = BlogPostListItem & {
  markdown: string;
  truncated: boolean;
};

function getDate(page: PageObjectResponse, name: string): string | null {
  const prop = page.properties[name];
  if (prop?.type === 'date' && prop.date?.start) {
    return prop.date.start;
  }
  return null;
}

function slugify(input: string): string {
  const s = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
  return s || 'post';
}

function slugFromPage(page: PageObjectResponse, title: string): string {
  const manual = getRichText(page, PROP_SLUG).trim();
  if (manual) {
    const s = manual
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    if (s) return s;
  }
  return slugify(title);
}

function displayDate(page: PageObjectResponse): string | null {
  const fromProp = getDate(page, PROP_DATE);
  if (fromProp) return fromProp;
  return page.created_time.split('T')[0] ?? null;
}

function uniqueSlug(base: string, used: Set<string>): string {
  if (!used.has(base)) {
    used.add(base);
    return base;
  }
  let i = 2;
  let candidate = `${base}-${i}`;
  while (used.has(candidate)) {
    i += 1;
    candidate = `${base}-${i}`;
  }
  used.add(candidate);
  return candidate;
}

async function queryPublishedPages(): Promise<PageObjectResponse[]> {
  if (!notion || !BLOG_DATA_SOURCE_ID) return [];

  const out: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: BLOG_DATA_SOURCE_ID,
      filter: {
        property: PROP_PUBLISHED,
        checkbox: { equals: true },
      },
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      start_cursor: cursor,
      page_size: 100,
    });

    const pages = response.results.filter(isFullPage);
    out.push(...pages);
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return out;
}

function pagesToSlugMap(pages: PageObjectResponse[]): Map<string, PageObjectResponse> {
  const used = new Set<string>();
  const map = new Map<string, PageObjectResponse>();

  for (const page of pages) {
    const title = getTitle(page, PROP_TITLE);
    const base = slugFromPage(page, title) || slugify(title);
    const slug = uniqueSlug(base, used);
    map.set(slug, page);
  }

  return map;
}

export function isBlogDataSourceConfigured(): boolean {
  return Boolean(notion && BLOG_DATA_SOURCE_ID);
}

export async function fetchBlogIndex(): Promise<BlogPostListItem[]> {
  if (!isBlogDataSourceConfigured()) return [];

  try {
    const pages = await queryPublishedPages();
    const slugMap = pagesToSlugMap(pages);

    return [...slugMap.entries()].map(([slug, page]) => ({
      slug,
      title: getTitle(page, PROP_TITLE) || 'Untitled',
      date: displayDate(page),
      pageId: page.id,
    }));
  } catch (e) {
    console.error('Notion blog index failed:', e);
    return [];
  }
}

export const fetchBlogPost = cache(async function fetchBlogPost(
  slug: string,
): Promise<BlogPost | null> {
  if (!notion || !BLOG_DATA_SOURCE_ID) return null;

  try {
    const pages = await queryPublishedPages();
    const slugMap = pagesToSlugMap(pages);
    const page = slugMap.get(slug);
    if (!page) return null;

    const md = await notion.pages.retrieveMarkdown({ page_id: page.id });
    const title = getTitle(page, PROP_TITLE) || 'Untitled';

    return {
      slug,
      title,
      date: displayDate(page),
      pageId: page.id,
      markdown: md.markdown,
      truncated: md.truncated,
    };
  } catch (e) {
    console.error('Notion blog post failed:', e);
    return null;
  }
});
