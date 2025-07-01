
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, LogOut } from 'lucide-react';
import { useTodos, Todo } from '@/hooks/useTodos';
import { useAuth } from '@/contexts/AuthContext';
import KanbanColumn from './KanbanColumn';
import TodoDialog from './TodoDialog';

const KanbanBoard = () => {
  const { todos, loading, createTodo, updateTodo, deleteTodo } = useTodos();
  const { signOut, user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const todoTodos = todos.filter(todo => todo.status === 'todo');
  const inProgressTodos = todos.filter(todo => todo.status === 'in_progress');
  const doneTodos = todos.filter(todo => todo.status === 'done');

  const handleCreateTodo = (title: string, description?: string, priority?: 'low' | 'medium' | 'high') => {
    createTodo(title, description, priority);
  };

  const handleEditTodo = (title: string, description?: string, priority?: 'low' | 'medium' | 'high') => {
    if (editingTodo) {
      updateTodo(editingTodo.id, { title, description, priority });
      setEditingTodo(null);
    }
  };

  const handleTodoEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setDialogOpen(true);
  };

  const handleTodoDelete = (id: string) => {
    deleteTodo(id);
  };

  const handleDrop = (todoId: string, newStatus: 'todo' | 'in_progress' | 'done') => {
    const todo = todos.find(t => t.id === todoId);
    if (todo && todo.status !== newStatus) {
      updateTodo(todoId, { status: newStatus });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingTodo(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">TaskBoard</h1>
            <p className="text-gray-600">Welcome back, {user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Todo
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KanbanColumn
            title="To Do"
            status="todo"
            todos={todoTodos}
            onTodoEdit={handleTodoEdit}
            onTodoDelete={handleTodoDelete}
            onDrop={handleDrop}
          />
          <KanbanColumn
            title="In Progress"
            status="in_progress"
            todos={inProgressTodos}
            onTodoEdit={handleTodoEdit}
            onTodoDelete={handleTodoDelete}
            onDrop={handleDrop}
          />
          <KanbanColumn
            title="Done"
            status="done"
            todos={doneTodos}
            onTodoEdit={handleTodoEdit}
            onTodoDelete={handleTodoDelete}
            onDrop={handleDrop}
          />
        </div>
      </div>

      <TodoDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={editingTodo ? handleEditTodo : handleCreateTodo}
        todo={editingTodo}
      />
    </div>
  );
};

export default KanbanBoard;
