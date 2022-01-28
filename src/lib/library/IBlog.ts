import { ScreenType, Permission } from 'nuudel-utils';

export interface IPostContent {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  _author: string;
  description?: string;
  content: string;
}

export interface ITagContent {
  slug: string;
  name: string;
}

export interface IPageContent {
  title: string;
  columns?: string[];
  listname?: string;
  filter?: string;
  type: ScreenType;
  header: boolean;
  icon?: string;
  content?: string;
  permission?: Permission;
}
