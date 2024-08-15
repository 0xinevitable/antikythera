import { BasicMessageProps } from '../types';

export const ErrorMessageItem: React.FC<BasicMessageProps> = ({ message }) => {
  return (
    <div className="p-2 mb-4 bg-red-100 rounded">
      <strong>{message.role}</strong>
      <pre className="overflow-x-auto whitespace-pre-wrap">
        {message.content}
      </pre>
    </div>
  );
};
