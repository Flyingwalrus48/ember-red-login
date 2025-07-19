import { useEffect, useState } from "react";

interface LoadingTransitionProps {
  onComplete: () => void;
}

const LoadingTransition = ({ onComplete }: LoadingTransitionProps) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 1500);
    const timer3 = setTimeout(() => onComplete(), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className={`absolute inset-0 rounded-full border-4 border-transparent transition-all duration-1000 ${
          stage >= 1 ? "border-t-primary animate-spin w-32 h-32" : "w-16 h-16"
        }`} />
        
        {/* Inner logo container */}
        <div className={`relative flex items-center justify-center transition-all duration-1000 ${
          stage >= 1 ? "w-32 h-32" : "w-16 h-16"
        }`}>
          {/* Logo/Icon */}
          <div className={`bg-primary rounded-full transition-all duration-1000 flex items-center justify-center ${
            stage >= 2 ? "w-24 h-24 scale-125" : stage >= 1 ? "w-20 h-20" : "w-12 h-12"
          }`}>
            <svg 
              className={`text-primary-foreground transition-all duration-500 ${
                stage >= 2 ? "w-12 h-12" : stage >= 1 ? "w-10 h-10" : "w-6 h-6"
              }`}
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              {/* Fire/Flame icon */}
              <path d="M12.016 21.958c-.815-.014-1.57-.313-2.118-.837-.494-.473-.792-1.127-.792-1.835 0-.708.298-1.362.792-1.835.548-.524 1.303-.823 2.118-.837.815.014 1.57.313 2.118.837.494.473.792 1.127.792 1.835 0 .708-.298 1.362-.792 1.835-.548.524-1.303.823-2.118.837zm0-3.834c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0-2.124c-2.75 0-5-2.25-5-5 0-1.25.5-2.5 1.5-3.5L12 2l3.5 5.5c1 1 1.5 2.25 1.5 3.5 0 2.75-2.25 5-5 5z"/>
            </svg>
          </div>
        </div>

        {/* Pulsing glow effect */}
        {stage >= 2 && (
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping w-32 h-32" />
        )}
      </div>

      {/* Loading text */}
      <div className={`absolute bottom-1/3 text-center transition-all duration-500 ${
        stage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
        <p className="text-lg font-medium text-foreground">
          {stage >= 2 ? "Welcome to FireForce" : "Authenticating..."}
        </p>
        <div className="flex justify-center mt-2">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 bg-primary rounded-full transition-all duration-300 ${
                  stage >= 1 ? "animate-pulse" : ""
                }`}
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingTransition;