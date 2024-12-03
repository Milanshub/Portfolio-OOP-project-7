// Define an interface for a repository
export interface IRepository<T, CreateDTO, UpdateDTO> {
    // Define a method to find all entities
    findAll(): Promise<T[]>;
    // Define a method to find an entity by its ID
    findById(id: string): Promise<T | null>;
    // Define a method to create a new entity
    create(data: CreateDTO): Promise<T>;
    // Define a method to update an existing entity
    update(id: string, data: UpdateDTO): Promise<T | null>;
    // Define a method to delete an entity
    delete(id: string): Promise<boolean>;
  }; 