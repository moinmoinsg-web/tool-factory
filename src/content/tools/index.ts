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
    relatedSlugs: ["fd-calculator", "json-formatter", "xml-to-json-converter"],
  },
  {
    slug: "fd-calculator",
    keyword: "fd calculator",
    title: "FD Calculator",
    description:
      "Calculate the maturity amount and interest earned on a fixed deposit. Enter your deposit, interest rate, term, and compounding frequency to see exactly what your FD will be worth.",
    metaTitle: "FD Calculator — Fixed Deposit Maturity & Interest Calculator",
    metaDescription:
      "Free FD calculator. Find your fixed deposit maturity amount, total interest, and effective yield with monthly, quarterly, half-yearly, or yearly compounding.",
    faq: [
      {
        question: "How is fixed deposit maturity calculated?",
        answer:
          "This FD calculator uses the compound interest formula A = P × (1 + r/n)^(n × t), where P is the deposit, r is the annual rate as a decimal, n is the number of compounding periods per year, and t is the term in years.",
      },
      {
        question: "Which compounding frequency should I choose?",
        answer:
          "Pick the frequency your bank uses. Many banks compound fixed deposits quarterly, but check your deposit terms. More frequent compounding gives a slightly higher maturity amount at the same rate.",
      },
      {
        question: "What is the effective annual yield?",
        answer:
          "The effective annual yield (also called APY) is the real yearly return after compounding. It lets you compare deposits that quote the same rate but compound at different frequencies.",
      },
      {
        question: "Does the FD calculator include tax?",
        answer:
          "No. Results are pre-tax. Interest on fixed deposits is usually taxable, so your take-home return may be lower depending on where you live and your tax bracket.",
      },
      {
        question: "Is this FD calculator free and private?",
        answer:
          "Yes. It is free with no signup, and all calculations run in your browser. Nothing you enter is sent to or stored on our servers.",
      },
    ],
    relatedSlugs: ["word-counter", "json-formatter", "xml-to-json-converter"],
  },
  {
    slug: "json-formatter",
    keyword: "json formatter",
    title: "JSON Formatter",
    description:
      "Format, beautify, minify, and validate JSON instantly. Paste your JSON to pretty-print it with clean indentation, sort keys, and spot syntax errors with line and column numbers.",
    metaTitle: "JSON Formatter — Free Online JSON Beautifier & Validator",
    metaDescription:
      "Free JSON formatter and validator. Beautify or minify JSON, choose 2-space, 4-space, or tab indentation, sort keys, and find errors fast. Runs in your browser.",
    faq: [
      {
        question: "What does a JSON formatter do?",
        answer:
          "A JSON formatter takes raw or minified JSON and rewrites it with consistent indentation and line breaks so it is easy to read. This tool can also minify JSON back to a single line and validate that it is correct.",
      },
      {
        question: "How do I format JSON online?",
        answer:
          "Paste your JSON into the input box. The formatted output appears instantly on the right. Choose Beautify or Minify, pick 2 spaces, 4 spaces, or tabs for indentation, then copy or download the result.",
      },
      {
        question: "Does the JSON formatter validate my JSON?",
        answer:
          "Yes. Every input is parsed with the browser's standard JSON parser. If the JSON is invalid, you see the error message along with the line and column where parsing failed, such as a missing comma or an unquoted key.",
      },
      {
        question: "What does the Sort keys option do?",
        answer:
          "Sort keys reorders the properties of every object alphabetically, including nested objects. Array order is kept as-is. This makes it easier to compare two JSON documents or keep config files tidy.",
      },
      {
        question: "Is my JSON data safe?",
        answer:
          "Yes. Formatting and validation run entirely in your browser. Your JSON is never uploaded to or stored on our servers, so it is safe to use with API responses and config files.",
      },
      {
        question: "Why is my JSON invalid?",
        answer:
          "Common causes are trailing commas, single quotes instead of double quotes, unquoted property names, comments, and unescaped characters in strings. Strict JSON does not allow any of these, so fix the spot reported in the error message and try again.",
      },
    ],
    relatedSlugs: ["xml-to-json-converter", "json-to-csv-converter", "word-counter", "fd-calculator"],
  },
  {
    slug: "xml-to-json-converter",
    keyword: "xml to json converter",
    title: "XML to JSON Converter",
    description:
      "Convert XML to JSON instantly in your browser. Paste or upload an XML file to get clean, formatted JSON with attributes, repeated elements as arrays, CDATA text, and optional number and boolean detection.",
    metaTitle: "XML to JSON Converter — Free Online XML to JSON Tool",
    metaDescription:
      "Free XML to JSON converter. Paste or upload XML and get pretty-printed JSON with attributes, arrays, and type detection. Fast, private, runs in your browser.",
    faq: [
      {
        question: "How do I convert XML to JSON?",
        answer:
          "Paste your XML into the input box or upload an .xml file. The XML to JSON converter parses it instantly and shows formatted JSON on the right. Adjust the options if needed, then copy the JSON or download it as a .json file.",
      },
      {
        question: "How are XML attributes converted to JSON?",
        answer:
          "Attributes become JSON properties with a prefix so they do not clash with child elements. By default the prefix is @, so <tool id=\"1\"> becomes {\"@id\": 1}. You can change the prefix or turn attributes off entirely.",
      },
      {
        question: "What happens to repeated XML elements?",
        answer:
          "When an element name appears more than once under the same parent, the converter groups those elements into a JSON array. Turn on Always use arrays if you want every child element wrapped in an array for a consistent structure.",
      },
      {
        question: "How is element text handled when an element also has attributes or children?",
        answer:
          "Elements with only text become simple JSON values. If an element has text plus attributes or child elements, the text is stored under the #text key. CDATA sections are treated as plain text.",
      },
      {
        question: "Does the converter detect numbers and booleans?",
        answer:
          "Yes. With Detect numbers & booleans turned on, values like 42, 3.14, true, and false become JSON numbers and booleans. Turn it off to keep every value as a string, which is safer for IDs, zip codes, and phone numbers with leading zeros.",
      },
      {
        question: "Is my XML uploaded to a server?",
        answer:
          "No. Conversion uses your browser's built-in XML parser, so your XML never leaves your device. Nothing is uploaded or stored, making it safe for API responses, feeds, and config files.",
      },
      {
        question: "Why does it say my XML is invalid?",
        answer:
          "XML must be well-formed: every tag needs a matching closing tag, there must be a single root element, attribute values must be quoted, and special characters like & must be escaped as &amp;. Fix the problem described in the error message and the JSON will appear.",
      },
    ],
    relatedSlugs: ["json-formatter", "json-to-csv-converter", "word-counter", "fd-calculator"],
  },
  {
    slug: "json-to-csv-converter",
    keyword: "json to csv converter",
    title: "JSON to CSV Converter",
    description:
      "Convert JSON to CSV instantly in your browser. Paste or upload a JSON array of objects to get a clean CSV table with nested objects flattened into columns, your choice of delimiter, and a one-click download that opens in Excel or Google Sheets.",
    metaTitle: "JSON to CSV Converter — Free Online JSON to CSV Tool",
    metaDescription:
      "Free JSON to CSV converter. Paste or upload JSON and get a CSV with flattened nested fields, custom delimiters, and Excel-ready download. Private, runs in your browser.",
    faq: [
      {
        question: "How do I convert JSON to CSV?",
        answer:
          "Paste your JSON into the input box or upload a .json file. The JSON to CSV converter turns each object into a row and each property into a column, and the CSV appears instantly on the right. Copy it or download it as a .csv file.",
      },
      {
        question: "What JSON structure works best?",
        answer:
          "An array of objects, such as [{\"name\":\"Ada\"},{\"name\":\"Linus\"}], converts most cleanly because every object becomes one row. A single object becomes one row, and an object that wraps a single array of records (for example {\"data\": [...]}) is unwrapped automatically.",
      },
      {
        question: "How are nested objects handled?",
        answer:
          "With Flatten nested objects turned on, nested properties become their own columns using dot notation, so {\"stats\":{\"users\":5}} becomes a stats.users column. Turn it off to keep each nested object as a JSON string in a single cell.",
      },
      {
        question: "What happens to arrays inside my JSON?",
        answer:
          "Arrays of simple values like strings and numbers are joined into one cell separated by commas, for example json, developer. Arrays that contain objects are kept as a JSON string in the cell so no data is lost.",
      },
      {
        question: "What if my objects have different keys?",
        answer:
          "The converter collects every key that appears in any object, in the order it first appears, and uses them as the header row. Rows that are missing a key get an empty cell in that column.",
      },
      {
        question: "Can I use a semicolon or tab instead of a comma?",
        answer:
          "Yes. Choose comma, semicolon, tab, or pipe as the delimiter. Semicolons are common in European versions of Excel, and tab-separated output downloads as a .tsv file. Values that contain the delimiter, quotes, or line breaks are quoted automatically.",
      },
      {
        question: "Will the CSV open correctly in Excel?",
        answer:
          "Yes. Downloaded files include a UTF-8 byte order mark so Excel displays accented letters and symbols correctly, and fields are escaped following the standard CSV rules (RFC 4180). The file also imports cleanly into Google Sheets and Numbers.",
      },
      {
        question: "Is my JSON uploaded to a server?",
        answer:
          "No. Parsing and conversion run entirely in your browser, so your JSON never leaves your device. Nothing is uploaded or stored, which makes it safe for API responses, exports, and other private data.",
      },
    ],
    relatedSlugs: ["json-formatter", "xml-to-json-converter", "word-counter"],
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
