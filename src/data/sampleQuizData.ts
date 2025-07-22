// Sample quiz data structure for testing the QuizTaking component
// This demonstrates the exact data format expected from Supabase

export const sampleQuizData = {
  id: "sample-quiz-1",
  title: "NFPA 1001 - Fire Behavior Fundamentals",
  description: "Master the essential principles of fire behavior, including heat transfer mechanisms, combustion processes, and fire development patterns critical for firefighter safety and effectiveness.",
  questions: [
    {
      id: "q1",
      question_text: "What are the three elements required for combustion in the fire triangle?",
      question_type: "multiple-choice",
      image_url: "https://images.unsplash.com/photo-1574101665683-d59d75a7a90b?w=500&h=300&fit=crop", // Fire triangle diagram
      answers: [
        {
          id: "q1a1",
          answer_text: "Heat, Fuel, and Oxygen",
          is_correct: true
        },
        {
          id: "q1a2", 
          answer_text: "Fire, Smoke, and Heat",
          is_correct: false
        },
        {
          id: "q1a3",
          answer_text: "Flame, Fuel, and Water",
          is_correct: false
        },
        {
          id: "q1a4",
          answer_text: "Carbon, Oxygen, and Nitrogen",
          is_correct: false
        }
      ]
    },
    {
      id: "q2",
      question_text: "Which method of heat transfer occurs when heat moves through direct contact between objects?",
      question_type: "multiple-choice",
      answers: [
        {
          id: "q2a1",
          answer_text: "Convection",
          is_correct: false
        },
        {
          id: "q2a2",
          answer_text: "Conduction", 
          is_correct: true
        },
        {
          id: "q2a3",
          answer_text: "Radiation",
          is_correct: false
        },
        {
          id: "q2a4",
          answer_text: "Absorption",
          is_correct: false
        }
      ]
    },
    {
      id: "q3",
      question_text: "What is the temperature range for the ignition of most common combustible materials?",
      question_type: "multiple-choice",
      image_url: "https://images.unsplash.com/photo-1525874684015-58379d421a52?w=500&h=300&fit=crop", // Thermometer/temperature gauge
      answers: [
        {
          id: "q3a1",
          answer_text: "100-200°F (38-93°C)",
          is_correct: false
        },
        {
          id: "q3a2",
          answer_text: "300-600°F (149-316°C)",
          is_correct: false
        },
        {
          id: "q3a3",
          answer_text: "500-1000°F (260-538°C)",
          is_correct: true
        },
        {
          id: "q3a4",
          answer_text: "1200-1500°F (649-816°C)",
          is_correct: false
        }
      ]
    },
    {
      id: "q4",
      question_text: "During which stage of fire development does 'flashover' typically occur?",
      question_type: "multiple-choice",
      answers: [
        {
          id: "q4a1",
          answer_text: "Incipient Stage",
          is_correct: false
        },
        {
          id: "q4a2",
          answer_text: "Growth Stage",
          is_correct: true
        },
        {
          id: "q4a3",
          answer_text: "Fully Developed Stage", 
          is_correct: false
        },
        {
          id: "q4a4",
          answer_text: "Decay Stage",
          is_correct: false
        }
      ]
    },
    {
      id: "q5",
      question_text: "What is the primary reason firefighters should understand thermal layering in structure fires?",
      question_type: "multiple-choice",
      image_url: "https://images.unsplash.com/photo-1528971985817-6c6d7aff5ac4?w=500&h=300&fit=crop", // Fire scene/thermal layers
      answers: [
        {
          id: "q5a1",
          answer_text: "To determine water pressure requirements",
          is_correct: false
        },
        {
          id: "q5a2",
          answer_text: "To choose appropriate hose diameter",
          is_correct: false
        },
        {
          id: "q5a3",
          answer_text: "To maintain position below the thermal layer for safety and visibility",
          is_correct: true
        },
        {
          id: "q5a4",
          answer_text: "To calculate ventilation fan placement",
          is_correct: false
        }
      ]
    }
  ]
};

// Data structure interfaces (these match the QuizTaking component)
export interface Answer {
  id: string;
  answer_text: string;
  is_correct: boolean;
}

export interface Question {
  id: string;
  question_text: string;
  question_type: string;
  image_url?: string;
  answers: Answer[];
}

export interface QuizData {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}