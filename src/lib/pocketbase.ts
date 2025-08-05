/**
 * Legacy PocketBase utilities - being replaced by domain architecture
 * This file maintains backward compatibility during migration
 */

// Re-export from new architecture for backward compatibility
export { PocketBaseConfig as pb } from './infrastructure/config/PocketBaseConfig';

// Legacy interfaces - maintained for compatibility
export interface PocketBaseRecord {
  id: string;
  created: string;
  updated: string;
  collectionId?: string;
  collectionName?: string;
  [key: string]: unknown;
}

export interface Collection {
  id: string;
  name: string;
  type: string;
  system: boolean;
  schema: Array<{
    id: string;
    name: string;
    type: string;
    required: boolean;
    options?: unknown;
  }>;
  [key: string]: unknown;
}

// Legacy functions - delegating to new architecture
import { PocketBaseConfig } from './infrastructure/config/PocketBaseConfig';
import { Container } from './infrastructure/di/Container';

const container = Container.getInstance();

export async function login(email: string, password: string) {
  const pb = PocketBaseConfig.getInstance();
  
  // List of user collections to try (based on screenshot)
  const userCollections = [
    'users',
    'default_users', 
    'botpl_users_dc',
    'hr_users',
    'mo_users',
    'suitfabric_login',
    '_pb_users_auth_'
  ];

  console.log('Starting login attempts for:', { email, collections: userCollections });

  // Try admin login first
  try {
    console.log('Trying admin login...');
    const authData = await pb.admins.authWithPassword(email, password);
    console.log('✅ Admin login successful');
    return authData;
  } catch (adminError) {
    console.log('❌ Admin login failed:', adminError);
  }

  // Try each user collection
  for (const collectionName of userCollections) {
    try {
      console.log(`Trying ${collectionName} collection...`);
      const authData = await pb.collection(collectionName).authWithPassword(email, password);
      console.log(`✅ Login successful with ${collectionName} collection`);
      return authData;
    } catch (error) {
      console.log(`❌ ${collectionName} failed:`, error);
      continue;
    }
  }

  // If all failed, throw a comprehensive error
  throw new Error(`Login failed: Email/password not found in any user collection (${userCollections.join(', ')}) or admin accounts. Please check credentials or contact administrator.`);
}

export function logout() {
  PocketBaseConfig.getInstance().authStore.clear();
}

export function isAuthenticated(): boolean {
  return PocketBaseConfig.isAuthenticated();
}

export function getCurrentUser() {
  return PocketBaseConfig.getCurrentUser();
}

export async function getCollections(): Promise<Collection[]> {
  try {
    const collections = await container.collectionRepository.findUserCollections();
    return collections.map(entity => ({
      id: entity.id,
      name: entity.name,
      type: entity.type,
      system: entity.system,
      schema: entity.schema
    }));
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
}

export async function getRecordsByCollection(collectionName: string): Promise<PocketBaseRecord[]> {
  try {
    const records = await container.recordRepository.findByCollection(collectionName);
    return records.map(entity => entity.toPlainObject());
  } catch (error) {
    console.error(`Error fetching records from ${collectionName}:`, error);
    throw error;
  }
}

export async function getEbosR1sRecords() {
  return getRecordsByCollection('ebos_r1s');
}