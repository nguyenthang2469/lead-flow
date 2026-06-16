import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsersList() {
    return this.usersService.getUsersList();
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUser({ id });
  }

  // @Post()
  // createUser(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.createUser(createUserDto);
  // }

  // @Patch(':id')
  // updateUser(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateUserDto: UpdateUserDto
  // ) {
  //   return this.usersService.updateUser(id, updateUserDto);
  // }

  // @Patch(':id/setting')
  // updateUserSetting(
  //   @Param('id', ParseIntPipe) userId: number,
  //   @Body() updateUserSettingDto: UpdateUserSettingDto
  // ) {
  //   return this.usersService.updateUserSetting(userId, updateUserSettingDto);
  // }

  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
