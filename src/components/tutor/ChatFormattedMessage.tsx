import React, { useState } from 'react';
import katex from 'katex';
import { Copy, Check, Calculator } from 'lucide-react';

interface ChatFormattedMessageProps {
  text: string;
  isUser: boolean;
}

// Clean and convert text to valid LaTeX for KaTeX
function cleanToLatex(raw: string): string {
  let cleaned = raw.trim();

  // Strip wrapping delimiters: $$, $, \[, \], \(, \)
  if (cleaned.startsWith('$$') && cleaned.endsWith('$$')) {
    cleaned = cleaned.slice(2, -2).trim();
  } else if (cleaned.startsWith('\\[') && cleaned.endsWith('\\]')) {
    cleaned = cleaned.slice(2, -2).trim();
  } else if (cleaned.startsWith('$') && cleaned.endsWith('$')) {
    cleaned = cleaned.slice(1, -1).trim();
  } else if (cleaned.startsWith('\\(') && cleaned.endsWith('\\)')) {
    cleaned = cleaned.slice(2, -2).trim();
  }

  // Common conversions from plain text to LaTeX
  cleaned = cleaned.replace(/\\boldsymbol\{([^}]+)\}/g, '\\mathbf{$1}');
  cleaned = cleaned.replace(/\{,\}/g, ',');
  cleaned = cleaned.replace(/×/g, '\\times ');
  cleaned = cleaned.replace(/·/g, '\\cdot ');
  cleaned = cleaned.replace(/÷/g, '\\div ');
  cleaned = cleaned.replace(/±/g, '\\pm ');
  cleaned = cleaned.replace(/²/g, '^2');
  cleaned = cleaned.replace(/³/g, '^3');
  cleaned = cleaned.replace(/F_net/g, 'F_{\\text{net}}');
  cleaned = cleaned.replace(/F_\{net\}/g, 'F_{\\text{net}}');
  cleaned = cleaned.replace(/dp\/dt/g, '\\frac{dp}{dt}');
  cleaned = cleaned.replace(/dv\/dt/g, '\\frac{dv}{dt}');
  cleaned = cleaned.replace(/dm\/dt/g, '\\frac{dm}{dt}');
  cleaned = cleaned.replace(/dy\/dx/g, '\\frac{dy}{dx}');
  cleaned = cleaned.replace(/d\/dx/g, '\\frac{d}{dx}');

  return cleaned;
}

// Safely render LaTeX math using KaTeX with fallback
function renderMath(rawMath: string, displayMode: boolean): string {
  const latex = cleanToLatex(rawMath);

  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      output: 'html', // Pure HTML prevents MathML duplicate text artifacts
      strict: false,
    });
  } catch (err) {
    return `<span class="font-serif italic font-bold tracking-wider">${latex}</span>`;
  }
}

