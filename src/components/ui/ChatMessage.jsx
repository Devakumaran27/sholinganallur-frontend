import React, { useState } from 'react';
import {
  Bot,
  User,
  Sparkles,
  BookOpen,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';

/**
 * Safely parses inline markdown tokens (code, bold, italic) into React nodes.
 * Completely avoids dangerouslySetInnerHTML for strict XSS safety.
 */
function renderInlineFormatting(text) {
  if (!text || typeof text !== 'string') return text;

  const nodes = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // 1. Inline code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      nodes.push(
        <code
          key={`code-${key++}`}
          className="px-1.5 py-0.5 rounded bg-slate-200/70 text-teal-800 font-mono text-xs font-medium"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // 2. Bold: **bold**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      nodes.push(
        <strong key={`bold-${key++}`} className="font-semibold text-slate-900">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // 3. Italic: *italic* or _italic_
    const italicMatch = remaining.match(/^[*_]([^*_]+)[*_]/);
    if (italicMatch) {
      nodes.push(
        <em key={`italic-${key++}`} className="italic text-slate-700">
          {italicMatch[1]}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // 4. Regular text up to next special character
    const nextSpecial = remaining.search(/[`*_]/);
    if (nextSpecial === -1) {
      nodes.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      nodes.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      nodes.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return nodes;
}

/**
 * Parses markdown block elements (headings, bullet lists, numbered lists, hr, paragraphs)
 * into safe React JSX structures.
 */
function MarkdownRenderer({ content }) {
  if (!content || typeof content !== 'string') return null;

  const lines = content.split('\n');
  const blocks = [];
  let currentList = null;

  const flushList = (blockIdx) => {
    if (currentList) {
      const ListTag = currentList.type;
      const listClass =
        currentList.type === 'ul'
          ? 'list-disc pl-5 space-y-1 my-2 text-slate-800'
          : 'list-decimal pl-5 space-y-1 my-2 text-slate-800';

      blocks.push(
        <ListTag key={`list-${blockIdx}`} className={listClass}>
          {currentList.items.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ListTag>
      );
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Horizontal rule: --- or ***
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      flushList(i);
      blocks.push(<hr key={`hr-${i}`} className="my-3 border-slate-200" />);
      continue;
    }

    // Headings: #, ##, ###
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushList(i);
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      if (level === 1) {
        blocks.push(
          <h2 key={`h1-${i}`} className="text-base font-bold text-slate-900 mt-3 mb-1.5">
            {renderInlineFormatting(text)}
          </h2>
        );
      } else if (level === 2) {
        blocks.push(
          <h3 key={`h2-${i}`} className="text-sm sm:text-base font-bold text-slate-900 mt-2.5 mb-1">
            {renderInlineFormatting(text)}
          </h3>
        );
      } else {
        blocks.push(
          <h4 key={`h3-${i}`} className="text-sm font-bold text-slate-900 mt-2 mb-1">
            {renderInlineFormatting(text)}
          </h4>
        );
      }
      continue;
    }

    // Unordered bullet list: * text or - text
    const bulletMatch = line.match(/^\s*[*+-]\s+(.+)$/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList(i);
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(bulletMatch[1].trim());
      continue;
    }

    // Ordered numbered list: 1. text
    const numberMatch = line.match(/^\s*(\d+)\.\s+(.+)$/);
    if (numberMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList(i);
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(numberMatch[2].trim());
      continue;
    }

    // Empty line separates blocks
    if (!trimmed) {
      flushList(i);
      continue;
    }

    // Paragraph
    flushList(i);
    blocks.push(
      <p key={`p-${i}`} className="text-sm leading-relaxed text-slate-800">
        {renderInlineFormatting(trimmed)}
      </p>
    );
  }

  flushList(lines.length);
  return <div className="space-y-2">{blocks}</div>;
}

export default function ChatMessage({
  role = 'assistant', // 'assistant' | 'user'
  content,
  timestamp,
  groundingSources = [],
  limitations = [],
  isError = false,
  onRetry,
}) {
  const [showSources, setShowSources] = useState(false);
  const isAssistant = role === 'assistant';

  return (
    <div
      className={`flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl transition duration-150 ${
        isError
          ? 'bg-red-50/80 border border-red-200'
          : isAssistant
          ? 'bg-slate-50 border border-slate-200/80'
          : 'bg-white border border-slate-100 shadow-sm'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          isError
            ? 'bg-red-600 text-white shadow-sm'
            : isAssistant
            ? 'bg-slate-900 text-teal-400 shadow-sm'
            : 'bg-blue-600 text-white shadow-sm'
        }`}
      >
        {isError ? (
          <AlertTriangle className="w-5 h-5" />
        ) : isAssistant ? (
          <Bot className="w-5 h-5" />
        ) : (
          <User className="w-5 h-5" />
        )}
      </div>

      {/* Message content */}
      <div className="flex-1 space-y-2.5 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">
              {isError
                ? 'System Alert'
                : isAssistant
                ? 'RouteWise AI'
                : 'You (Commuter)'}
            </span>

            {isAssistant && !isError && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                <ShieldCheck className="w-2.5 h-2.5 text-teal-600" />
                Grounded Gemini AI
              </span>
            )}
          </div>

          {timestamp && (
            <span className="text-xs text-slate-400 tabular-nums">
              {timestamp}
            </span>
          )}
        </div>

        {/* Text Body: Formatted via MarkdownRenderer for Assistant, plain text for User */}
        <div className="text-sm text-slate-800 leading-relaxed min-w-0">
          {isAssistant && !isError ? (
            <MarkdownRenderer content={content} />
          ) : (
            <div className="whitespace-pre-wrap">{content}</div>
          )}
        </div>

        {/* Retry Button on Error */}
        {isError && onRetry && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Question</span>
            </button>
          </div>
        )}

        {/* Grounding Sources (Actual Backend Citations) */}
        {groundingSources && groundingSources.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 space-y-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowSources(!showSources)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  {showSources
                    ? 'Hide Grounding Sources'
                    : `View ${groundingSources.length} Grounding Sources`}
                </span>
                {showSources ? (
                  <ChevronUp className="w-3 h-3 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                )}
              </button>
              <span className="text-[10px] text-slate-400">pgvector Verified</span>
            </div>

            {showSources && (
              <div className="grid grid-cols-1 gap-1.5 pt-1">
                {groundingSources.map((source, i) => {
                  const title = typeof source === 'string' ? source : source.title || source.chunk_id;
                  const chunkId = typeof source === 'object' ? source.chunk_id : null;
                  const similarity = typeof source === 'object' && source.similarity ? source.similarity : null;

                  return (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-xs flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="truncate">
                        <span className="font-semibold text-slate-800">{title}</span>
                        {chunkId && chunkId !== title && (
                          <span className="text-[10px] text-slate-400 font-mono ml-1.5 truncate">
                            [{chunkId}]
                          </span>
                        )}
                      </div>
                      {similarity && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600 shrink-0">
                          {Math.round(similarity * 100)}% Match
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Limitations Tag */}
        {limitations && limitations.length > 0 && (
          <div className="pt-2 text-[11px] text-slate-500 italic flex items-start gap-1.5">
            <Info className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
            <span>{limitations[0]}</span>
          </div>
        )}
      </div>
    </div>
  );
}
