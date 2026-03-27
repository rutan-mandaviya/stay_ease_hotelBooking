import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user.model';
import { JwtPayloadDto } from 'src/common/dto/jwt-payload.dto';
import { ApiAnalytics, ApiOwnerDashboard } from './analytics.swagger';

@ApiAnalytics('Business Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOwnerDashboard()
  @Get('owner-dashboard')
  @Roles(UserRole.HOTEL_OWNER)
  getOwnerDashboard(@Req() req: { user: JwtPayloadDto }) {
    return this.analyticsService.getOwnerFullDashboard(req.user.id);
  }
}
