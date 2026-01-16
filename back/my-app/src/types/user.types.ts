// src/types/user.types.ts
export interface IUser {
  id: number | string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * 用户基础接口
 */
export interface User {
  id: number | string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * 用户详情扩展接口
 */
export interface UserDetail extends User {
  phone?: string;
  address?: string;
  bio?: string;
  isActive?: boolean;
  role: UserRole;
}

/**
 * 用户角色 - 使用常量对象替代枚举
 */
export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
  EDITOR: 'editor',
} as const;

// 为 UserRole 添加类型定义
export type UserRole = typeof UserRole[keyof typeof UserRole];

/**
 * 用户登录请求接口
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * 用户登录响应接口
 */
export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
  refreshToken?: string;
}

/**
 * 用户注册请求接口
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * 用户更新信息接口
 */
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

/**
 * 用户分页查询参数
 */
export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

/**
 * 用户分页响应
 */
export interface UserPagination {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 用户统计信息
 */
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  userGrowthRate: number;
  rolesDistribution: Record<UserRole, number>;
}