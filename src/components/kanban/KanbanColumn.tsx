
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Todo } from '@/hooks/useTodos';
import TodoCard from './TodoCard';

interface KanbanColumnProps {
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  todos: Todo[];
  onTodoEdit: (todo: Todo) => void;
  onTodoDelete: (id: string) => void;
  onDrop: (todoId: string, newStatus: 'todo' | 'in_progress' | 'done') => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  todos,
  onTodoEdit,
  onTodoDelete,
  onDrop,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const todoId = e.dataTransfer.getData('text/plain');
    onDrop(todoId, status);
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          {title}
          <span className="text-sm font-normal text-gray-500">
            {todos.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent
        className="space-y-2 min-h-[200px]"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {todos.map((todo) => (
          <div
            key={todo.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', todo.id);
            }}
          >
            <TodoCard
              todo={todo}
              onEdit={onTodoEdit}
              onDelete={onTodoDelete}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default KanbanColumn;
