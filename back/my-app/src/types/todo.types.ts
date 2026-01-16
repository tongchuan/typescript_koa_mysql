// src/types/todo.types.ts
export interface ITodo {
  id: number | string;
  title: string;
  description?: string;
  dueDate?: Date | string;
  completedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: number | string;
}

/**
 * 待办事项状态 - 使用常量对象替代枚举
 */
export const TodoStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// 为 TodoStatus 添加类型定义
export type TodoStatus = typeof TodoStatus[keyof typeof TodoStatus];

/**
 * 待办事项优先级 - 使用常量对象替代枚举
 */
export const TodoPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

// 为 TodoPriority 添加类型定义
export type TodoPriority = typeof TodoPriority[keyof typeof TodoPriority];

/**
 * 待办事项标签
 */
export interface TodoTag {
  id: number | string;
  name: string;
  color: string;
}

/**
 * 待办事项基础接口
 */
export interface Todo {
  id: number | string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: Date | string;
  completedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: number | string;
  tags?: TodoTag[];
}

/**
 * 创建待办事项请求
 */
export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: TodoPriority;
  dueDate?: Date | string;
  tags?: string[];
}

/**
 * 更新待办事项请求
 */
export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: Date | string;
  tags?: string[];
}

/**
 * 待办事项查询参数
 */
export interface TodoQueryParams {
  page?: number;
  limit?: number;
  status?: TodoStatus;
  priority?: TodoPriority;
  userId?: number | string;
  search?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  tags?: string[];
  sortBy?: string;
  order?: 'asc' | 'desc';
}

/**
 * 待办事项分页响应
 */
export interface TodoPagination {
  data: Todo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: TodoStats;
}

/**
 * 待办事项统计
 */
export interface TodoStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  byPriority: Record<TodoPriority, number>;
}