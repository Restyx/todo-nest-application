import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Project } from './entities/project.entity';

@UseGuards(JwtAuthGuard)
@ApiTags('project')
@ApiHeader({
  name: 'Authorization',
  description: 'Токен авторизации',
  example:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNlcmVuZV91c2VybmFtZTMiLCJzdWIiOjMsImlhdCI6MTcxOTg0OTM4NiwiZXhwIjoxNzE5OTM1Nzg2fQ.FyyaHf_qd6zcog_65pjeWE_fJu8aw6FWfyzn_fHYjfs',
})
@ApiUnauthorizedResponse({ description: 'Невалидный Bearer токен' })
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Проект создан',
    type: Project,
  })
  create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto, req.user.userId);
  }

  @Get()
  @ApiOkResponse({ description: 'Проекты найдены', type: [Project] })
  findAll(@Request() req) {
    return this.projectService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Проект  найден', type: Project })
  @ApiNotFoundResponse({
    description: 'Проект с указанным id принадлежащий пользователю не найден',
  })
  // @ApiForbiddenResponse({ description: 'Проект не принадлежит пользователю' })
  findOne(@Request() req, @Param('id') id: number) {
    return this.projectService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Проект успешно обнавлен', type: Project })
  @ApiNotFoundResponse({
    description: 'Проект с указанным id принадлежащий пользователю не найден',
  })
  // @ApiForbiddenResponse({ description: 'Проект не принадлежит пользователю' })
  update(
    @Request() req,
    @Param('id') id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, updateProjectDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Проект успешно удалён' })
  @ApiNotFoundResponse({
    description: 'Проект с указанным id принадлежащий пользователю не найден',
  })
  // @ApiForbiddenResponse({ description: 'Проект не принадлежит пользователю' })
  remove(@Request() req, @Param('id') id: number) {
    return this.projectService.remove(id, req.user.userId);
  }
}
