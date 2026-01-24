import { User } from "lucide-react";

interface MatrixDiagramProps {
  type: "2x2" | "2x3";
  label: string;
}

const MatrixDiagram = ({ type, label }: MatrixDiagramProps) => {
  const positions = type === "2x2" ? 6 : 14;
  
  return (
    <div className="flex flex-col items-center">
      <div className="text-sm text-primary font-semibold mb-3">{label}</div>
      
      {type === "2x2" ? (
        // 2x2 Matrix (6 positions total: 2 + 4)
        <div className="flex flex-col items-center gap-2">
          {/* You at the top */}
          <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          
          {/* Lines */}
          <div className="flex items-center gap-8">
            <div className="w-px h-4 bg-primary/40" />
            <div className="w-px h-4 bg-primary/40" />
          </div>
          
          {/* Level 1: 2 positions */}
          <div className="flex gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-primary/60 bg-secondary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary/60" />
                </div>
                {/* Level 2: 2 positions each */}
                <div className="flex gap-2">
                  {[1, 2].map((j) => (
                    <div
                      key={j}
                      className="w-6 h-6 rounded-full border border-primary/40 bg-secondary/50 flex items-center justify-center"
                    >
                      <User className="h-3 w-3 text-primary/40" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground mt-2">
            {positions} positions = $$ × 6
          </div>
          <div className="text-xs text-primary/60 mt-1">
            Générations 1-4
          </div>
        </div>
      ) : (
        // 2x3 Matrix (14 positions total: 2 + 4 + 8)
        <div className="flex flex-col items-center gap-2">
          {/* You at the top */}
          <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          
          {/* Level 1: 2 positions */}
          <div className="flex gap-12">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-primary/60 bg-secondary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary/60" />
                </div>
                {/* Level 2: 2 positions each (total 4) */}
                <div className="flex gap-4">
                  {[1, 2].map((j) => (
                    <div key={j} className="flex flex-col items-center gap-1">
                      <div className="w-6 h-6 rounded-full border border-primary/40 bg-secondary/50 flex items-center justify-center">
                        <User className="h-3 w-3 text-primary/40" />
                      </div>
                      {/* Level 3: 2 positions each (total 8) */}
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full border border-primary/30 bg-secondary/30 flex items-center justify-center">
                          <User className="h-2 w-2 text-primary/30" />
                        </div>
                        <div className="w-4 h-4 rounded-full border border-primary/30 bg-secondary/30 flex items-center justify-center">
                          <User className="h-2 w-2 text-primary/30" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground mt-2">
            {positions} positions = $$ × 14
          </div>
          <div className="text-xs text-primary/60 mt-1">
            Générations 5-7
          </div>
        </div>
      )}
    </div>
  );
};

export default MatrixDiagram;
