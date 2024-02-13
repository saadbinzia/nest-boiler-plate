import { Sequelize } from "sequelize-typescript"
import entities from "src/entities";
import { ConfigService } from '@nestjs/config';

export const databaseProvider = [
	{
		provide: 'SEQUELIZE',
		inject: [ConfigService],
		useFactory: async (configService: ConfigService) => {
			const sequelize = new Sequelize({
				dialect: 'postgres',
				username: configService.get('DB_USER'),
				password: configService.get('DB_PASSWORD'),
				host: configService.get('DB_HOST'),
				port: configService.get('DB_PORT'),
				database: configService.get('DB'),
			});
			sequelize.addModels(entities);
			// NOTE: Do not enable this as per we are using migrations and don't want to syncs usign model first.
			// await sequelize.sync();
			return sequelize;
		},
	},
];