/* eslint-disable prettier/prettier */
export class UserDto {
     name: string;
     email: string;
     password: string;
     phoneNumber: number;
     cart: string[];
     checkout: {
      products: string[];
      totalAmount: number;
      delivered: boolean;
      date: Date;
    }[];
  }
  