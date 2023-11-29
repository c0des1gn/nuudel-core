//import { ScreenType, Permission } from 'nuudel-utils';
import { IImage } from '../common/Interfaces';

interface ICore {
  _id: string;
  _createdby: string;
  _modifiedby: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface IPostContent extends ICore {
  title: string;
  publishdate?: Date;
  slug: string;
  content?: string;
  visibility?: boolean;
  allowcomment?: boolean;
  image?: IImage;
  tags: string[]; //ITagContent[];
  categories: string[];
  author: string;
  excerpt?: string;
}

export interface ITagContent {
  slug: string;
  name: string;
}

export interface IPageContent extends ICore {
  title: string;
  publishdate?: Date;
  slug: string;
  content?: string;
  visibility?: boolean;
  allowcomment?: boolean;
  image?: IImage;
  _parentId?: string;
}
