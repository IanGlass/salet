import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    if ((await this.usersService.find(email)).length) {
      throw new BadRequestException('Email in use');
    }

    const hash = await bcrypt.hash(password, 10);

    return this.usersService.create(email, hash);
  }

  async login(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new BadRequestException('Incorrect email or password');
    }

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      throw new BadRequestException('Incorrect email or password');
    }

    return user;
  }
}
