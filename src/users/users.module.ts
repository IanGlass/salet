import { Module, MiddlewareConsumer } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { AuthService } from './auth.service';
import { CurrentUserMiddleware } from './middlewares/current-user.middlewares';

@Module({
  providers: [UsersService, AuthService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
