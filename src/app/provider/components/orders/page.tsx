import { columns, Order } from "./columns"
import { DataTable } from "./data-table";
import data from '../../../../../orders.json';

async function getData(): Promise<Order[]> {
  // Fetch data from your API here.
  return [
    // {
    //   id: "728ed52f",
    //   amount: 100,
    //   status: "pending",
    //   email: "m@example.com",
    // },
    // ...
  ]
}

export default function DemoPage() {
//   const data = await getData()

  return (
    <div className="container mx-auto pt-3">
      <DataTable columns={columns} data={data} />
    </div>
  )
}