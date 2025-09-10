import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { Sequelize } from "sequelize-typescript";

describe("UserController (e2e)", () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    // Clean up the database after each test
    const sequelize = moduleFixture.get(Sequelize);
    await sequelize.truncate({ cascade: true });
  });

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const createUserDto = {
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      };

      const response = await request(app.getHttpServer())
        .post("/users")
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.email).toBe(createUserDto.email);
      expect(response.body.firstName).toBe(createUserDto.firstName);
      expect(response.body.lastName).toBe(createUserDto.lastName);
      expect(response.body.password).toBeUndefined();
    });

    it("should return 409 if email already exists", async () => {
      const createUserDto = {
        email: "duplicate@example.com",
        password: "password123",
        firstName: "Duplicate",
        lastName: "User",
      };

      // First create a user
      await request(app.getHttpServer())
        .post("/users")
        .send(createUserDto)
        .expect(201);

      // Try to create another user with the same email
      const response = await request(app.getHttpServer())
        .post("/users")
        .send(createUserDto)
        .expect(409);

      expect(response.body.message).toBe("Email is already registered");
    });

    it("should return 400 for invalid email", async () => {
      const response = await request(app.getHttpServer())
        .post("/users")
        .send({
          email: "invalid-email",
          password: "password123",
          firstName: "Test",
          lastName: "User",
        })
        .expect(400);

      expect(response.body.message).toContain("email must be an email");
    });

    it("should return 400 for short password", async () => {
      const response = await request(app.getHttpServer())
        .post("/users")
        .send({
          email: "test@example.com",
          password: "short",
          firstName: "Test",
          lastName: "User",
        })
        .expect(400);

      expect(response.body.message).toContain(
        "password must be longer than or equal to 8 characters",
      );
    });
  });
});
