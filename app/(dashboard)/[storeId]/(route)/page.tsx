import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatter } from "@/lib/utils";
import { CreditCard, IndianRupee } from "lucide-react";
import { ReactNode } from "react";

import { Overview } from "@/components/overview";

interface DashboardLayoutProps {
  params: { storeId: string }
}

interface DashboardCardProps {
  title: string,
  icon: ReactNode,
  amount: number
}

const DashboardCard: React.FC<DashboardCardProps> = ({ amount, icon, title }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>
          {icon}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-3xl">
        <p>{formatter.format(amount)}</p>
      </CardContent>
    </Card>
  )
}



const DashboardPage: React.FC<DashboardLayoutProps> = async ({ params }) => {

  const totalRevenue = await getTotalRevenue(params.storeId);
  // const salesCount = getSalesCount();
  // const stockCount = getStockCount();

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title="Dashboard"
          description="Overview Of Your Store."
        />
        <Separator />
        <div className="grid gap-4 grid-cols-4">
          <DashboardCard title="Total Revenue" amount={totalRevenue} icon={<IndianRupee />} />
          <DashboardCard title="Sales" amount={10000} icon={<CreditCard />} />

          <Card className="col-span-3">
            <CardHeader className="flex flex-row justify-between">
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Overview />
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default DashboardPage;