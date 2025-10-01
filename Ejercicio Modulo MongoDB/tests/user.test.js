import Database from '../config/db.js';
import UserDAO from '../dataAccess/userDAO.js';

describe('User Model Test', () => {
    let database;
    let userDAO;

    beforeAll(async () => {
        database = new Database();
        await database.connect();
        userDAO = new UserDAO();
    });

    afterAll(async () => {
        await database.disconnect();
    });

    afterEach(async () => {
        // Limpiar la colección después de cada test
        const collection = database.obtenerColeccion('users');
        await collection.deleteMany({});
    });

    it('should create a user', async () => {
        const user = { username: 'testuser', email: 'test@example.com' };
        const userId = await userDAO.crear(user);
        expect(userId).toBeDefined();
    });

    it('should get all users', async () => {
        await userDAO.crear({ username: 'user1', email: 'user1@example.com' });
        await userDAO.crear({ username: 'user2', email: 'user2@example.com' });

        const users = await userDAO.obtenerTodos();
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(2);
    });

    it('should get a user by ID', async () => {
        const user = { username: 'specificuser', email: 'specific@example.com' };
        const userId = await userDAO.crear(user);
        const foundUser = await userDAO.obtenerPorId(userId);
        expect(foundUser).toEqual(expect.objectContaining(user));
    });

    it('should update a user', async () => {
        const user = { username: 'updatableuser', email: 'updatable@example.com' };
        const userId = await userDAO.crear(user);
        const updatedUser = { username: 'updateduser', email: 'updated@example.com' };
        const isUpdated = await userDAO.actualizar(userId, updatedUser);
        expect(isUpdated).toBe(true);
        const foundUser = await userDAO.obtenerPorId(userId);
        expect(foundUser).toEqual(expect.objectContaining(updatedUser));
    });

    it('should delete a user', async () => {
        const user = { username: 'deletableuser', email: 'deletable@example.com' };
        const userId = await userDAO.crear(user);
        const isDeleted = await userDAO.eliminar(userId);
        expect(isDeleted).toBe(true);
        const foundUser = await userDAO.obtenerPorId(userId);
        expect(foundUser).toBeNull();
    });
});