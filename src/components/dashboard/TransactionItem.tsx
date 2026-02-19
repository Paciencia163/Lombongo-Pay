import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface TransactionItemProps {
  type: "credit" | "debit";
  description: string;
  amount: number;
  date: string;
  category?: string;
}

const TransactionItem = ({ type, description, amount, date, category }: TransactionItemProps) => {
  const isCredit = type === "credit";

  return (
    <div className="flex items-center gap-4 py-3.5 border-b last:border-0 group hover:bg-muted/30 -mx-4 px-4 rounded-lg transition-colors">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCredit ? "bg-success/10" : "bg-destructive/10"}`}>
        {isCredit ? (
          <ArrowDownLeft className="w-5 h-5 text-success" />
        ) : (
          <ArrowUpRight className="w-5 h-5 text-destructive" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{description}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-muted-foreground">{date}</p>
          {category && (
            <>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{category}</span>
            </>
          )}
        </div>
      </div>
      <p className={`text-sm font-bold whitespace-nowrap ${isCredit ? "text-success" : "text-destructive"}`}>
        {isCredit ? "+" : "-"}{amount.toLocaleString("pt-AO")} Kz
      </p>
    </div>
  );
};

export default TransactionItem;
