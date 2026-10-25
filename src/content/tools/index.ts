export type FaqItem = {
  question: string;
  answer: string;
};

export type ToolDefinition = {
  slug: string;
  keyword: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  faq: FaqItem[];
  relatedSlugs: string[];
};

/**
 * Content registry for SEO utility tools.
 * Tool Factory Bot appends one ToolDefinition here per daily publish.
 * STOP RULE: never add a tool whose keyword already appears in listExistingKeywords().
 */
export const tools: ToolDefinition[] = [
  {
    slug: "word-counter",
    keyword: "word counter",
    title: "Word Counter",
    description:
      "Count words, characters, sentences, and paragraphs in your text instantly. Free online word counter for writers, students, and marketers.",
    metaTitle: "Word Counter — Free Online Word & Character Counter",
    metaDescription:
      "Free word counter tool. Paste text to count words, characters, sentences, and paragraphs in real time. No signup required.",
    faq: [
      {
        question: "How does the word counter work?",
        answer:
          "Paste or type your text into the box. The tool counts words (whitespace-separated tokens), characters with and without spaces, sentences, and paragraphs as you type.",
      },
      {
        question: "Is this word counter free?",
        answer:
          "Yes. This word counter is free to use with no account or download required. Results stay in your browser.",
      },
      {
        question: "Does the word counter store my text?",
        answer:
          "No. Counting runs entirely in your browser. Your text is not uploaded or saved on our servers.",
      },
      {
        question: "What counts as a word?",
        answer:
          "A word is any sequence of non-whitespace characters. Multiple spaces, tabs, and line breaks are treated as separators and do not inflate the word count.",
      },
    ],
    relatedSlugs: [],
  },
];

export function getAllTools(): ToolDefinition[] {
  return tools;
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug);
}

/** Keywords already published — use before adding a new tool to avoid duplicates. */
export function listExistingKeywords(): string[] {
  return tools.map((tool) => tool.keyword.toLowerCase().trim());
}

export function getRelatedTools(tool: ToolDefinition): ToolDefinition[] {
  return tool.relatedSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolDefinition => Boolean(t));
}
