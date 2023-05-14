/* eslint-disable prettier/prettier */
export class CreateProductDto{
  productName: string;
  imgLink: string;
  quantity: string;
  delivery: string;
  fastestDelivery: string;
  websiteLink: string;
  rating: number;
  rateAmount: number;
  category: string;
  categoryDesc: string;
  categoryImageLink: string;
  price: number;
  productBenefits: [
    {
      title: string;
      benefit: string;
    },
  ]
}