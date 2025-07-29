// dtos/Customer.dto.ts

// export class WalletDTO {
//   currency: string;
//   balance: number;

//   constructor(data: any) {
//     this.currency = data.currency;
//     this.balance = data.balance;
//   }
// }

// export class OrderDTO {
//   id: string;
//   price: number;
//   status: string;
//   createdAt: string;

//   constructor(data: any) {
//     this.id = data.id;
//     this.price = data.price;
//     this.status = data.status;
//     this.createdAt = data.createdAt;
//   }
// }

// export class OrderUserDTO {
//   Order: OrderDTO;

//   constructor(data: any) {
//     this.Order = new OrderDTO(data.Order);
//   }
// }

export class CustomersDTO {
  id: string;
  username: string;
  email: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt: string;
  walletBalance: number;
  walletCurrency: string;
  totalOrders: number;

  constructor(data: any) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.walletCurrency = data?.wallet?.currency || "USD";
    this.walletBalance = parseFloat(data?.wallet?.balance) || 0.0;
    this.totalOrders = data?._count?.orderUsers || 0;
  }
}

export class CustomerDetailsDTO {
  id: string;
  username: string;
  email: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt: string;
  walletCurrency: string;
  walletBalance: number;
  totalOrders: number;

  constructor(data: any) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.walletCurrency = data?.wallet?.currency;
    this.walletBalance = parseFloat(data?.wallet?.balance) || 0.0;
    this.totalOrders = data?._count?.orderUsers || 0;
  }
}
