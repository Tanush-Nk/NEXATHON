import { QuizCard } from "../QuizCard";

export default function QuizCardExample() {
  return (
    <div className="p-8">
      <QuizCard
        question="What is the primary function of mitochondria in a cell?"
        options={[
          "Protein synthesis",
          "Energy production (ATP)",
          "DNA replication",
          "Waste removal"
        ]}
        correctAnswer="Energy production (ATP)"
        difficulty="medium"
        onAnswer={(answer, isCorrect) => console.log("Answer submitted:", answer, "Correct:", isCorrect)}
        onSkip={() => console.log("Question skipped")}
      />
    </div>
  );
}
