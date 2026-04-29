export abstract class AbstractUserService {
    abstract findUserById(userId: string): Promise<any>;
}