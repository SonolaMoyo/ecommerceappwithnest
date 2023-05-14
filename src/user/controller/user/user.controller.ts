/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/service/user/user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('')
    async getallUser() {
        try {
            const users = await this.userService.getallUser();
            if (users.length > 0) {
                return ({ message: "Here is the list of users", users })
            } else {
                return ({ message: "Oops there is no user" })
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('logout')
    async userLogout(@Res() res: Response) {
        try {
            res.clearCookie('ecommercetoken');
            //console.log(req['userId'])
            return res.status(200).json({ message: 'user logged out' })
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('/:id')
    async getUser(@Param('id') id: string) {
        try {
            const user = await this.userService.getUser(id);
            if (!user) {
                throw new HttpException(`user doesn't exist`, HttpStatus.BAD_REQUEST);
            }
            return ({ message: 'Here is user', user })
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('signin')
    async signin(@Body() signinDto: UserDto, @Res() res: Response) {
        try {
            const user = await this.userService.getUserByEmail(signinDto.email);
            if (!user) {
                throw new HttpException('Invalid creditials', HttpStatus.BAD_REQUEST);
            }

            if (signinDto.password != user.password) {
                throw new HttpException('Invalid creditials', HttpStatus.BAD_REQUEST);
            }

            res.cookie('ecommercetoken', { id: user.id }, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });

            return res.status(200).json({ message: "user signed in", user });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('create')
    async createUser(@Body() createUserDto: UserDto) {
        try {
            //console.log(createUserDto);
            const didItCreate = await this.userService.createUser(createUserDto);
            if (didItCreate) {
                return ({ message: "User Created", user: didItCreate });
            } else {
                throw new HttpException("Unable to create User", HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('checkout/:userId')
    async checkout(@Req() req: Request, @Param('userId') userId) {
        try {
            //const userId = req['userId'];
            const user = await this.userService.getUserEmailAndPhoneNumber(userId);
            //console.log(`User email: ${user.email}`);
            //console.log(`User phone number: ${user.phoneNumber}`);

            const productIds = await this.userService.getProductIdsInCart(userId);
            const products = await this.userService.getProductsByIds(productIds);
            //console.log(products);

            const totalAmount = await this.userService.sumPrices(productIds);
            //console.log(`Total amount: ${totalAmount}`);

            // send email using Twilio SendGrid
            // const emailContent = `Thank you for your purchase at Chronos!\n\nTotal amount: ${totalAmount}\n\nProducts: ${JSON.stringify(products)}`;
            // await this.userService.sendEmail(user.email, 'Your Purchase Receipt', emailContent);

            // send SMS using Twilio SMS API
            //const smsContent = `Thank you for your purchase at Chronos! Total amount: ${totalAmount}`;
            //await this.userService.sendSms(user.phoneNumber, smsContent);

            await this.userService.updateCheckout(userId, products, totalAmount);

            return ({ message: "checkout successfully", products, totalAmount })

        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Put('update/:id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UserDto) {
        try {
            const updateUser = await this.userService.updateUser(id, updateUserDto)
            if (updateUser == null) {
                throw new HttpException("User with id doesn't exist", HttpStatus.NOT_FOUND);
            }
            return ({ message: "User updated", user: updateUser });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete('delete/:id')
    async deleteUser(@Param('id') id: string) {
        try {
            await this.userService.deleteUser(id);
            return ({ message: "User Deleted" });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('cart/:userId/:productId')
    async addToCart(@Param('productId') productId: string, @Param('userId') userId, @Req() req: Request) {
        try {
            //const userId = req['userId'];
            const user = await this.userService.addToCart(userId, productId);
            return ({ message: "product added to cart", user })
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete('cart/:userId/:productId')
    async removeFromCart(@Param('productId') productId: string, @Param('userId') userId, @Req() req: Request) {
        try {
            //const userId = req['userId'];
            const user = await this.userService.removeFromCart(userId, productId);
            return ({ message: "product removed from cart", user })
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

}
