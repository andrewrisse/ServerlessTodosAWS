/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateTodoRequest {
  todoId: string;
  userId: string;
  name: string
  dueDate: string
  done: boolean
}
