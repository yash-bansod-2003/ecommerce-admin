import prismaDb from "@/lib/prismadb";

interface DashboardLayoutProps {
  params: { storeId: string }
}

const DashboardPage: React.FC<DashboardLayoutProps> = async ({ params }) => {

  const store = await prismaDb.store.findFirst({
    where: {
      id: params.storeId
    }
  });

  return (
    <div>
      <h1>Active store {store?.name}</h1>
    </div>
  )
}

export default DashboardPage;