/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { ProductService } from 'src/product/service/product/product.service';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Get('')
    async getProduct() {
        try {
            const products = await this.productService.getallProduct();
            if (products.length > 0) {
                return ({ message: 'here is the list of products', products });
            } else {
                return ({ message: 'Oops there is no product' })
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    @Get('categories')
    async getCategories() {
        try {
            const categories = await this.productService.getCategories();
            if (!categories) {
                return ({ message: 'Oops not categories in store' })
            }
            return ({ message: 'Here are the product categories in store', categories });
        } catch (error) {
            throw new HttpException(`A problem occured ${error.message}`, HttpStatus.BAD_REQUEST)
        }
    }

    @Get(':id')
    async getProductById(@Param('id') id: string) {
        try {
            const product = await this.productService.getProductById(id);
            return ({message: 'here is your product', product})
        } catch (error) {
            throw new HttpException(`A problem occured ${error.message}`, HttpStatus.BAD_REQUEST)
        }
    }

    @Get('productByCategory/:category')
    async getProductsByCategory(@Param('category') category: string) {
        try {
            const products = await this.productService.getProductsByCategory(category);
            return ({ message: "here are the products per category", products });
        } catch (error) {
            throw new HttpException(`A problem occured ${error.message}`, HttpStatus.BAD_REQUEST)
        }
    }

    @Post('create')
    async createProduct(@Body() createProductDto: CreateProductDto) {
        try {
            // console.log(createProductDto);
            const didItCreate = await this.productService.createProduct(createProductDto);
            if (didItCreate) {
                return ({ message: 'Product Created', product: didItCreate });
            } else {
                throw new HttpException("Unable to create Product", HttpStatus.BAD_REQUEST)
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    @Put('update/:id')
    async updateProduct(@Param('id') id: string, @Body() updateProductDto: CreateProductDto) {
        try {
            const updateProduct = await this.productService.updateProduct(id, updateProductDto);
            if (updateProduct == null) {
                throw new HttpException("Product with id doesn't exist", HttpStatus.BAD_REQUEST)
            }
            return ({ message: 'Product updated', product: updateProduct })
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    @Delete('delete/:id')
    async deleteProduct(@Param('id') id: string) {
        try {
            await this.productService.deleteProduct(id);
            return ({ message: "Product Deleted" })
        } catch (error) {
            throw new HttpException(`Product not deleted ${error.message}`, HttpStatus.BAD_REQUEST)
        }
    }
}
