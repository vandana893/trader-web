import { BaseEntity } from './common';

export interface User extends BaseEntity {
  name: string;
  email: string;
  mobile?: string;
  status: 'active' | 'suspended';
  roles: string[];
}