// Check if a line is a standalone formula or mathematical statement
function isFormulaLine(line: string): boolean {
  const trimmed = line.trim();

  // Starts and ends with math delimiters
  if (
    (trimmed.startsWith('$$') && trimmed.endsWith('$$')) ||
    (trimmed.startsWith('\\[') && trimmed.endsWith('\\]')) ||
    (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.includes('='))
  ) {
    return true;
  }

  // Preceded by formula label like "Formula: F = ma" or "**Formula:** F = ma"
  if (/^(\*\*)?(Formula|Equation|Derivation|Law)(\*\*)?:\s*.*=.*$/i.test(trimmed)) {
    return true;
  }

  // Mathematical equation with equality or relation:
  // e.g. F = ma, a = F / m, p = m * v, E = mc^2, v = u + at, y = mx + b, etc.
  if (
    /^[A-Za-zΔΣλπθφ\\](_\{?[a-zA-Z0-9]+\}?)?\s*(=|≈|∝|\\approx|\\le|\\ge)\s*[-+0-9a-zA-ZΔΣλπθφ\s·×\/*()\\^_{}±√÷]+$/.test(
      trimmed
    ) &&
    trimmed.length < 80
  ) {
    return true;
  }

  // Common fraction derivation: e.g. a = 18,000 N / 1,200 kg = 15 m/s²
  if (/^[a-zA-Z]\s*=\s*[-+0-9a-zA-Z,.\s\/*()\\^_{}±×·\\]+\s*=\s*[-+0-9a-zA-Z,.\s\/^²³]+$/.test(trimmed)) {
    return true;
  }

  return false;
}

// Formula Block Card Component with label and one-click copy
const FormulaCard: React.FC<{ formula: string; title?: string }> = ({ formula, title }) => {
  const [copied, setCopied] = useState(false);
  const mathHtml = renderMath(formula, true);
  const rawClean = formula.replace(/^\$\$|\$\$$|^\$|\$$/g, '').trim();

  const handleCopy = () => {
    navigator.clipboard?.writeText(rawClean);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/95 via-sky-50/80 to-indigo-50/95 dark:from-slate-800 dark:via-indigo-950/70 dark:to-slate-800 border-2 border-indigo-200/90 dark:border-indigo-700/80 p-3 sm:p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-indigo-200/60 dark:border-indigo-800/60">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
          <Calculator className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{title || 'Formula & Equation'}</span>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 bg-white/80 dark:bg-slate-900/80 hover:bg-white border border-slate-200 dark:border-slate-700 transition-colors"
          title="Copy formula text"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="py-2 px-1 text-center overflow-x-auto no-scrollbar">
        <div
          className="text-indigo-950 dark:text-indigo-50 font-bold text-base sm:text-lg tracking-wide inline-block"
          dangerouslySetInnerHTML={{ __html: mathHtml }}
        />
      </div>
    </div>
  );
};

// Parses inline text for bold (**text**), inline math ($formula$), formulas, and highlights
function renderInlineContent(text: string, isUser: boolean): React.ReactNode[] {
  // Normalize bolded math like **$$F = ma$$** or **$F = ma$**
  let normalized = text.replace(/\*\*\$\$([^$]+)\$\$\*\*/g, '$$$$$1$$$$');
  normalized = normalized.replace(/\*\*\$([^$]+)\$\*\*/g, '$$$1$$');

  // Tokenize string:
  // 1. Block math: $$...$$
  // 2. Inline math: $...$
  // 3. Bold: **...**
  // 4. Code: `...`
  // 5. Italic: *...*
  const pattern = /(\$\$[^\$]+\$\$|\$[^\$]+\$|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const parts = normalized.split(pattern);

  return parts.map((part, index) => {
    if (!part) return null;

    // Block math within text: $$...$$
    if (part.startsWith('$$') && part.endsWith('$$')) {
      return <FormulaCard key={`inline-card-${index}`} formula={part} />;
    }

    // Inline math: $...$
    if (part.startsWith('$') && part.endsWith('$')) {
      const mathHtml = renderMath(part, false);
      return (
        <span
          key={`math-${index}`}
          className={`inline-flex items-center px-2 py-0.5 mx-1 rounded-md font-bold text-sm tracking-wide shadow-2xs align-baseline ${
            isUser
              ? 'bg-indigo-700 text-white'
              : 'bg-indigo-100/90 dark:bg-indigo-950/90 border border-indigo-300/80 dark:border-indigo-700/80 text-indigo-950 dark:text-indigo-100'
          }`}
          dangerouslySetInnerHTML={{ __html: mathHtml }}
        />
      );
    }

    // Bold text: **...** (Extra prominent black weight + accent)
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldContent = part.slice(2, -2);
      return (
        <strong
          key={`bold-${index}`}
          className={`font-black tracking-tight ${
            isUser
              ? 'text-white'
              : 'text-indigo-950 dark:text-white bg-indigo-50/70 dark:bg-indigo-950/40 px-1 py-0.5 rounded'
          }`}
        >
          {renderInlineContent(boldContent, isUser)}
        </strong>
      );
    }

    // Code: `...`
    if (part.startsWith('`') && part.endsWith('`')) {
      const codeContent = part.slice(1, -1);
      return (
        <code
          key={`code-${index}`}
          className={`font-mono text-xs px-1.5 py-0.5 rounded font-bold ${
            isUser
              ? 'bg-indigo-700 text-white'
              : 'bg-slate-200/90 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300'
          }`}
        >
          {codeContent}
        </code>
      );
    }

    // Italic: *...*
    if (part.startsWith('*') && part.endsWith('*')) {
      const italicContent = part.slice(1, -1);
      return (
        <em key={`italic-${index}`} className="italic font-bold text-slate-800 dark:text-slate-200">
          {italicContent}
        </em>
      );
    }

    // Inline formula detection in regular text (e.g. "F = ma", "a = F / m", "v = u + at", "E = mc²")
    // If the text contains standalone equations like (F = ma) or F = ma
    if (!isUser && /\b([FmavpEsxydPWI]|KE|PE)\s*=\s*[-+0-9a-zA-Z\s·×\/*()\\^_{}²³±√÷]+(?=[,.\s)]|$)/.test(part)) {
      // Split by formula patterns
      const formulaSubPattern = /(\b(?:[FmavpEsxydPWI]|KE|PE)\s*=\s*[-+0-9a-zA-Z\s·×\/*()\\^_{}²³±√÷]+(?=[,.\s)]|$))/g;
      const subParts = part.split(formulaSubPattern);
      return (
        <span key={`sub-${index}`}>
          {subParts.map((sub, sIdx) => {
            if (formulaSubPattern.test(sub)) {
              const inlineMath = renderMath(sub, false);
              return (
                <span
                  key={`inline-math-${sIdx}`}
                  className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md bg-indigo-100/90 dark:bg-indigo-900/60 border border-indigo-300 dark:border-indigo-700 font-bold text-indigo-950 dark:text-indigo-100 shadow-2xs"
                  dangerouslySetInnerHTML={{ __html: inlineMath }}
                />
              );
            }
            return <span key={`sub-text-${sIdx}`}>{sub}</span>;
          })}
        </span>
      );
    }

    // Plain text: in AI messages, all text is bold font
    return <span key={`plain-${index}`}>{part}</span>;
  });
}

export const ChatFormattedMessage: React.FC<ChatFormattedMessageProps> = ({ text, isUser }) => {
  if (isUser) {
    return <div className="leading-relaxed font-semibold whitespace-pre-wrap">{text}</div>;
  }

  // Parse multi-line markdown message for AI response
  // All AI answered text is rendered in bold font
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'bullet' | 'number'; items: string[] } | null = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'bullet') {
        elements.push(
          <ul
            key={`list-${elements.length}`}
            className="my-2.5 space-y-2 pl-5 list-disc text-slate-900 dark:text-slate-100 font-bold"
          >
            {currentList.items.map((item, idx) => (
              <li key={idx} className="leading-relaxed font-bold">
                {renderInlineContent(item, false)}
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol
            key={`list-${elements.length}`}
            className="my-2.5 space-y-2 pl-5 list-decimal text-slate-900 dark:text-slate-100 font-bold"
          >
            {currentList.items.map((item, idx) => (
              <li key={idx} className="leading-relaxed font-bold">
                {renderInlineContent(item, false)}
              </li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Empty line
    if (!trimmed) {
      flushList();
      i++;
      continue;
    }

    // Horizontal rule divider
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flushList();
      elements.push(<hr key={`hr-${i}`} className="my-3 border-indigo-200/80 dark:border-slate-700" />);
      i++;
      continue;
    }

    // Standalone block formula on a single line: $$...$$
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
      flushList();
      elements.push(<FormulaCard key={`formula-${i}`} formula={trimmed} />);
      i++;
      continue;
    }

    // Multi-line block formula: starts with $$ and ends on later line with $$
    if (trimmed.startsWith('$$') && !trimmed.endsWith('$$')) {
      flushList();
      let multiFormula = trimmed.slice(2);
      i++;
      while (i < lines.length && !lines[i].trim().endsWith('$$')) {
        multiFormula += ' ' + lines[i].trim();
        i++;
      }
      if (i < lines.length) {
        multiFormula += ' ' + lines[i].trim().replace(/\$\$/, '');
      }
      elements.push(<FormulaCard key={`formula-multi-${i}`} formula={multiFormula} />);
      i++;
      continue;
    }

    // Detected standalone formula line (e.g. F = ma, a = F / m, or line starting with "Formula:")
    if (isFormulaLine(trimmed)) {
      flushList();
      let formulaText = trimmed;
      let title = 'Formula & Equation';
      if (/^(Formula|Equation|Derivation|Law):/i.test(trimmed)) {
        const parts = trimmed.split(/:\s*/);
        title = parts[0].replace(/\*\*/g, '');
        formulaText = parts.slice(1).join(': ');
      }
      elements.push(<FormulaCard key={`katex-plain-math-${i}`} formula={formulaText} title={title} />);
      i++;
      continue;
    }

    // Blockquote: > text
    if (trimmed.startsWith('>')) {
      flushList();
      const quoteText = trimmed.replace(/^>\s*/, '');
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-3 p-3.5 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/60 border-l-4 border-indigo-600 text-indigo-950 dark:text-indigo-100 font-bold text-xs sm:text-sm italic leading-relaxed"
        >
          {renderInlineContent(quoteText, false)}
        </blockquote>
      );
      i++;
      continue;
    }

    // Header 3: ### Header text
    if (trimmed.startsWith('### ')) {
      flushList();
      const headerText = trimmed.replace(/^###\s+/, '');
      const isQuickCheck =
        headerText.includes('❓') ||
        headerText.toLowerCase().includes('quick check') ||
        headerText.toLowerCase().includes('quiz');

      elements.push(
        <h3
          key={`h3-${i}`}
          className={`font-black text-sm sm:text-base mt-4 mb-2 flex items-center gap-2 ${
            isQuickCheck
              ? 'text-amber-800 dark:text-amber-300 font-black'
              : 'text-indigo-950 dark:text-white font-black'
          }`}
        >
          {renderInlineContent(headerText, false)}
        </h3>
      );
      i++;
      continue;
    }

    // Header 2: ## Header text
    if (trimmed.startsWith('## ')) {
      flushList();
      const headerText = trimmed.replace(/^##\s+/, '');
      elements.push(
        <h2
          key={`h2-${i}`}
          className="font-black text-base sm:text-lg text-indigo-950 dark:text-white mt-4 mb-2 pb-1 border-b border-indigo-200 dark:border-slate-700"
        >
          {renderInlineContent(headerText, false)}
        </h2>
      );
      i++;
      continue;
    }

    // Header 1: # Header text
    if (trimmed.startsWith('# ')) {
      flushList();
      const headerText = trimmed.replace(/^#\s+/, '');
      elements.push(
        <h1
          key={`h1-${i}`}
          className="font-black text-lg sm:text-xl text-indigo-950 dark:text-white mt-4 mb-2 pb-1.5 border-b border-indigo-200 dark:border-slate-700"
        >
          {renderInlineContent(headerText, false)}
        </h1>
      );
      i++;
      continue;
    }

    // Bullet list item: * or -
    if (/^[-*]\s+/.test(trimmed)) {
      const itemContent = trimmed.replace(/^[-*]\s+/, '');
      if (!currentList || currentList.type !== 'bullet') {
        flushList();
        currentList = { type: 'bullet', items: [itemContent] };
      } else {
        currentList.items.push(itemContent);
      }
      i++;
      continue;
    }

    // Numbered list item: 1. 2. etc
    if (/^\d+\.\s+/.test(trimmed)) {
      const itemContent = trimmed.replace(/^\d+\.\s+/, '');
      if (!currentList || currentList.type !== 'number') {
        flushList();
        currentList = { type: 'number', items: [itemContent] };
      } else {
        currentList.items.push(itemContent);
      }
      i++;
      continue;
    }

    // Standard paragraph line (Notice font-bold for AI answer)
    flushList();
    elements.push(
      <p
        key={`p-${i}`}
        className="my-2 leading-relaxed text-slate-900 dark:text-slate-100 font-bold"
      >
        {renderInlineContent(rawLine, false)}
      </p>
    );
    i++;
  }

  flushList();

  return <div className="space-y-1.5 text-sm sm:text-base font-bold">{elements}</div>;
};
