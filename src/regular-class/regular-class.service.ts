import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegularClass } from './entities/regular-class.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { KitchenStudioService } from '#/kitchen_studio/kitchen_studio.service';
import { TrainingThemeService } from '#/training_theme/training_theme.service';
import { CreateRegClassDto } from './dto/create-regular-class.dto';
import { UpdateRegClassDto } from './dto/update-regular-class.dto';

@Injectable()
export class RegularClassService {
    constructor(
        @InjectRepository(RegularClass)
        private regClassRepo: Repository<RegularClass>,
        private trainingThemeService: TrainingThemeService,
        private kitchenStudioService: KitchenStudioService
    ){}

    getAll(){
        return this.regClassRepo.findAndCount()
    }
    
    async findById(id: string){
        try{
            return await this.regClassRepo.findOneOrFail({
                where:{id}
            })
        }catch(e){
            if(e instanceof EntityNotFoundError){
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        error: "data not found"
                    },
                    HttpStatus.NOT_FOUND
                )
            }
        }
    }

    async createPengajuan(createRegClassDto: CreateRegClassDto){
        try{
            const themeId = await this.trainingThemeService.findOneById(createRegClassDto.theme_id)
            const kitchenId = await this.kitchenStudioService.getKitchenStudioById(createRegClassDto.kitchen_id)
            const regular = new RegularClass
            regular.kitchen = kitchenId
            regular.theme = themeId
            regular.courseName = createRegClassDto.courseName
            regular.startDate = createRegClassDto.startDate
            regular.endDate = createRegClassDto.endDate
            regular.numberOfBenches = createRegClassDto.numberOfBenches
            regular.adminFee = createRegClassDto.adminFee
            regular.price = createRegClassDto.price
            regular.description = createRegClassDto.description

            const buatPengajuan = await this.regClassRepo.insert(regular)
            const result = await this.regClassRepo.findOneOrFail({
                where:{id:buatPengajuan.identifiers[0].id}
            })
            return result;
        }catch(e){
            throw e
        }
    }

    async updatePengajuan(id: string, updateRegClassDto: UpdateRegClassDto){
        try{
            await this.findById(id)
            const theme = await this.trainingThemeService.findOneById(updateRegClassDto.theme_id)
            const pengajuan = new RegularClass
            pengajuan.theme = theme
            pengajuan.courseName = updateRegClassDto.courseName

            await this.regClassRepo.update(id, pengajuan)

            return await this.regClassRepo.findOneOrFail({
                where:{id}
            })
        }catch(e){

        }
    }

    async regClassByKitchen(id:string){
        try{
            const kitchen = await this.kitchenStudioService.getKitchenStudioById(id)
            return await this.regClassRepo.findAndCount({
                where:{kitchen:{id:kitchen.id}}
            })
        }catch(e){
            console.log("ga ada")
        }
    }
}
