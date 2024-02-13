import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
	modelName: 'tbl_users'
})
export class User extends Model<User>{
	@Column({
		type: DataType.STRING,
		unique: true,
		allowNull: false,
	})
	email: string;

	@Column({
		type: DataType.STRING,
	})
	password: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	role: string;

	@Column({
		type: DataType.STRING,
		field: 'first_name'
	})
	firstName: string;

	@Column({
		type: DataType.STRING,
		field: 'last_name'
	})
	lastName: string;

	@Column({
		type: DataType.INTEGER,
	})
	status: number;

	@Column({
		type: DataType.STRING,
		field: 'phone_number'
	})
	phoneNumber: string;

	@Column({
		type: DataType.STRING,
		field: 'registration_status'
	})
	registrationStatus: string;

	@Column({
		type: DataType.STRING,
		field: 'verification_link'
	})
	verificationLink: string;

	@Column({
		type: DataType.STRING,
		field: 'profile_pic'
	})
	profilePic: string;

	@Column({
		type: DataType.STRING,
		field: 'reset_password_code'
	})
	resetPasswordCode: string;
	
	@Column({
		type: DataType.INTEGER,
		field: 'created_by'
	})
	createdBy: number;

	@Column({
		type: DataType.INTEGER,
		field: 'updated_by'
	})
	updatedBy: number;

	@Column({
		type: DataType.DATE,
	})
	createdAt: Date;

	@Column({
		type: DataType.DATE,
	})
	updatedAt: Date;
}