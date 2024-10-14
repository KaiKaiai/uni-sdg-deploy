import { ReactNode } from 'react';

export interface HeaderData {
  newsTitle: string;
  newsContent: string;
  mainTitle: string;
  mainSubtitle: string;
  backgroundColor?: string;
  newsBannerColor?: string;
  illustrationComponent?: ReactNode | string;
  definitionTitle: string;
  definitionPara: string;
}

export interface BaseSection {
  id: string;
  title: string;
  order_id: number;
  data: any;
  onComplete: () => void;
}

export interface QuizSection extends BaseSection {
  type: "quiz";
  data: {
    question: string;
    options: string[];
    correctAnswer: string;
  };
}

export interface TextSection extends BaseSection {
  type: "text";
  data: {
    content: string;
  };
}

export interface HeaderSection extends BaseSection {
  type: "header";
  data: HeaderData;
}

export interface ResourceManagerGameSection extends BaseSection {
  type: "resourceManagerGame";
  data: {};
}

export interface FlashcardGameSection extends BaseSection {
  type: "flashcards";
  data: {
    title: string;
    cardPairs: { id: number; concept: string; details: string }[];
  };
}

export interface EventsSection extends BaseSection {
  type: "events";
  data: {
    title: string;
    description: string;
    events: Event[];
  };
}

export interface Event {
  imgSrc: string;
  title: string;
  date: string;
  href?: string;
}

// Update the Section type union
export type Section =
  | QuizSection
  | TextSection
  | ResourceManagerGameSection
  | FlashcardGameSection
  | HeaderSection
  | EventsSection;