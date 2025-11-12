import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => {
        const raw = cs.get<string>('JWT_EXPIRES', '3600');

        // if it's all digits -> use number seconds, else pass as ms-style string (e.g., "1h")
        const expiresIn = /^\d+$/.test(raw) ? Number(raw) : (raw as any);

        return {
          secret: cs.get<string>('JWT_SECRET', 'dev-secret'),
          signOptions: { expiresIn }, // number or "1h"/"3600s"
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
