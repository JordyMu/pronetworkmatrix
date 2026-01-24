import { User } from "lucide-react";

interface MatrixDiagramProps {
  type: "2x2" | "2x3";
  label: string;
  compact?: boolean;
}

const MatrixDiagram = ({ type, label, compact = false }: MatrixDiagramProps) => {
  const positions = type === "2x2" ? 6 : 14;
  
  const iconSize = compact ? "h-4 w-4" : "h-5 w-5";
  const nodeSize = compact ? "w-8 h-8" : "w-10 h-10";
  const level1Size = compact ? "w-6 h-6" : "w-8 h-8";
  const level2Size = compact ? "w-5 h-5" : "w-6 h-6";
  const level3Size = compact ? "w-4 h-4" : "w-4 h-4";
  const level1Icon = compact ? "h-3 w-3" : "h-4 w-4";
  const level2Icon = compact ? "h-2.5 w-2.5" : "h-3 w-3";
  const level3Icon = compact ? "h-2 w-2" : "h-2 w-2";
  
  return (
    <div className="flex flex-col items-center">
      <div className="text-sm text-primary font-semibold mb-3">{label}</div>
      
      {type === "2x2" ? (
        // 2x2 Matrix (6 positions total: 2 + 4)
        <div className="flex flex-col items-center gap-1.5">
          {/* You at the top */}
          <div className={`${nodeSize} rounded-full bg-gradient-gold flex items-center justify-center shadow-gold`}>
            <User className={`${iconSize} text-primary-foreground`} />
          </div>
          
          {/* Lines */}
          <div className={`flex items-center ${compact ? 'gap-4' : 'gap-8'}`}>
            <div className="w-px h-3 bg-primary/40" />
            <div className="w-px h-3 bg-primary/40" />
          </div>
          
          {/* Level 1: 2 positions */}
          <div className={`flex ${compact ? 'gap-4' : 'gap-8'}`}>
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className={`${level1Size} rounded-full border-2 border-primary/60 bg-secondary flex items-center justify-center`}>
                  <User className={`${level1Icon} text-primary/60`} />
                </div>
                {/* Level 2: 2 positions each */}
                <div className={`flex ${compact ? 'gap-1' : 'gap-2'}`}>
                  {[1, 2].map((j) => (
                    <div
                      key={j}
                      className={`${level2Size} rounded-full border border-primary/40 bg-secondary/50 flex items-center justify-center`}
                    >
                      <User className={`${level2Icon} text-primary/40`} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {!compact && (
            <>
              <div className="text-xs text-muted-foreground mt-2">
                {positions} positions = $$ × 6
              </div>
              <div className="text-xs text-primary/60 mt-1">
                Générations 1-4
              </div>
            </>
          )}
        </div>
      ) : (
        // 2x3 Matrix (14 positions total: 2 + 4 + 8)
        <div className="flex flex-col items-center gap-1.5">
          {/* You at the top */}
          <div className={`${nodeSize} rounded-full bg-gradient-gold flex items-center justify-center shadow-gold`}>
            <User className={`${iconSize} text-primary-foreground`} />
          </div>
          
          {/* Level 1: 2 positions */}
          <div className={`flex ${compact ? 'gap-6' : 'gap-12'}`}>
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className={`${level1Size} rounded-full border-2 border-primary/60 bg-secondary flex items-center justify-center`}>
                  <User className={`${level1Icon} text-primary/60`} />
                </div>
                {/* Level 2: 2 positions each (total 4) */}
                <div className={`flex ${compact ? 'gap-2' : 'gap-4'}`}>
                  {[1, 2].map((j) => (
                    <div key={j} className="flex flex-col items-center gap-1">
                      <div className={`${level2Size} rounded-full border border-primary/40 bg-secondary/50 flex items-center justify-center`}>
                        <User className={`${level2Icon} text-primary/40`} />
                      </div>
                      {/* Level 3: 2 positions each (total 8) */}
                      <div className="flex gap-0.5">
                        <div className={`${level3Size} rounded-full border border-primary/30 bg-secondary/30 flex items-center justify-center`}>
                          <User className={`${level3Icon} text-primary/30`} />
                        </div>
                        <div className={`${level3Size} rounded-full border border-primary/30 bg-secondary/30 flex items-center justify-center`}>
                          <User className={`${level3Icon} text-primary/30`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {!compact && (
            <>
              <div className="text-xs text-muted-foreground mt-2">
                {positions} positions = $$ × 14
              </div>
              <div className="text-xs text-primary/60 mt-1">
                Générations 5-7
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MatrixDiagram;
