import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
  })
  findAll() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id',
  })
  getUser(@Param('id') id: string) {
    return this.usersService.getUser({ id });
  }

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
