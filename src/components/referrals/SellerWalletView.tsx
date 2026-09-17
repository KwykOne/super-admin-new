
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Transaction types
type TransactionType = "earned" | "purchased" | "redeemed" | "expired";
type TransactionSource = "referral" | "purchase" | "subscription" | "sms" | "email" | "notification" | "admin";

interface PointsTransaction {
  id: string;
  date: Date;
  points: number;
  type: TransactionType;
  source: TransactionSource;
  description: string;
  balance: number;
}

interface SellerWalletViewProps {
  referrerId: string;
  totalPoints: number;
  availablePoints: number;
  redeemedPoints: number;
}

export function SellerWalletView({
  referrerId,
  totalPoints,
  availablePoints,
  redeemedPoints
}: SellerWalletViewProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Generate mock transaction data
  const transactions: PointsTransaction[] = generateMockTransactions(referrerId, totalPoints, redeemedPoints);
  
  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === "all") return true;
    return transaction.type === activeTab;
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Points Wallet</CardTitle>
        <CardDescription>Track your referral points and usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 border rounded-md bg-blue-50">
            <div className="text-sm text-blue-800 font-medium">Total Earned Points</div>
            <div className="text-2xl font-bold text-blue-800">{totalPoints.toLocaleString()}</div>
          </div>
          <div className="p-4 border rounded-md bg-green-50">
            <div className="text-sm text-green-800 font-medium">Available Points</div>
            <div className="text-2xl font-bold text-green-800">{availablePoints.toLocaleString()}</div>
          </div>
          <div className="p-4 border rounded-md bg-amber-50">
            <div className="text-sm text-amber-800 font-medium">Redeemed Points</div>
            <div className="text-2xl font-bold text-amber-800">{redeemedPoints.toLocaleString()}</div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="earned">Points Earned</TabsTrigger>
            <TabsTrigger value="purchased">Points Purchased</TabsTrigger>
            <TabsTrigger value="redeemed">Points Redeemed</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <div className="bg-white dark:bg-[#020817] rounded-md shadow">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{formatDate(transaction.date)}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            {renderTransactionBadge(transaction.type)}
                          </TableCell>
                          <TableCell className={`font-medium ${getPointsColorClass(transaction.type)}`}>
                            {getPointsPrefix(transaction.type)}{transaction.points.toLocaleString()}
                          </TableCell>
                          <TableCell className="font-medium">
                            {transaction.balance.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <p className="text-muted-foreground">No transactions found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Helper function to generate mock transactions
function generateMockTransactions(referrerId: string, totalPoints: number, redeemedPoints: number): PointsTransaction[] {
  const transactions: PointsTransaction[] = [];
  let balance = 0;
  let earnedSoFar = 0;
  
  // Generate random earning transactions
  const earningCount = Math.floor(totalPoints / 200) + Math.floor(Math.random() * 10);
  const today = new Date();
  
  // Start with some purchased points (optional)
  if (Math.random() > 0.5) {
    const purchasedPoints = Math.floor(Math.random() * 1000) + 500;
    balance += purchasedPoints;
    earnedSoFar += purchasedPoints;
    transactions.push({
      id: `TRANS-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      date: new Date(today.getTime() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
      points: purchasedPoints,
      type: "purchased",
      source: "purchase",
      description: "Purchased points package",
      balance
    });
  }
  
  // Generate earning transactions
  for (let i = 0; i < earningCount; i++) {
    const isReferral = Math.random() > 0.2;
    const points = isReferral ? (Math.random() > 0.3 ? 200 : 50) : Math.floor(Math.random() * 300) + 100;
    const date = new Date(today.getTime() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
    const source: TransactionSource = isReferral ? "referral" : "admin";
    const description = isReferral 
      ? points === 200 
        ? "Referral commission - Paid plan" 
        : "Referral commission - Free plan"
      : "Bonus points from admin";
    
    balance += points;
    earnedSoFar += points;
    
    transactions.push({
      id: `TRANS-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      date,
      points,
      type: "earned",
      source,
      description,
      balance
    });
  }
  
  // Generate redeeming transactions
  const redeemingCount = Math.floor(redeemedPoints / 300) + Math.floor(Math.random() * 5);
  const redeemSources: TransactionSource[] = ["subscription", "sms", "email", "notification"];
  
  for (let i = 0; i < redeemingCount; i++) {
    const points = Math.floor(Math.random() * 500) + 100;
    const date = new Date(today.getTime() - Math.floor(Math.random() * 300 * 24 * 60 * 60 * 1000));
    const source = redeemSources[Math.floor(Math.random() * redeemSources.length)];
    let description = "";
    
    switch (source) {
      case "subscription":
        description = Math.random() > 0.5 
          ? "Monthly subscription renewal" 
          : "Annual subscription payment";
        break;
      case "sms":
        description = "SMS marketing campaign";
        break;
      case "email":
        description = "Email marketing credits";
        break;
      case "notification":
        description = "Push notification services";
        break;
      default:
        description = "Points redemption";
    }
    
    balance -= points;
    
    transactions.push({
      id: `TRANS-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      date,
      points,
      type: "redeemed",
      source,
      description,
      balance
    });
  }
  
  // Sort by date (most recent first)
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
}

// Helper function to render transaction badges
function renderTransactionBadge(type: TransactionType) {
  switch (type) {
    case "earned":
      return <Badge className="bg-green-100 text-green-800">Earned</Badge>;
    case "purchased":
      return <Badge className="bg-blue-100 text-blue-800">Purchased</Badge>;
    case "redeemed":
      return <Badge className="bg-amber-100 text-amber-800">Redeemed</Badge>;
    case "expired":
      return <Badge className="bg-gray-100 text-gray-800">Expired</Badge>;
    default:
      return null;
  }
}

// Helper function to get points color
function getPointsColorClass(type: TransactionType) {
  switch (type) {
    case "earned":
    case "purchased":
      return "text-green-600";
    case "redeemed":
    case "expired":
      return "text-red-600";
    default:
      return "";
  }
}

// Helper function to get points prefix
function getPointsPrefix(type: TransactionType) {
  switch (type) {
    case "earned":
    case "purchased":
      return "+";
    case "redeemed":
    case "expired":
      return "-";
    default:
      return "";
  }
}
