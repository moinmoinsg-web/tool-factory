import type { ToolDefinition } from "@/content/tools";
import { WordCounterWidget } from "@/components/WordCounterWidget";
import { FdCalculatorWidget } from "@/components/FdCalculatorWidget";
import { JsonFormatterWidget } from "@/components/JsonFormatterWidget";
import { XmlToJsonWidget } from "@/components/XmlToJsonWidget";
import { JsonToCsvWidget } from "@/components/JsonToCsvWidget";
import { XmlFormatterWidget } from "@/components/XmlFormatterWidget";
import { PercentageCalculatorWidget } from "@/components/PercentageCalculatorWidget";
import { MarginCalculatorWidget } from "@/components/MarginCalculatorWidget";
import { GpaCalculatorWidget } from "@/components/GpaCalculatorWidget";
import { DateCalculatorWidget } from "@/components/DateCalculatorWidget";
import { AcresToSquareFeetWidget } from "@/components/AcresToSquareFeetWidget";
import { FahrenheitToCelsiusWidget } from "@/components/FahrenheitToCelsiusWidget";
import { CelsiusToFahrenheitWidget } from "@/components/CelsiusToFahrenheitWidget";
import { CmToInchesWidget } from "@/components/CmToInchesWidget";
import { KgToLbsWidget } from "@/components/KgToLbsWidget";
import { KmToMilesWidget } from "@/components/KmToMilesWidget";

type ToolShellProps = {
  tool: ToolDefinition;
};

/**
 * Interactive widget area. Map slug → concrete widget.
 * New tools from Tool Factory Bot should register a widget here (or use the placeholder).
 */
export function ToolShell({ tool }: ToolShellProps) {
  if (tool.slug === "word-counter") {
    return <WordCounterWidget />;
  }
  if (tool.slug === "fd-calculator") {
    return <FdCalculatorWidget />;
  }
  if (tool.slug === "json-formatter") {
    return <JsonFormatterWidget />;
  }
  if (tool.slug === "xml-to-json-converter") {
    return <XmlToJsonWidget />;
  }
  if (tool.slug === "json-to-csv-converter") {
    return <JsonToCsvWidget />;
  }
  if (tool.slug === "xml-formatter") {
    return <XmlFormatterWidget />;
  }
  if (tool.slug === "percentage-calculator") {
    return <PercentageCalculatorWidget />;
  }
  if (tool.slug === "margin-calculator") {
    return <MarginCalculatorWidget />;
  }
  if (tool.slug === "gpa-calculator") {
    return <GpaCalculatorWidget />;
  }
  if (tool.slug === "date-calculator") {
    return <DateCalculatorWidget />;
  }
  if (tool.slug === "kg-to-lbs") {
    return <KgToLbsWidget />;
  }
  if (tool.slug === "km-to-miles") {
    return <KmToMilesWidget />;
  }
  if (tool.slug === "fahrenheit-to-celsius") {
    return <FahrenheitToCelsiusWidget />;
  }
  if (tool.slug === "celsius-to-fahrenheit") {
    return <CelsiusToFahrenheitWidget />;
  }
  if (tool.slug === "acres-to-square-feet") {
    return <AcresToSquareFeetWidget />;
  }
  if (tool.slug === "cm-to-inches") {
    return <CmToInchesWidget />;
  }

  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Tool widget placeholder
      </p>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Interactive UI for <code className="font-mono">{tool.slug}</code> goes
        here. Replace this shell when shipping the tool logic.
      </p>
    </div>
  );
}
