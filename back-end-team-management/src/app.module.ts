import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { TeamsModule } from './teams/teams.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'back-end-team-management',
    }),
    TeamsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
