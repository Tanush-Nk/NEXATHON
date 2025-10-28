import { ChatMessage } from "../ChatMessage";

export default function ChatMessageExample() {
  return (
    <div className="space-y-4 p-4">
      <ChatMessage 
        role="user" 
        content="Can you help me understand photosynthesis?" 
        timestamp="2:30 PM"
      />
      <ChatMessage 
        role="assistant" 
        content="Of course! Photosynthesis is the process by which plants convert light energy into chemical energy. Plants use sunlight, water, and carbon dioxide to produce glucose and oxygen. The formula is: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂" 
        timestamp="2:31 PM"
      />
    </div>
  );
}
