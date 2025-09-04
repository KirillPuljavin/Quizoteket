// File: src/store/useQuizStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOption: number; // index of the correct answer
}

export interface Quiz {
  id: string;
  category: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

interface QuizState {
  quizzes: Quiz[];
  loaded: boolean;
  addQuiz: (quiz: Quiz) => void;
  deleteQuiz: (id: string) => void;
  clearAll: () => void;
  markLoaded: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      quizzes: [],
      loaded: false,
      addQuiz: (quiz) =>
        set((state) => ({ quizzes: [...state.quizzes, quiz] })),
      deleteQuiz: (id) =>
        set((state) => ({
          quizzes: state.quizzes.filter((q) => q.id !== id),
        })),
      clearAll: () => set({ quizzes: [] }),
      markLoaded: () => set({ loaded: true }),
    }),
    {
      name: "quiz-storage",
    }
  )
);
