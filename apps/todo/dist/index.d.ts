import React from 'react';

interface TodoProps {
    onClose: () => void;
}
declare const TodoApp: React.FC<TodoProps>;

export { TodoApp as default };
