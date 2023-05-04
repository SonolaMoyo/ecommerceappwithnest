/* eslint-disable prettier/prettier */
export class CreateProductDto{
  productName: string;
  websiteLink: string;
  rating: number;
  rateAmount: number;
  category: string;
  price: number;
  productBenefits: [
    {
      title: string;
      benefit: string;
    },
  ]
}