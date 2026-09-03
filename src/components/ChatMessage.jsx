export default function ChatMessage({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-charcoal text-ivory rounded-2xl rounded-br-sm'
            : 'bg-ivory-dim text-charcoal border border-line rounded-2xl rounded-bl-sm'
        }`}
      >
        {content}
      </div>
    </div>
  );
}
