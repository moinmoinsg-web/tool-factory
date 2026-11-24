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
    relatedSlugs: ["fd-calculator", "json-formatter", "xml-to-json-converter", "percentage-calculator", "gpa-calculator"],
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
    relatedSlugs: ["percentage-calculator", "margin-calculator", "word-counter", "json-formatter", "xml-to-json-converter"],
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
    relatedSlugs: ["xml-to-json-converter", "xml-formatter", "json-to-csv-converter", "word-counter", "fd-calculator"],
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
    relatedSlugs: ["xml-formatter", "json-formatter", "json-to-csv-converter", "word-counter", "fd-calculator"],
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
  {
    slug: "xml-formatter",
    keyword: "xml formatter",
    title: "XML Formatter",
    description:
      "Format, beautify, minify, and validate XML instantly. Paste or upload XML to pretty-print it with clean indentation, keep comments and CDATA intact, and find syntax errors before they break your app.",
    metaTitle: "XML Formatter — Free Online XML Beautifier & Validator",
    metaDescription:
      "Free XML formatter and validator. Beautify or minify XML with 2-space, 4-space, or tab indentation, keep comments and CDATA, and spot errors fast. Runs in your browser.",
    faq: [
      {
        question: "What does an XML formatter do?",
        answer:
          "An XML formatter takes compact or messy XML and rewrites it with one element per line and consistent indentation so the structure is easy to read. This tool can also minify XML back to a single line and checks that the XML is well-formed.",
      },
      {
        question: "How do I format XML online?",
        answer:
          "Paste your XML into the input box or upload an .xml file. The formatted XML appears instantly on the right. Choose Beautify or Minify, pick 2 spaces, 4 spaces, or tabs for indentation, then copy the result or download it as an .xml file.",
      },
      {
        question: "Is an XML formatter the same as an XML beautifier or pretty printer?",
        answer:
          "Yes. XML formatter, XML beautifier, and XML pretty printer all describe the same thing: adding line breaks and indentation to make XML readable without changing its data. Minifying is the reverse and removes the whitespace between tags.",
      },
      {
        question: "Does the XML formatter validate my XML?",
        answer:
          "Yes. Every input is parsed with your browser's built-in XML parser. If the XML is not well-formed, for example a tag is not closed, an attribute is unquoted, or an ampersand is not escaped, you see the parser's error message instead of output.",
      },
      {
        question: "Are comments, CDATA, and the XML declaration kept?",
        answer:
          "Yes. The XML declaration, DOCTYPE, processing instructions, and CDATA sections are preserved exactly. Comments are kept by default, and you can turn off Keep comments to strip them, which is handy when minifying.",
      },
      {
        question: "What does Self-close empty tags do?",
        answer:
          "With Self-close empty tags on, elements with no content are written as <item/>. Turn it off to write them as <item></item>. Both forms mean the same thing to XML parsers, so choose whichever your project or team style prefers.",
      },
      {
        question: "Will formatting change my XML data?",
        answer:
          "Formatting only changes the whitespace between tags. Element names, attributes, text values, and CDATA content stay the same. Leading and trailing spaces around text inside an element are trimmed, so if exact whitespace matters inside a value, wrap it in CDATA.",
      },
      {
        question: "Is my XML uploaded to a server?",
        answer:
          "No. Formatting and validation run entirely in your browser, so your XML never leaves your device. Nothing is uploaded or stored, which makes it safe for API responses, SOAP messages, sitemaps, and config files.",
      },
    ],
    relatedSlugs: ["xml-to-json-converter", "json-formatter", "json-to-csv-converter", "word-counter"],
  },
  {
    slug: "percentage-calculator",
    keyword: "percentage calculator",
    title: "Percentage Calculator",
    description:
      "Work out any percentage in seconds: find X% of a number, what percent one number is of another, percentage increase or decrease, add or subtract a percentage, reverse percentages, and percentage difference. Every answer shows the formula used.",
    metaTitle: "Percentage Calculator — Free Online % Calculator with Formulas",
    metaDescription:
      "Free percentage calculator. Find X% of Y, what percent X is of Y, percentage increase or decrease, reverse percentages, and percentage difference, with formulas shown.",
    faq: [
      {
        question: "How do I calculate a percentage of a number?",
        answer:
          "Divide the percentage by 100 and multiply by the number. For example, 20% of 150 is 20 ÷ 100 × 150 = 30. Enter the percentage and the number in the first box of the calculator to get the answer instantly.",
      },
      {
        question: "How do I find what percent one number is of another?",
        answer:
          "Divide the part by the whole and multiply by 100. For example, 30 out of 120 is 30 ÷ 120 × 100 = 25%. This is the formula for test scores, completion rates, and shares of a total.",
      },
      {
        question: "How do I calculate percentage increase or decrease?",
        answer:
          "Subtract the original value from the new value, divide by the original value, and multiply by 100. Going from 80 to 100 is (100 − 80) ÷ 80 × 100 = 25% increase. A negative result means a percentage decrease.",
      },
      {
        question: "What is the difference between percentage change and percentage difference?",
        answer:
          "Percentage change compares a new value to an original value, so direction matters. Percentage difference compares two values with no starting point: the absolute difference is divided by their average. For 10 and 15 the percentage difference is 5 ÷ 12.5 × 100 = 40%.",
      },
      {
        question: "How do I add or subtract a percentage from a number?",
        answer:
          "To add a percentage, multiply by 1 plus the percentage as a decimal: 50 + 15% is 50 × 1.15 = 57.5. To subtract, multiply by 1 minus the decimal: 50 − 15% is 50 × 0.85 = 42.5. This is handy for tax, tips, markups, and discounts.",
      },
      {
        question: "How do I find the original number from a percentage?",
        answer:
          "Divide the known part by the percentage as a decimal. If 45 is 60% of a number, the number is 45 ÷ 0.60 = 75. Use this reverse percentage calculation to find a pre-discount price or a total from a partial amount.",
      },
      {
        question: "Why is a 50% increase followed by a 50% decrease not the same value?",
        answer:
          "Each percentage is applied to a different base. 100 increased by 50% is 150, but 50% of 150 is 75, so decreasing gives 75, not 100. Percentage changes compound, so always check which value the percentage is based on.",
      },
      {
        question: "Is this percentage calculator free and private?",
        answer:
          "Yes. The calculator is free with no signup, and all calculations run in your browser. The numbers you enter are never sent to or stored on a server.",
      },
    ],
    relatedSlugs: ["cm-to-inches", "margin-calculator", "gpa-calculator", "date-calculator", "fd-calculator", "word-counter"],
  },
  {
    slug: "margin-calculator",
    keyword: "margin calculator",
    title: "Margin Calculator",
    description:
      "Calculate gross margin, markup, and profit from cost and selling price, find the selling price you need for a target margin, work out the maximum cost you can afford, and convert between margin and markup. Every result shows the formula used.",
    metaTitle: "Margin Calculator — Free Profit Margin & Markup Calculator",
    metaDescription:
      "Free margin calculator. Enter cost and price to get gross margin, markup, and profit, find the price for a target margin, and convert margin to markup instantly.",
    faq: [
      {
        question: "How do I calculate profit margin?",
        answer:
          "Subtract the cost from the selling price to get gross profit, divide the profit by the selling price, and multiply by 100. For an item that costs $60 and sells for $100, the margin is (100 − 60) ÷ 100 × 100 = 40%.",
      },
      {
        question: "What is the difference between margin and markup?",
        answer:
          "Both use the same profit, but margin divides it by the selling price while markup divides it by the cost. A $60 item sold for $100 has a 40% margin but a 66.67% markup. Margin can never reach 100%, while markup has no upper limit.",
      },
      {
        question: "How do I find the selling price for a target margin?",
        answer:
          "Divide the cost by 1 minus the target margin as a decimal. To earn a 40% margin on a $60 cost, the price is 60 ÷ (1 − 0.40) = $100. Adding 40% to the cost ($84) would only give a 28.6% margin, which is a common pricing mistake.",
      },
      {
        question: "How do I convert markup to margin?",
        answer:
          "Margin = markup ÷ (100 + markup) × 100. A 50% markup equals a 33.33% margin, and a 100% markup equals a 50% margin. To go the other way, markup = margin ÷ (100 − margin) × 100.",
      },
      {
        question: "Is this a gross margin or net margin calculator?",
        answer:
          "It calculates gross margin: selling price minus the direct cost of the product or service. Net margin also subtracts overheads such as rent, salaries, marketing, and taxes. To estimate net margin, enter your fully loaded cost per unit as the cost.",
      },
      {
        question: "What is a good profit margin?",
        answer:
          "It depends on the industry. Grocery and retail often run gross margins of 20–40%, restaurants around 60–70% on food cost, and software or digital products 70–90%. Compare your margin with businesses that have a similar cost structure rather than using a single target.",
      },
      {
        question: "Why does my margin show as negative?",
        answer:
          "A negative margin means the selling price is lower than the cost, so each sale loses money. Raise the price, reduce the cost, or use the target margin box to see the minimum price needed to break even or reach your goal.",
      },
      {
        question: "Is this margin calculator free and private?",
        answer:
          "Yes. The calculator is free with no signup, and every calculation runs in your browser. The prices and costs you enter are never sent to or stored on a server.",
      },
    ],
    relatedSlugs: ["percentage-calculator", "fd-calculator", "json-to-csv-converter"],
  },
  {
    slug: "gpa-calculator",
    keyword: "gpa calculator",
    title: "GPA Calculator",
    description:
      "Calculate your semester GPA from letter grades and credit hours on the standard 4.0 scale, see weighted GPA for Honors and AP/IB classes, combine it with previous terms for a cumulative GPA, and find the GPA you need to reach a target. Every result shows the formula used.",
    metaTitle: "GPA Calculator — Free Weighted & Cumulative GPA Calculator",
    metaDescription:
      "Free GPA calculator. Enter letter grades and credits to get your unweighted and weighted GPA on a 4.0 scale, cumulative GPA, and the GPA needed to hit your target.",
    faq: [
      {
        question: "How do I calculate my GPA?",
        answer:
          "Convert each letter grade to grade points (A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0), multiply by the course credits, add the results, and divide by the total credits. For an A in a 3-credit class and a B in a 4-credit class, GPA = (4.0 × 3 + 3.0 × 4) ÷ 7 = 3.43.",
      },
      {
        question: "What GPA scale does this calculator use?",
        answer:
          "It uses the common US 4.0 scale with plus and minus grades: A+ and A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0, B− = 2.7, C+ = 2.3, C = 2.0, C− = 1.7, D+ = 1.3, D = 1.0, D− = 0.7, and F = 0. Some schools give A+ a 4.3, so check your school's handbook if your result needs to match an official transcript.",
      },
      {
        question: "What is the difference between weighted and unweighted GPA?",
        answer:
          "Unweighted GPA treats every class the same on a 4.0 scale. Weighted GPA adds bonus points for harder classes, commonly +0.5 for Honors and +1.0 for AP or IB, so an A in an AP class counts as 5.0. Colleges often recalculate GPA themselves, so it is useful to know both numbers.",
      },
      {
        question: "Why do credit hours matter in GPA?",
        answer:
          "GPA is a credit-weighted average, so a 4-credit course affects it more than a 1-credit course. A C in a 4-credit lab lowers your GPA four times as much as a C in a 1-credit elective. Enter the credit hours shown on your schedule or transcript for each course.",
      },
      {
        question: "How do I calculate cumulative GPA?",
        answer:
          "Multiply your previous cumulative GPA by your previous credits to get total quality points, add this term's quality points, and divide by all credits combined. With a 3.2 GPA over 60 credits and a 3.6 term over 15 credits, cumulative GPA = (3.2 × 60 + 3.6 × 15) ÷ 75 = 3.28.",
      },
      {
        question: "How can I find the GPA I need to reach a target?",
        answer:
          "Use the target box: required GPA = (target × total credits after the remaining courses − current GPA × completed credits) ÷ remaining credits. If the answer is above 4.0, the target cannot be reached on an unweighted scale in that many credits.",
      },
      {
        question: "Do pass/fail or withdrawn classes count toward GPA?",
        answer:
          "Usually not. Pass/fail, audit, and withdrawn (W) courses generally carry no grade points, so leave them out of the calculator. A failing grade (F) does count as 0 points at most schools, and repeated courses may replace the earlier grade depending on your school's policy.",
      },
      {
        question: "Is this GPA calculator free and private?",
        answer:
          "Yes. The calculator is free with no signup, and every calculation runs in your browser. Your courses and grades are never sent to or stored on a server.",
      },
    ],
    relatedSlugs: ["percentage-calculator", "word-counter", "margin-calculator", "date-calculator"],
  },
  {
    slug: "date-calculator",
    keyword: "date calculator",
    title: "Date Calculator",
    description:
      "Calculate the number of days between two dates, add or subtract days, weeks, months, or years, find the day of the week for any date, and work out exact age in years, months, and days. Every result shows the formula used.",
    metaTitle: "Date Calculator — Days Between Dates, Add/Subtract & Age",
    metaDescription:
      "Free date calculator. Find days between two dates, add or subtract days/weeks/months/years, see the weekday, and calculate exact age. Runs in your browser.",
    faq: [
      {
        question: "How do I calculate the number of days between two dates?",
        answer:
          "Enter a start date and an end date. The calculator subtracts the start from the end using calendar days, so the same date returns 0. Going from January 1 to January 31 is 30 days. A negative result means the end date is earlier than the start.",
      },
      {
        question: "What is the difference between calendar days and business days?",
        answer:
          "Calendar days count every day, including weekends. Business days skip Saturdays and Sundays. Holidays are not excluded because they vary by country and company, so adjust manually if your schedule has public holidays off.",
      },
      {
        question: "How do I add or subtract days, weeks, months, or years from a date?",
        answer:
          "Choose a starting date, pick Add or Subtract, enter an amount, and select the unit. Adding 30 days to March 1 gives March 31. Adding months and years clamps to the last valid day of the month, so January 31 plus one month becomes February 28 (or 29 in a leap year).",
      },
      {
        question: "How does the age calculator work?",
        answer:
          "Enter a birth date and an as-of date. Age is broken into full years, then remaining months, then remaining days. You also get the total number of calendar days lived. This matches how most people talk about age rather than using a raw day count alone.",
      },
      {
        question: "Does the date calculator include the end date?",
        answer:
          "The day count is the difference between the two calendar dates, so the start and end on the same day is 0. If you need an inclusive count of both endpoints (common for hotel nights vs. stay length), add 1 to the calendar-day result.",
      },
      {
        question: "Which calendar and timezone does it use?",
        answer:
          "It uses the Gregorian calendar and your device local timezone for interpreting the date picker values. Calculations are done on calendar dates (year-month-day), not on clock times, so daylight saving changes do not shift the day count.",
      },
      {
        question: "Can I find what day of the week a date falls on?",
        answer:
          "Yes. Enter any date in the weekday box to see the full weekday name and long-form date. This is useful for planning events, checking historical dates, and verifying deadlines.",
      },
      {
        question: "Is this date calculator free and private?",
        answer:
          "Yes. The calculator is free with no signup, and every calculation runs in your browser. The dates you enter are never sent to or stored on a server.",
      },
    ],
    relatedSlugs: ["percentage-calculator", "gpa-calculator", "fd-calculator", "word-counter", "cm-to-inches"],
  },
  {
    slug: "cm-to-inches",
    keyword: "cm to inches",
    title: "CM to Inches Converter",
    description:
      "Convert centimeters to inches and inches to centimeters instantly. Enter cm to get exact inches (and feet + inches), convert inches back to cm/mm/m, or turn feet and inches into centimeters. Every result shows the formula used.",
    metaTitle: "CM to Inches Converter — Free Centimeters to Inches Calculator",
    metaDescription:
      "Free cm to inches converter. Convert centimeters to inches, inches to cm, and feet+inches to centimeters with exact 2.54 factor. Runs in your browser.",
    faq: [
      {
        question: "How do I convert cm to inches?",
        answer:
          "Divide the length in centimeters by 2.54. For example, 30 cm ÷ 2.54 = 11.811 inches. This tool uses the international inch definition where 1 inch equals exactly 2.54 centimeters.",
      },
      {
        question: "How do I convert inches to cm?",
        answer:
          "Multiply the length in inches by 2.54. For example, 12 inches × 2.54 = 30.48 cm. The same factor works for fractional inches such as 5.5 in → 13.97 cm.",
      },
      {
        question: "Why is the conversion factor 2.54?",
        answer:
          "Since 1959, the international yard and pound agreement defined 1 inch as exactly 25.4 millimeters, which is 2.54 centimeters. Using this exact constant keeps results consistent with scientific and engineering practice.",
      },
      {
        question: "How do I convert cm to feet and inches?",
        answer:
          "First convert cm to total inches (cm ÷ 2.54). Then divide by 12 for whole feet and take the remainder as leftover inches. Example: 180 cm → 70.866 in → 5 ft 10.866 in.",
      },
      {
        question: "How do I convert height from feet and inches to cm?",
        answer:
          "Convert feet to inches (feet × 12), add the leftover inches, then multiply by 2.54. A height of 5 ft 10 in is (5 × 12 + 10) × 2.54 = 177.8 cm.",
      },
      {
        question: "Is 1 inch exactly 2.54 cm?",
        answer:
          "Yes. The modern international inch is defined as exactly 2.54 cm. Older local inch definitions varied slightly, but for everyday measurement, science, and manufacturing you should use 2.54.",
      },
      {
        question: "How many inches are in 100 cm?",
        answer:
          "100 cm ÷ 2.54 ≈ 39.3701 inches, which is about 3 ft 3.37 in. One meter (100 cm) is often remembered as roughly 39.37 inches.",
      },
      {
        question: "Is this cm to inches converter free and private?",
        answer:
          "Yes. The converter is free with no signup, and every calculation runs in your browser. The numbers you enter are never sent to or stored on a server.",
      },
    ],
    relatedSlugs: ["percentage-calculator", "date-calculator", "fd-calculator", "margin-calculator", "gpa-calculator"],
  },
  {
    slug: "kg-to-lbs",
    keyword: "kg to lbs",
    title: "KG to LBS Converter",
    description:
      "Convert kilograms to pounds and pounds to kilograms instantly. Enter kg to get exact lbs (and pounds + ounces), or turn lbs into kg, grams, and stone. Every result shows the formula used.",
    metaTitle: "KG to LBS Converter — Free Kilograms to Pounds Calculator",
    metaDescription:
      "Free kg to lbs converter. Convert kilograms to pounds, lbs to kg, grams and stone using the exact 0.45359237 factor. Runs in your browser.",
    faq: [
      {
        question: "How do I convert kg to lbs?",
        answer:
          "Divide the mass in kilograms by 0.45359237, or multiply by about 2.20462. For example, 70 kg ÷ 0.45359237 = 154.324 lbs.",
      },
      {
        question: "How do I convert lbs to kg?",
        answer:
          "Multiply the pounds by 0.45359237. For example, 150 lbs × 0.45359237 = 68.039 kg.",
      },
      {
        question: "How many pounds are in 1 kilogram?",
        answer:
          "One kilogram equals about 2.2046 pounds (2 lb 3.27 oz). The exact value is 1 ÷ 0.45359237 = 2.20462262 lb.",
      },
      {
        question: "Is the pound defined exactly in kilograms?",
        answer:
          "Yes. Since the 1959 international yard and pound agreement, 1 avoirdupois pound is exactly 0.45359237 kg. This tool uses that exact constant.",
      },
      {
        question: "How do I convert kg to pounds and ounces?",
        answer:
          "Convert kg to decimal pounds first, keep the whole number as pounds, then multiply the decimal remainder by 16 to get ounces. 70 kg is 154 lb 5.18 oz.",
      },
      {
        question: "Is a quick mental conversion possible?",
        answer:
          "Double the kilograms and add 10 percent of that result. For 50 kg: 100 + 10 = 110 lbs, close to the exact 110.23 lbs.",
      },
      {
        question: "How many kg is a stone?",
        answer:
          "One stone is 14 pounds, which is 6.35029318 kg. Enter pounds in the second converter to see the stone value.",
      },
      {
        question: "Is this kg to lbs converter free and private?",
        answer:
          "Yes. It is free with no signup, and every calculation runs in your browser. Numbers you enter are never sent to or stored on a server.",
      },
    ],
    relatedSlugs: ["cm-to-inches", "percentage-calculator", "gpa-calculator", "date-calculator", "margin-calculator"],
  },
  {
    slug: "km-to-miles",
    keyword: "km to miles",
    title: "KM to Miles Converter",
    description:
      "Convert kilometers to miles and miles to kilometers instantly. Enter km to get exact miles (and feet), or turn miles into km and meters. Every result shows the formula used.",
    metaTitle: "KM to Miles Converter — Free Kilometers to Miles Calculator",
    metaDescription:
      "Free km to miles converter. Convert kilometers to miles and miles to km using the exact 1.609344 factor. Includes a quick reference table. Runs in your browser.",
    faq: [
      {
        question: "How do I convert km to miles?",
        answer:
          "Divide the distance in kilometers by 1.609344, or multiply by about 0.621371. For example, 10 km ÷ 1.609344 = 6.2137 miles.",
      },
      {
        question: "How do I convert miles to km?",
        answer:
          "Multiply the miles by 1.609344. For example, 26.2 miles × 1.609344 = 42.164 km.",
      },
      {
        question: "How many miles are in 1 kilometer?",
        answer:
          "One kilometer equals about 0.6214 miles. The exact value is 1 ÷ 1.609344 = 0.62137119 miles.",
      },
      {
        question: "Is a mile defined exactly in kilometers?",
        answer:
          "Yes. Since the 1959 international yard and pound agreement, the international mile is exactly 1.609344 km (1,609.344 meters). This tool uses that exact constant.",
      },
      {
        question: "How many miles is a 5K, 10K, or marathon?",
        answer:
          "A 5K is 3.107 miles, a 10K is 6.214 miles, a half marathon (21.0975 km) is 13.109 miles, and a marathon (42.195 km) is 26.219 miles.",
      },
      {
        question: "Is there a quick mental conversion from km to miles?",
        answer:
          "Multiply the kilometers by 0.6, or halve them and add a tenth of the original. For 100 km: 60 miles, close to the exact 62.14 miles.",
      },
      {
        question: "How many feet are in a kilometer?",
        answer:
          "One kilometer is about 3,280.84 feet. The converter shows the feet equivalent under the miles result.",
      },
      {
        question: "Is this km to miles converter free and private?",
        answer:
          "Yes. It is free with no signup, and every calculation runs in your browser. Numbers you enter are never sent to or stored on a server.",
      },
    ],
    relatedSlugs: ["kg-to-lbs", "cm-to-inches", "percentage-calculator", "date-calculator", "margin-calculator"],
  },
  {
    slug: "celsius-to-fahrenheit",
    keyword: "celsius to fahrenheit",
    title: "Celsius to Fahrenheit Converter",
    description:
      "Convert Celsius to Fahrenheit and Fahrenheit to Celsius instantly. Enter a temperature to get exact °F, °C and Kelvin values, with the formula shown for every result.",
    metaTitle: "Celsius to Fahrenheit Converter — Free °C to °F Calculator",
    metaDescription:
      "Free Celsius to Fahrenheit converter. Convert °C to °F and °F to °C with the exact formula, plus a quick reference table. Runs in your browser.",
    faq: [
      {
        question: "How do I convert Celsius to Fahrenheit?",
        answer:
          "Multiply the Celsius temperature by 9/5 (1.8) and add 32. For example, 25 \u00b0C \u00d7 1.8 + 32 = 77 \u00b0F.",
      },
      {
        question: "How do I convert Fahrenheit to Celsius?",
        answer:
          "Subtract 32 from the Fahrenheit temperature, then multiply by 5/9. For example, (77 \u2212 32) \u00d7 5/9 = 25 \u00b0C.",
      },
      {
        question: "What is 0 \u00b0C in Fahrenheit?",
        answer:
          "0 \u00b0C is 32 \u00b0F, the freezing point of water at standard atmospheric pressure.",
      },
      {
        question: "What is 100 \u00b0C in Fahrenheit?",
        answer:
          "100 \u00b0C is 212 \u00b0F, the boiling point of water at sea level.",
      },
      {
        question: "What is normal body temperature in Celsius and Fahrenheit?",
        answer:
          "Average body temperature is about 37 \u00b0C, which equals 98.6 \u00b0F.",
      },
      {
        question: "At what temperature are Celsius and Fahrenheit equal?",
        answer:
          "They are equal at \u221240 degrees: \u221240 \u00b0C = \u221240 \u00b0F.",
      },
      {
        question: "Is there a quick mental trick for Celsius to Fahrenheit?",
        answer:
          "Double the Celsius value and add 30. For 20 \u00b0C that gives 70 \u00b0F, close to the exact 68 \u00b0F. It works best for everyday temperatures.",
      },
      {
        question: "Is this Celsius to Fahrenheit converter free and private?",
        answer:
          "Yes. It is free with no signup, and every calculation runs in your browser. Numbers you enter are never sent to or stored on a server.",
      },
    ],
    relatedSlugs: ["km-to-miles", "kg-to-lbs", "cm-to-inches", "percentage-calculator", "date-calculator"],
  },
  {
    slug: "fahrenheit-to-celsius",
    keyword: "fahrenheit to celsius",
    title: "Fahrenheit to Celsius Converter",
    description:
      "Convert Fahrenheit to Celsius instantly. Enter a temperature in \u00b0F to get exact \u00b0C and Kelvin values, with the formula shown and a quick reference table for common temperatures.",
    metaTitle: "Fahrenheit to Celsius Converter \u2014 Free \u00b0F to \u00b0C Calculator",
    metaDescription:
      "Free Fahrenheit to Celsius converter. Convert \u00b0F to \u00b0C with the exact formula, plus a reference table for oven, weather and body temperatures. Runs in your browser.",
    faq: [
      {
        question: "How do I convert Fahrenheit to Celsius?",
        answer:
          "Subtract 32 from the Fahrenheit temperature, then multiply by 5/9. For example, (77 \u2212 32) \u00d7 5/9 = 25 \u00b0C.",
      },
      {
        question: "What is the formula for Fahrenheit to Celsius?",
        answer: "\u00b0C = (\u00b0F \u2212 32) \u00d7 5/9. Equivalently, \u00b0C = (\u00b0F \u2212 32) \u00f7 1.8.",
      },
      {
        question: "What is 32 \u00b0F in Celsius?",
        answer: "32 \u00b0F is 0 \u00b0C, the freezing point of water at standard atmospheric pressure.",
      },
      {
        question: "What is 212 \u00b0F in Celsius?",
        answer: "212 \u00b0F is 100 \u00b0C, the boiling point of water at sea level.",
      },
      {
        question: "What is 98.6 \u00b0F in Celsius?",
        answer: "98.6 \u00b0F is 37 \u00b0C, the commonly cited average human body temperature.",
      },
      {
        question: "What is 350 \u00b0F in Celsius for baking?",
        answer: "350 \u00b0F is about 177 \u00b0C. Many recipes round this to 175 \u00b0C or 180 \u00b0C.",
      },
      {
        question: "Is there a quick mental trick for Fahrenheit to Celsius?",
        answer:
          "Subtract 30 and halve the result. For 70 \u00b0F that gives 20 \u00b0C, close to the exact 21.1 \u00b0C. It works best for everyday temperatures.",
      },
      {
        question: "Is this Fahrenheit to Celsius converter free and private?",
        answer:
          "Yes. It is free with no signup, and every calculation runs in your browser. Numbers you enter are never sent to or stored on a server.",
      },
    ],
    relatedSlugs: ["celsius-to-fahrenheit", "km-to-miles", "kg-to-lbs", "cm-to-inches", "percentage-calculator"],
  },
  {
    slug: "acres-to-square-feet",
    keyword: "acres to square feet",
    title: "Acres to Square Feet Converter",
    description:
      "Convert acres to square feet instantly, and square feet back to acres. Also see square meters, hectares and square yards, with the formula shown and a quick reference table for common lot sizes.",
    metaTitle: "Acres to Square Feet Converter \u2014 Free Acre to sq ft Calculator",
    metaDescription:
      "Free acres to square feet converter. Convert acres to sq ft, sq ft to acres, hectares and square meters with the exact 43,560 factor. Runs in your browser.",
    faq: [
      {
        question: "How many square feet are in an acre?",
        answer: "There are exactly 43,560 square feet in one international acre.",
      },
      {
        question: "How do I convert acres to square feet?",
        answer:
          "Multiply the number of acres by 43,560. For example, 2.5 acres \u00d7 43,560 = 108,900 square feet.",
      },
      {
        question: "How do I convert square feet to acres?",
        answer:
          "Divide the square footage by 43,560. For example, 10,000 sq ft \u00f7 43,560 = 0.2296 acres.",
      },
      {
        question: "How many square feet are in half an acre?",
        answer: "Half an acre is 21,780 square feet.",
      },
      {
        question: "How many acres is a football field?",
        answer:
          "An American football field including end zones (360 \u00d7 160 ft = 57,600 sq ft) is about 1.32 acres.",
      },
      {
        question: "How many square meters are in an acre?",
        answer: "One acre is about 4,046.86 square meters, or roughly 0.4047 hectares.",
      },
      {
        question: "Is a US survey acre different from an international acre?",
        answer:
          "The two differ by only about two parts per million. For everyday land measurement, 43,560 sq ft per acre is the standard figure used here.",
      },
      {
        question: "Is this acres to square feet converter free and private?",
        answer:
          "Yes. It is free with no signup, and every calculation runs in your browser. Numbers you enter are never sent to or stored on a server.",
      },
    ],
    relatedSlugs: ["km-to-miles", "cm-to-inches", "kg-to-lbs", "percentage-calculator", "date-calculator"],
  },
  {
    slug: "pounds-to-ounces",
    keyword: "pounds to ounces",
    title: "Pounds to Ounces Converter",
    description:
      "Convert pounds to ounces instantly, and ounces back to pounds. See the result in grams and as pounds plus ounces, with the formula shown and a quick reference table for common weights.",
    metaTitle: "Pounds to Ounces Converter \u2014 Free lb to oz Calculator",
    metaDescription:
      "Free pounds to ounces converter. Convert lb to oz and oz to lb using the exact 16 ounces per pound factor, with grams and a quick table. Runs in your browser.",
    faq: [
      { question: "How many ounces are in a pound?", answer: "There are exactly 16 ounces in one pound (avoirdupois)." },
      { question: "How do I convert pounds to ounces?", answer: "Multiply the number of pounds by 16. For example, 2.5 lb \u00d7 16 = 40 oz." },
      { question: "How do I convert ounces to pounds?", answer: "Divide the ounces by 16. For example, 40 oz \u00f7 16 = 2.5 lb, or 2 lb 8 oz." },
      { question: "How many ounces are in half a pound?", answer: "Half a pound is 8 ounces." },
      { question: "How many ounces are in 5 pounds?", answer: "5 pounds is 80 ounces (5 \u00d7 16)." },
      { question: "How many grams is one ounce?", answer: "One ounce is exactly 28.349523125 grams, so one pound is about 453.59 grams." },
      { question: "Are fluid ounces the same as ounces of weight?", answer: "No. This converter uses ounces of weight (mass). Fluid ounces measure volume, and the weight of a fluid ounce depends on the liquid." },
      { question: "Is this pounds to ounces converter free and private?", answer: "Yes. It is free with no signup, and every calculation runs in your browser. Numbers you enter are never sent to or stored on a server." },
    ],
    relatedSlugs: ["kg-to-lbs", "acres-to-square-feet", "km-to-miles", "cm-to-inches", "percentage-calculator"],
  },
  {
    slug: "1rm-calculator",
    keyword: "1rm calculator",
    title: "1RM Calculator",
    description:
      "Estimate your one-rep max (1RM) from any set of 1 to 30 reps. Compare the Epley, Brzycki, Lombardi, O'Conner, Mayhew and Wathan formulas, see the average, and get a training percentage chart in lb or kg.",
    metaTitle: "1RM Calculator \u2014 Free One Rep Max Calculator (lb & kg)",
    metaDescription:
      "Free 1RM calculator. Estimate your one-rep max for squat, bench or deadlift with six formulas (Epley, Brzycki and more) plus a percentage chart. Runs in your browser.",
    faq: [
      { question: "What is a 1RM?", answer: "Your one-rep max (1RM) is the heaviest weight you can lift for a single repetition with proper form on a given exercise." },
      { question: "How do you calculate 1RM?", answer: "Use a formula that estimates 1RM from a lighter set. The Epley formula is 1RM = weight \u00d7 (1 + reps \u00f7 30). For example, 200 lb for 5 reps gives 200 \u00d7 (1 + 5/30) \u2248 233 lb." },
      { question: "What is the Brzycki formula?", answer: "Brzycki estimates 1RM as weight \u00d7 36 \u00f7 (37 \u2212 reps). It is popular for sets of about 10 reps or fewer." },
      { question: "Which 1RM formula is most accurate?", answer: "No single formula is best for everyone. They agree closely at low reps (2 to 6) and drift apart at higher reps, which is why this calculator shows several and their average." },
      { question: "How many reps should I use to estimate my 1RM?", answer: "Sets of 2 to 6 reps give the most reliable estimates. Accuracy falls off above about 10 reps, and this calculator accepts up to 30." },
      { question: "Is it safe to test a true 1RM?", answer: "Maximal lifts carry more injury risk, especially without a spotter. Estimating 1RM from a submaximal set is a safer way to set training loads." },
      { question: "What percentage of 1RM should I train at?", answer: "Strength work is commonly done at 80 to 95 percent of 1RM for low reps, while hypertrophy work is often around 65 to 80 percent. The chart on this page shows each percentage in your weight unit." },
      { question: "Is this 1RM calculator free and private?", answer: "Yes. It is free with no signup, and every calculation runs in your browser. Numbers you enter are never sent to or stored on a server." },
    ],
    relatedSlugs: ["percentage-calculator", "kg-to-lbs", "pounds-to-ounces", "gpa-calculator", "date-calculator"],
  },
  {
    slug: "sql-formatter",
    keyword: "sql formatter",
    title: "SQL Formatter",
    description:
      "Format, beautify and minify SQL queries online. Paste messy SQL to get clean, indented code with uppercase keywords, readable JOINs and one clause per line, right in your browser.",
    metaTitle: "SQL Formatter \u2014 Free Online SQL Beautifier & Minifier",
    metaDescription:
      "Free SQL formatter. Beautify or minify SQL queries with custom indentation and keyword case. Works with SELECT, JOIN, subqueries and more. Runs in your browser.",
    faq: [
      { question: "What does a SQL formatter do?", answer: "A SQL formatter rewrites a query with consistent line breaks, indentation and keyword casing so it is easier to read, review and debug. It does not change what the query does." },
      { question: "How do I format SQL online with this tool?", answer: "Paste your query into the input box. The formatted result appears instantly on the right. Pick an indent size and keyword case, then click Copy." },
      { question: "Can it minify SQL too?", answer: "Yes. Switch the mode to Minify to strip comments and extra whitespace and collapse the query onto a single line." },
      { question: "Does formatting change my query results?", answer: "No. Only whitespace and the case of SQL keywords change. Table names, column names and string literals are left exactly as you typed them." },
      { question: "Which SQL dialects are supported?", answer: "The formatter works on common ANSI SQL used by MySQL, PostgreSQL, SQL Server, SQLite and Oracle, including SELECT, JOIN, GROUP BY, subqueries, INSERT, UPDATE and DELETE statements." },
      { question: "Should SQL keywords be uppercase?", answer: "Uppercase keywords are a widespread convention because they stand out from table and column names, but it is a style choice. You can choose uppercase, lowercase or keep your original case." },
      { question: "Does it handle multiple statements and comments?", answer: "Yes. Statements separated by semicolons are formatted one after another, and -- line comments and /* block */ comments are preserved in Beautify mode." },
      { question: "Is my SQL sent to a server?", answer: "No. Formatting runs entirely in your browser, so your queries and data never leave your device." },
    ],
    relatedSlugs: ["json-formatter", "xml-formatter", "json-to-csv-converter", "xml-to-json-converter", "word-counter"],
  },
  {
    slug: "markup-calculator",
    keyword: "markup calculator",
    title: "Markup Calculator",
    description:
      "Calculate markup percentage from cost and selling price, find the selling price for a target markup, or work backwards to cost. See profit and gross margin alongside every result, with the formula shown.",
    metaTitle: "Markup Calculator \u2014 Free Markup, Price & Profit Calculator",
    metaDescription:
      "Free markup calculator. Find markup % from cost and price, the selling price for a target markup, or the cost behind a price. Shows profit and margin. Runs in your browser.",
    faq: [
      { question: "What is markup?", answer: "Markup is the percentage you add on top of an item's cost to get its selling price. A $60 item sold for $90 has a $30 profit, which is a 50% markup on cost." },
      { question: "How do I calculate markup percentage?", answer: "Subtract cost from the selling price, divide by cost, then multiply by 100. Markup % = (Price - Cost) / Cost x 100." },
      { question: "How do I find the selling price from a markup?", answer: "Multiply cost by one plus the markup as a decimal. For a 40% markup on $50 cost, the price is 50 x 1.40 = $70." },
      { question: "What is the difference between markup and margin?", answer: "Markup is profit divided by cost; margin is profit divided by selling price. The same sale always has a lower margin than markup, for example a 50% markup equals a 33.33% margin." },
      { question: "Can markup be over 100%?", answer: "Yes. If you sell something for more than double its cost, the markup is above 100%. Margin, by contrast, can never reach 100%." },
      { question: "How do I work out cost from price and markup?", answer: "Divide the selling price by one plus the markup as a decimal. A $150 price with a 50% markup means a cost of 150 / 1.5 = $100." },
      { question: "What markup should I use for my business?", answer: "It depends on your industry, overheads and competition. Retail often uses 50% or more, while high-volume sellers accept lower markups. Check that your margin covers expenses." },
      { question: "Is my data stored anywhere?", answer: "No. All calculations run in your browser and nothing you enter is sent to a server." },
    ],
    relatedSlugs: ["margin-calculator", "percentage-calculator", "gpa-calculator", "date-calculator", "word-counter"],
  },
  {
    slug: "diff-checker",
    keyword: "diff checker",
    title: "Diff Checker",
    description:
      "Compare two blocks of text or code side by side and see exactly which lines were added or removed. Free online diff checker with ignore-case and ignore-whitespace options, running in your browser.",
    metaTitle: "Diff Checker \u2014 Free Online Text & Code Compare Tool",
    metaDescription:
      "Free diff checker. Paste two texts or code snippets to instantly highlight added and removed lines. Ignore case or whitespace. Runs in your browser, nothing is uploaded.",
    faq: [
      { question: "What is a diff checker?", answer: "A diff checker compares two pieces of text and highlights the differences between them, showing which lines were added, removed or left unchanged." },
      { question: "How do I compare two texts online?", answer: "Paste the original text in the left box and the changed text in the right box. The differences appear instantly below, with added lines in green and removed lines in red." },
      { question: "Can I compare code with this tool?", answer: "Yes. It works on any plain text including source code, JSON, YAML, config files, SQL and documents. Lines are compared exactly as written unless you enable an ignore option." },
      { question: "What does ignore whitespace do?", answer: "It treats runs of spaces and tabs as a single space and trims line ends, so lines that only differ in indentation or spacing are counted as unchanged." },
      { question: "What does ignore case do?", answer: "It compares lines without regard to uppercase or lowercase letters, so Hello and hello are treated as the same line." },
      { question: "How does the comparison work?", answer: "The tool finds the longest common sequence of lines between the two texts, then marks everything outside that sequence as added or removed. This is the same idea used by tools like git diff." },
      { question: "Is there a size limit?", answer: "Because the comparison runs in your browser, very large inputs can be slow. Texts of up to about 3,000 lines per side compare comfortably." },
      { question: "Is my text uploaded or stored?", answer: "No. The comparison runs entirely in your browser, so your text never leaves your device." },
    ],
    relatedSlugs: ["json-formatter", "xml-formatter", "sql-formatter", "word-counter", "json-to-csv-converter"],
  },
  {
    slug: "html-viewer",
    keyword: "html viewer",
    title: "HTML Viewer",
    description:
      "View HTML online: paste your HTML, CSS and markup and see a live rendered preview side by side. Free HTML viewer that runs in your browser in a sandboxed frame.",
    metaTitle: "HTML Viewer \u2014 Free Online HTML Preview & Renderer",
    metaDescription:
      "Free online HTML viewer. Paste HTML and CSS and see a live rendered preview instantly. Sandboxed, private, no signup. Runs in your browser.",
    faq: [
      { question: "What is an HTML viewer?", answer: "An HTML viewer renders HTML code as a web page so you can see how it looks without saving a file or opening a browser dev tool. Paste your markup and the preview appears next to it." },
      { question: "How do I view an HTML file online?", answer: "Open the file in a text editor, copy its contents, and paste them into the HTML code box. The rendered page shows in the preview panel straight away." },
      { question: "Does it support CSS?", answer: "Yes. Inline styles and style tags in your HTML are applied in the preview, so you can test layouts, colours and fonts." },
      { question: "Does JavaScript run in the preview?", answer: "No. The preview is sandboxed and scripts are disabled for your safety, so only HTML and CSS are rendered." },
      { question: "Can I load external images and stylesheets?", answer: "Images and stylesheets referenced by full https URLs generally load. Relative paths to files on your computer will not, because the viewer has no access to your file system." },
      { question: "Is my HTML uploaded or stored?", answer: "No. Rendering happens entirely in your browser, so your code never leaves your device." },
      { question: "Why does my page look different in another browser?", answer: "Browsers can differ slightly in default styles and newer CSS features. This viewer uses your own browser's rendering engine, so it matches what you would see opening the page there." },
    ],
    relatedSlugs: ["diff-checker", "xml-formatter", "json-formatter", "sql-formatter", "word-counter"],
  },
  {
    slug: "ip-subnet-calculator",
    keyword: "ip subnet calculator",
    title: "IP Subnet Calculator",
    description:
      "Calculate IPv4 subnets online: enter an IP address and CIDR prefix or subnet mask to get the network address, broadcast address, usable host range, wildcard mask and host count.",
    metaTitle: "IP Subnet Calculator \u2014 Free IPv4 CIDR & Subnet Mask Tool",
    metaDescription:
      "Free IP subnet calculator. Enter an IPv4 address and CIDR or mask to get network, broadcast, usable host range, wildcard mask and host count instantly.",
    faq: [
      { question: "What is an IP subnet calculator?", answer: "An IP subnet calculator takes an IPv4 address and a prefix length or subnet mask and works out the network address, broadcast address, usable host range and number of hosts for that subnet." },
      { question: "How do I calculate a subnet?", answer: "Enter the IP address, then a CIDR prefix such as /24 or a subnet mask such as 255.255.255.0. The calculator applies the mask to the address with a bitwise AND to find the network address and fills in the rest." },
      { question: "What does /24 mean?", answer: "/24 is CIDR notation for a subnet mask with 24 leading one-bits, which is 255.255.255.0. It leaves 8 host bits, giving 256 addresses and 254 usable hosts." },
      { question: "How many usable hosts are in a subnet?", answer: "Usable hosts equal 2 to the power of the host bits, minus 2 for the network and broadcast addresses. A /30 has 2 usable hosts, a /24 has 254 and a /16 has 65,534. /31 point-to-point links use both addresses and /32 is a single host." },
      { question: "What is a wildcard mask?", answer: "A wildcard mask is the inverse of the subnet mask. For 255.255.255.0 the wildcard mask is 0.0.0.255. It is commonly used in router access lists and OSPF network statements." },
      { question: "What is the difference between the network and broadcast address?", answer: "The network address is the first address in a subnet and identifies the subnet itself. The broadcast address is the last address and is used to reach every host in the subnet. Neither is assigned to a normal host." },
      { question: "Does this support IPv6?", answer: "No. This calculator handles IPv4 only. IPv6 subnetting uses 128-bit addresses and prefix lengths and works differently." },
      { question: "Is my data sent to a server?", answer: "No. All calculations run in your browser, so the addresses you enter never leave your device." },
    ],
    relatedSlugs: ["diff-checker", "html-viewer", "percentage-calculator", "json-formatter", "word-counter"],
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
