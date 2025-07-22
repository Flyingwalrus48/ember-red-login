import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const QuizMinimal: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Quiz Page Working!</h1>
      <p>Quiz ID: {quizId}</p>
      <div className="space-y-2">
        <Button onClick={() => navigate('/quizzes')} className="w-full">
          Back to Quizzes
        </Button>
        <Button onClick={() => navigate('/')} variant="outline" className="w-full">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default QuizMinimal;