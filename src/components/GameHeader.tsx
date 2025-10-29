interface GameHeaderProps {
  score: number;
}

export const GameHeader = ({ score }: GameHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-5xl font-bold text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
        2048
      </h1>
      
      <div className="bg-purple-900/50 px-6 py-3 rounded-xl border-2 border-purple-400/50 shadow-lg shadow-purple-500/30 backdrop-blur-sm">
        <div className="text-purple-300 text-xs uppercase tracking-wider mb-1">Score</div>
        <div className="text-white text-2xl font-bold drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
          {score}
        </div>
      </div>
    </div>
  );
};
